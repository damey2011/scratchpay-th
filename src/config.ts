import {Type} from "@sinclair/typebox";
import envSchema from "env-schema";
import Ajv from "ajv";

export enum Environment {
    TEST = "test",
    PROD = "prod",
    DEV = "dev"
}

const configSchema = Type.Object({
    VERSION: Type.String(),
    ENV: Type.Enum(Environment),
    APP_PORT: Type.Number(),
    DEFAULT_PAGE_SIZE: Type.Number(),
    DATASOURCES: Type.String(),
})

const configData = envSchema({
    dotenv: true,
    schema: configSchema,
    ajv: new Ajv({
        allErrors: true,
        removeAdditional: true,
        useDefaults: true,
        coerceTypes: true,
        allowUnionTypes: true
    })
})
export default configData