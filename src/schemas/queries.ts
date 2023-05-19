import {Type, Static} from "@sinclair/typebox";
import {codeToName} from "../constants/states";

export const ClinicQuerySchema = Type.Object({
    name: Type.Optional(Type.String()),
    state: Type.Optional(Type.String({examples: ["", ...Object.values(codeToName)]})),
    stateCode: Type.Optional(Type.String({examples: ["", ...Object.keys(codeToName)]})),
    availableFrom: Type.Optional(Type.String({
        format: "iso-time",
        pattern: "([0-9]{2})\:([0-9]{2})",
        description: "Time in ISO format. e.g. 15:00",
    })),
    availableTo: Type.Optional(Type.String({
        format: "iso-time",
        pattern: "([0-9]{2})\:([0-9]{2})",
        description: "Time in ISO format. e.g. 20:00",
    })),
    cursor: Type.Optional(Type.Number()),
    pageSize: Type.Optional(Type.Number({minimum: 1}))
})

export type ClinicQueryType = Static<typeof ClinicQuerySchema>
