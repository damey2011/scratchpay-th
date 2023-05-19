import {Type, Static} from "@sinclair/typebox";

export const ClinicSchema =  Type.Object({
    name: Type.String(),
    state: Type.String(),
    stateCode: Type.String(),
    availability: Type.Object({
        from: Type.String(),
        to: Type.String()
    })
})
export const ClinicResultResponseSchema = Type.Object({
    results: Type.Array(ClinicSchema),
    nextCursor: Type.Number(),
    pageSize: Type.Number(),
})

export type ClinicResultResponseType = Static<typeof ClinicResultResponseSchema>
