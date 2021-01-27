module.exports = {
    // setupFiles: ["dotenv/config"],
    collectCoverageFrom: [
      "server/**/*.js",
      "!server/**/*.test.js",
      "!server/controller/User.js",
      "!/node_modules/",
    ],
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.json"
        }
    },
    moduleFileExtensions: [
        "ts",
        "js"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        "**/test/**/*.test.(ts|js)"
    ],
    projects: [
      {
        displayName: "backend",
        testEnvironment: "node",
        testMatch: ["<rootDir>/**/*.test.js"],
      }
    ],
  };
  