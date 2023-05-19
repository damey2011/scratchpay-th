import {ClinicResultResponseType} from "../../../src/schemas/responses";
import config from "../../../src/config";

const ENDPOINT = "/api/clinics"

describe(ENDPOINT, () => {
    it("Returns a list of clinics and 200 with valid request", async () => {
        const response = await global.testServer.inject({
            url: ENDPOINT,
            method: "GET"
        })
        const data = response.json() as ClinicResultResponseType
        expect(response.statusCode).toBe(200)
        expect(data.results.length).toBe(10)
        expect(data.pageSize).toBe(config.DEFAULT_PAGE_SIZE)
    })

    it("Returns a specified page size", async () => {
        const response = await global.testServer.inject({
            url: ENDPOINT,
            method: "GET",
            query: {
                pageSize: "5",
            }
        })
        const data = response.json() as ClinicResultResponseType
        expect(response.statusCode).toBe(200)
        expect(data.results.length).toBe(5)
        expect(data.pageSize).toBe(5)
    })

    it("Page is empty when no clinic match results", async () => {
        const response = await global.testServer.inject({
            url: ENDPOINT,
            method: "GET",
            query: {
                state: "A_NON_EXISTENT_STATE"
            }
        })
        const data = response.json() as ClinicResultResponseType
        expect(response.statusCode).toBe(200)
        expect(data.results.length).toBe(0)
    })
})