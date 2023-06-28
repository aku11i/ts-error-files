import { strictEqual } from "node:assert";
import { execSync } from "node:child_process";
import { afterEach, describe, it } from "node:test";

const module = process.env["MODULE"];

const bin = [
  "node",
  "--experimental-import-meta-resolve",
  "node_modules/.bin/ts-error-files",
].join(" ");

const cwd = process.cwd();

describe("--help option", () => {
  afterEach(() => {
    process.chdir(cwd);
  });

  it("should print help message", () => {
    process.chdir(`test-cases/${module}-no-errors`);
    const command = `${bin} --help`;

    const result = execSync(command).toString();

    const expected =
      [
        "Usage: ts-error-files [options]",
        "",
        "Options:",
        "  -p, --project <path>  Path to tsconfig.json or it's directory",
        "  -r, --reason         Print reason of error",
        "  -P, --position       Print position of error",
        "  -h, --help           Display this help message",
      ].join("\n") + "\n";

    strictEqual(result, expected);
  });
});
