import { pathsToModuleNameMapper } from "ts-jest";
import tsconfig from "./tsconfig.paths.json";

const jestConfig = {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules"],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths),
};

export default jestConfig;
