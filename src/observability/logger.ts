import pino from "pino";
import {FastifyReply, FastifyRequest} from "fastify";
import {isLocalOrTestEnv} from "../helpers";

export default pino({
    level: isLocalOrTestEnv() ? "debug" : "info",
    mixin() {
        return {subService: "api"};
    },
    destination: pino.destination({
        sync: false,
    }),
    // https://github.com/pinojs/pino/issues/1268
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
    messageKey: "message",
    formatters: {
        level(label: string, level: number) {
            return {level: label};
        },
    },
    redact: ["req.headers.authorization"],
    serializers: {
        res(reply: FastifyReply) {
            return {
                statusCode: reply.statusCode,
            };
        },
        req(request: FastifyRequest) {
            return {
                method: request.method,
                url: request.url,
                path: request.routerPath,
                parameters: request.params,
                headers: request.headers,
            };
        },
    },
});