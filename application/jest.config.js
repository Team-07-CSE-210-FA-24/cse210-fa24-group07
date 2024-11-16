// jest.config.js
module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "jsdom",
  testMatch: ["**/tests/**/*.test.js", "**/?(*.)+(spec|test).[jt]s?(x)"],

  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/index.js",
    "!**/node_modules/**",
  ],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
