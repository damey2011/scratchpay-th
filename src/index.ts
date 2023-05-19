import {fastify} from "./build";
import config from "./config";
import logger from "./observability/logger";


fastify.listen({ host: "0.0.0.0", port: config.APP_PORT as number }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  logger.info(`Server listening at ${address}`)
})
