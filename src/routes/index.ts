import FastifyPlugin from "fastify-plugin";
import {FastifyInstance, FastifyPluginOptions, FastifyRequest} from "fastify";
import {ClinicResultResponseSchema, ClinicResultResponseType} from "../schemas/responses";
import {ClinicQuerySchema, ClinicQueryType} from "../schemas/queries";
import {findClinic} from "../helpers";
import config from "../config";
import {QueryValidationError} from "../errors";
import {ErrorSchema} from "../schemas/error";

export default FastifyPlugin(async (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    _done: CallableFunction,
) => {
    fastify.get("/api/clinics", {
        handler: async (request: FastifyRequest): Promise<ClinicResultResponseType> => {
            const queryParams = request.query as ClinicQueryType
            const {availableTo, availableFrom} = queryParams
            if (availableFrom && !availableTo || availableTo && !availableFrom) {
                throw new QueryValidationError("You need to provide both `availableFrom` and `availableTo` query params.")
            }

            const clinics = await findClinic(queryParams)
            return {
                results: clinics.clinics,
                nextCursor: clinics.endCursor ? clinics.endCursor + 1 : null,
                pageSize: (queryParams.pageSize ?? config.DEFAULT_PAGE_SIZE) as number
            }
        },
        schema: {
            response: {
                200: ClinicResultResponseSchema,
                400: {
                    description: "Query validation error",
                    ...ErrorSchema,
                }
            },
            querystring: ClinicQuerySchema
        }
    })
})
