#!/usr/bin/env node

import { ParseArgsConfig, parseArgs } from "util";
import * as fs from "node:fs";
import * as path from "node:path";
import { Project } from "ts-morph";
import { findErrorDiagnostics } from "./find-error-diagnostics.js";
import { listFilesFromDiagnostics } from "./list-files-from-diagnostics.js";

const [, , ...args] = process.argv;

const options: ParseArgsConfig["options"] = {
  config: {
    type: "string",
    short: "c",
    default: "tsconfig.json",
  },
  help: {
    type: "boolean",
    short: "h",
    default: false,
  },
};

// TODO Validation
const { values } = parseArgs({ options, args });

const help = typeof values["help"] === "boolean" && values["help"];

if (help) {
  const message = [
    "Usage: ts-error-files [options]",
    "",
    "Options:",
    "  -c, --config <path>  Path to tsconfig.json or its directory",
    "  -h, --help           Display this help message",
  ].join("\n");

  console.log(message);

  process.exit(0);
}

const tsConfigFilePath = (() => {
  const maybe = values["config"] as string;

  // TODO existing check
  return fs.statSync(maybe).isDirectory()
    ? path.join(maybe, "tsconfig.json")
    : maybe;
})();

const project = new Project({ tsConfigFilePath });
const program = project.getProgram();

const errorDiagnostics = findErrorDiagnostics(program);
const errorFiles = listFilesFromDiagnostics(errorDiagnostics);

console.log(errorFiles.join("\n"));
