import {FastifyInstance} from "fastify";

declare global {
    // eslint-disable-next-line no-var
    var testServer: FastifyInstance;
}
