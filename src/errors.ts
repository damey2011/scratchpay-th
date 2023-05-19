import createError from "@fastify/error";

export enum ErrorCode {
    GENERAL="GENERAL",
    SCHEMA_VALIDATION_ERROR= "SCHEMA_VALIDATION_ERROR",
}

export const QueryValidationError = createError(ErrorCode.SCHEMA_VALIDATION_ERROR, "%s", 422);