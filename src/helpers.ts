import config, {Environment} from "./config";
import path from "path";
import fs, {ReadStream} from "fs";
import {Readable} from "stream";
import {chain} from "stream-chain";
import {parser} from "stream-json";
import {streamArray} from "stream-json/streamers/StreamArray"
import {ClinicQueryType} from "./schemas/queries";
import Clinic from "./types/clinic";
import {codeToName, nameToCode} from "./constants/states";
import * as Moment from 'moment';
import {extendMoment} from 'moment-range';

const moment = extendMoment(Moment);

export const isLocalOrTestEnv = (): boolean => {
    return [Environment.DEV, Environment.TEST].includes(config.ENV as Environment)
}

export const supportedDataSources = (): string[] => {
    return (config.DATASOURCES as string).split(",")
}

export const transformClinicObject = (clinicObject: Record<string, any>): Clinic => {
    if (clinicObject["clinicName"]) {
        // it's a vet clinic
        return {
            name: clinicObject["clinicName"],
            // @ts-ignore
            state: codeToName[clinicObject["stateCode"]],
            stateCode: clinicObject["stateCode"],
            availability: {
                from: clinicObject["opening"]["from"],
                to: clinicObject["opening"]["to"],
            }
        }
    }

    return {
        name: clinicObject["name"],
        stateCode: nameToCode[clinicObject["stateName"]],
        state: clinicObject["stateName"],
        availability: clinicObject["availability"]
    }
}

export const cleanTimeString = (timeString: string): Number => {
    return parseInt(timeString.replace(":", ""))
}

async function* mergeStreams(streams: ReadStream[]): AsyncGenerator<any, void> {
    for (const stream of streams) {
        for await (const chunk of stream) {
            yield chunk
        }
    }
}

export const buildDateTimeWithPlaceholder = (time: string): Date => {
    const [hh, mm] = time.split(":")
    return new Date(Date.UTC(2023, 0, 1, parseInt(hh), parseInt(mm)))
}

export const _compareForMatch = (
    data: any, transformedClinic: Clinic, results: Clinic[], filter?: ClinicQueryType
): boolean | null => {
    const filterFunctions: ((clinic: Clinic) => boolean)[] = []

    if (filter) {
        filter.name && filterFunctions.push(clinic => clinic.name.toLowerCase() === filter.name?.toLowerCase())
        filter.state && filterFunctions.push(clinic => clinic.state.toLowerCase() === filter.state?.toLowerCase())
        filter.stateCode && filterFunctions.push(clinic => clinic.stateCode.toLowerCase() === filter.stateCode?.toLowerCase())

        filterFunctions.push(clinic => {
            const {availableFrom, availableTo} = filter;
            const filterFrom = availableFrom ?? transformedClinic.availability.from
            const filterTo = availableTo ?? transformedClinic.availability.to

            return moment.range(
                buildDateTimeWithPlaceholder(clinic.availability.from),
                buildDateTimeWithPlaceholder(clinic.availability.to)
            ).overlaps(
                moment.range(
                    buildDateTimeWithPlaceholder(filterFrom),
                    buildDateTimeWithPlaceholder(filterTo)
                )
            )
        })
    }

    return filterFunctions.length === 0 || filterFunctions.every(filterFunction => filterFunction(transformedClinic))
}

export const findClinic = async <C>(
    filter?: ClinicQueryType,
): Promise<{
    total: number,
    clinics: Clinic[],
    endCursor: number
}> => {
    const streams = await mergeStreams(
        supportedDataSources().map((datasource: string) => {
            return fs.createReadStream(path.join(__dirname, `datasource/${datasource}`))
        })
    )

    const readableStream = Readable.from(streams);
    const pageSize = filter?.pageSize ?? config.DEFAULT_PAGE_SIZE as number
    let movingCursor = 0
    let endCursor = 0
    let total = 0
    const results: Clinic[] = []

    return new Promise((res: CallableFunction, rej: CallableFunction) => {
        const pipeline = chain([
            readableStream,
            parser({jsonStreaming: true}),
            streamArray(),
            (data: any): Clinic | null => {
                movingCursor = data.key
                // Do not process if does not match pagination parameters
                if (data.key < (filter?.cursor ?? 0) || endCursor) return null
                const transformedClinic = transformClinicObject(data.value);
                const isAMatch = _compareForMatch(data, transformedClinic, results, filter)
                if (results.length === pageSize - 1 && isAMatch) {
                    // Since the result is populated in the `on:data`, it won't be part of this array at this point
                    endCursor = data.key
                }
                return isAMatch ? transformedClinic : null
            }
        ]);

        pipeline.on('data', (chunk) => {
            results.push(chunk)
            if (endCursor) pipeline.end()
        });
        pipeline.on('end', () => res({
            endCursor: endCursor ?? movingCursor,
            total,
            clinics: results
        }))
        pipeline.on('error', (err: Error) => rej(err))
    })
}
