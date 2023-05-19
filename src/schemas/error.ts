import {Type} from "@sinclair/typebox";
import {ErrorCode} from "../errors";

export const ErrorSchema = Type.Object({
    status: Type.Number(),
    code: Type.Enum(ErrorCode),
    message: Type.String(),
});
