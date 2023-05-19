/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require("./jest.base.config");

module.exports = {
    ...baseConfig,
    // prettier-ignore
    // eslint-disable-next-line no-useless-escape
    testRegex: "^.*?unit\/.*\.(spec|test).ts$",
    collectCoverage: true,
    coverageDirectory: process.env["COVERAGE_DIR"] || "coverage",
    coverageReporters: ["text", "cobertura"],
    setupFilesAfterEnv: ["<rootDir>/tests/unit/setup.ts"],
};
