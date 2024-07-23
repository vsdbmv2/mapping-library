import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
	preset: "ts-jest",
	testEnvironment: "node",
	verbose: true,
	maxWorkers: "90%",
};
export default config;
