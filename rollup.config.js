import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default {
	input: pkg.source,
	output: [
		{
			name: pkg["umd:name"] || pkg.name,
			format: "esm",
			file: pkg.module,
			sourcemap: false,
			exports: "named",
		},
		{
			name: pkg["umd:name"] || pkg.name,
			format: "cjs",
			file: pkg.main,
			sourcemap: false,
			esModule: false,
			exports: "named",
		},
		{
			name: pkg["umd:name"] || pkg.name,
			format: "umd",
			file: pkg.unpkg,
			sourcemap: false,
			esModule: false,
			plugins: [terser()],
			exports: "named",
		},
	],
	external: [...require("module").builtinModules, ...Object.keys(pkg.dependencies || {})],
	plugins: [
		resolve({
			modulesOnly: true,
			browser: true,
		}),
		typescript({
			useTsconfigDeclarationDir: true,
		}),
	],
};
