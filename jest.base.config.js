/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        "^.+\\.(ts|tsx)?$": ["ts-jest", {
            isolatedModules: true,
        }]
    },
    maxWorkers: 1,
    testTimeout: 10000,
    maxConcurrency: 3,
};
