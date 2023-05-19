import {buildFastify} from "../../src/build";
import config from "../../src/config";


beforeAll(async () => {
    config.DATASOURCES = "___TEST1___.json,___TEST2___.json"
    global.testServer = buildFastify();
});

afterAll(async () => {
    await global.testServer.close();
});
