import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};

export default config;
