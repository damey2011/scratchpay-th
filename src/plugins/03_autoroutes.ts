import { FastifyInstance } from "fastify";
import FastifyPlugin from "fastify-plugin";
import autoload from "@fastify/autoload";
import path from "path";
import logger from "../observability/logger";

export default FastifyPlugin(async (fastify: FastifyInstance) => {
    logger.info("Registering file-based routes plugin...");
    fastify.register(autoload, {
        dir: path.join(__dirname, "..", "routes"),
        ignorePattern: RegExp("swagger"),
    });
});
