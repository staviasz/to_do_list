const nextJest = require("next/jest");

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  preset: "./jest-preset.js",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/*.spec.{ts,tsx}"],
  clearMocks: true,

  moduleNameMapper: {
    "^@public/(.*)$": "<rootDir>/public/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

module.exports = createJestConfig(config);
