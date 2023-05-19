import {FastifyInstance, FastifyPluginOptions} from "fastify";
import FastifyPlugin from "fastify-plugin";
import cors from "@fastify/cors";

export default FastifyPlugin(
    async (
        fastify: FastifyInstance,
        _opts: FastifyPluginOptions,
        _done: CallableFunction,
    ) => {
        // CORS is handled by the API gateway for dev and prod
        await fastify.register(cors, {
            origin: true,
            allowedHeaders: "*",
            methods: "*",
            credentials: true,
        });
    },
);
