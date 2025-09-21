module.exports = {
    transform: { "^.+\\.ts?$": "ts-jest" },
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["<rootDir>/src/__test__/**/*.test.ts"],
    moduleFileExtensions: ["ts", "node", "js"],
    verbose: true,
    forceExit: false,
    globals: {
        "ts-test": {
            useESM: true,
        },
    },
    coveragePathIgnorePatterns: ["/node_modules/"],
};
