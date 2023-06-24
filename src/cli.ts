#!/usr/bin/env node

import { ParseArgsConfig, parseArgs } from "util";
import * as fs from "node:fs";
import * as path from "node:path";
import { Project } from "ts-morph";
import { findErrorDiagnostics } from "./find-error-diagnostics.js";
import { printDiagnostics } from "./print-diagnostics.js";
import { findTsLibFolder } from "./find-ts-lib-folder.js";

const [, , ...args] = process.argv;

const options: ParseArgsConfig["options"] = {
  project: {
    type: "string",
    short: "p",
    default: process.cwd(),
  },
  help: {
    type: "boolean",
    short: "h",
    default: false,
  },
  reason: {
    type: "boolean",
    short: "r",
    default: false,
  },
  position: {
    type: "boolean",
    short: "P",
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
    "  -p, --project <path>  Path to tsconfig.json or it's directory",
    "  -r, --reason         Print reason of error",
    "  -P, --position       Print position of error",
    "  -h, --help           Display this help message",
  ].join("\n");

  console.log(message);

  process.exit(0);
}

const tsConfigFilePath = (() => {
  const maybe = values["project"] as string;

  // TODO existing check
  return fs.statSync(maybe).isDirectory()
    ? path.join(maybe, "tsconfig.json")
    : maybe;
})();

const tsLibPath = await findTsLibFolder(tsConfigFilePath);

const printReason = typeof values["reason"] === "boolean" && values["reason"];
const printPosition =
  typeof values["position"] === "boolean" && values["position"];

const project = new Project({
  tsConfigFilePath,
  ...(tsLibPath ? { libFolderPath: tsLibPath } : {}),
});

const errorDiagnostics = findErrorDiagnostics(project);

printDiagnostics(errorDiagnostics, { printPosition, printReason });
