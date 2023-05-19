import {FastifyInstance, FastifyPluginOptions} from "fastify";
import FastifyPlugin from "fastify-plugin";
import swagger from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";
import logger from "../observability/logger";
import config from "../config";

export default FastifyPlugin(
    async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
        logger.info("Registering the plugin for swagger docs...");
        fastify.register(<any>swagger, {
            openapi: {
                info: {
                    title: "Clinic Search",
                    description: "Search a JSON file database",
                    version: config.VERSION,
                },
            },
            exposeRoute: true,
        });

        fastify.register(SwaggerUI, {
            routePrefix: "/docs"
        });
    },
);
