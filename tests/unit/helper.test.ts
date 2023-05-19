import {_compareForMatch, cleanTimeString, transformClinicObject} from "../../src/helpers";
import Clinic from "../../src/types/clinic";
import {ClinicQueryType} from "../../src/schemas/queries";

const TEST_CLINIC: Clinic = {
    name: "Mayo Clinic",
    stateCode: "FL",
    state: "Florida",
    availability: {
        from: "09:00",
        to: "20:00"
    }
}

describe("helper file", () => {
    it("transformClinicObject transforms vet clinic object correctly", () => {
        const output = transformClinicObject({
            "clinicName": "City Vet Clinic",
            "stateCode": "NV",
            "opening": {
                "from": "10:00",
                "to": "22:00"
            }
        })
        const expected: Clinic = {
            name: "City Vet Clinic",
            stateCode: "NV",
            state: "Nevada",
            availability: {
                from: "10:00",
                to: "22:00"
            }
        }
        expect(output).toMatchObject(expected)
    })

    it("transformClinicObject transforms dental clinic object correctly", () => {
        const output = transformClinicObject({
            "name": "Mayo Clinic",
            "stateName": "Florida",
            "availability": {
                "from": "09:00",
                "to": "20:00"
            }
        })
        expect(output).toMatchObject(TEST_CLINIC)
    })

    it.each([
        ["22:00", 2200],
        ["2200", 2200],
        ["00:00", 0],
    ])("cleanTimeString should return an ISO time without timezone", (input: string, expected: number) => {
        expect(cleanTimeString(input)).toBe(expected)
    })

    it.each([
        [
            {
                availableFrom: "08:00",
                availableTo: "19:00",
                stateCode: "FL"
            },
            true
        ],
        [
            {
                availableFrom: "10:00",
                availableTo: "14:00",
                stateCode: "NJ"
            },
            false
        ],
        [
            {
                availableFrom: "05:00",
                availableTo: "11:00",
                stateCode: "NJ"
            },
            false
        ],
        [
            {
                availableFrom: "05:00",
                availableTo: "11:00",
                stateCode: "FL"
            },
            true
        ],
        [
            {
                availableFrom: "05:00",
                availableTo: "11:00",
                stateCode: "FL",
                name: "mayo clinic"
            },
            true
        ],
    ])("clinic compare function filters with multiple attributes", (filterObj: Partial<ClinicQueryType>, expected: boolean) => {
        const results: Clinic[] = []
        const isMatch = _compareForMatch({
            value: {},
            key: 0
        }, TEST_CLINIC, results, filterObj)

        expect(isMatch).toBe(expected)
    })
})