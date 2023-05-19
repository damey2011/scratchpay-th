/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require("./jest.base.config");

module.exports = {
    ...baseConfig,
    // prettier-ignore
    // eslint-disable-next-line no-useless-escape
    testRegex: "^.*?integration\/.*\.(spec|test).ts$",
    setupFilesAfterEnv: ["./tests/integration/setup.ts"],
    globalSetup: "./tests/integration/globalSetup.ts",
    // globalTeardown: "./tests/integration/globalTeardown.ts"
};
