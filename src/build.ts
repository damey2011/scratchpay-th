import Fastify, {FastifyError, FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import autoload from "@fastify/autoload";
import logger from "./observability/logger";
import path from "path";
import {ErrorCode} from "./errors";
import {TypeBoxTypeProvider} from "@fastify/type-provider-typebox";

export const buildFastify = (): FastifyInstance => {
    const fastify = Fastify({
        logger,
        trustProxy: true,
        ajv: {
            customOptions: {
                strict: "log",
                coerceTypes: true,
                allErrors: true,
                formats: {
                    "iso-time": true
                },
                keywords: ["kind", "modifier"], // To support typebox
            },
        },
    }).withTypeProvider<TypeBoxTypeProvider>()

    fastify.setErrorHandler(
        (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
            if (error.validation) {
                reply.status(422).send({
                    status: 422,
                    code: ErrorCode.SCHEMA_VALIDATION_ERROR,
                    message: error.message,
                });
            } else if (error.statusCode) {
                reply.status(error.statusCode).send({
                    status: error.statusCode,
                    code: error.code,
                    message: error.message,
                });
            } else {
                logger.error(error);
                reply.status(500).send({
                    status: 500,
                    code: ErrorCode.GENERAL,
                    message: error.message,
                });
            }
        },
    );

    fastify.register(autoload, {
        dir: path.join(__dirname, "plugins"),
    });

    return fastify
}
export const fastify = buildFastify()