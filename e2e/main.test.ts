import { execSync } from "child_process";
import { strictEqual } from "node:assert";
import { afterEach, describe, it } from "node:test";

const module = process.env["MODULE"];

const bin = [
  "node",
  "--experimental-import-meta-resolve",
  "node_modules/.bin/ts-error-files",
].join(" ");

const cwd = process.cwd();

describe("ts-error-files", () => {
  afterEach(() => {
    process.chdir(cwd);
  });

  it("should print nothing when tsc is succeeded", () => {
    process.chdir(`test-cases/${module}-no-errors`);
    const command = `${bin}`;

    const result = execSync(command).toString();

    const expected = "\n";

    strictEqual(result, expected);
  });

  it("should print error files when tsc detects any errors", () => {
    process.chdir(`test-cases/${module}-has-errors`);
    const command = `${bin}`;

    const result = execSync(command).toString();

    const expected = [`syntax-error.ts`, `type-error.ts`].join("\n") + "\n";

    strictEqual(result, expected);
  });

  describe("--project option", () => {
    afterEach(() => {
      process.chdir(cwd);
    });

    it(`should parse directory path`, () => {
      process.chdir(`test-cases/${module}-has-errors`);
      const command = `${bin} --project ./`;

      const result = execSync(command).toString();

      const expected = [`syntax-error.ts`, `type-error.ts`].join("\n") + "\n";

      strictEqual(result, expected);
    });

    it(`should parse tsconfig path`, () => {
      process.chdir(`test-cases/${module}-has-errors`);
      const command = `${bin} --project ./tsconfig.json`;

      const result = execSync(command).toString();

      const expected = [`syntax-error.ts`, `type-error.ts`].join("\n") + "\n";

      strictEqual(result, expected);
    });
  });

  describe("--position option", () => {
    afterEach(() => {
      process.chdir(cwd);
    });

    it("should print position", () => {
      process.chdir(`test-cases/${module}-has-errors`);
      const command = `${bin} --position`;

      const result = execSync(command).toString();

      const expected =
        [`syntax-error.ts:2:0`, `type-error.ts:3:4`].join("\n") + "\n";

      strictEqual(result, expected);
    });

    describe("--reason option", () => {
      afterEach(() => {
        process.chdir(cwd);
      });

      it("should print reason", () => {
        process.chdir(`test-cases/${module}-has-errors`);
        const command = `${bin} --reason`;

        const result = execSync(command).toString();

        const expected =
          [
            `syntax-error.ts "'}' expected."`,
            `type-error.ts "Property 'age' is missing in type '{ name: string; }' but required in type 'User'."`,
          ].join("\n") + "\n";

        strictEqual(result, expected);
      });
    });

    describe("--position and --reason options", () => {
      afterEach(() => {
        process.chdir(cwd);
      });

      it("should print position and reason", () => {
        process.chdir(`test-cases/${module}-has-errors`);
        const command = `${bin} --position --reason`;

        const result = execSync(command).toString();

        const expected =
          [
            `syntax-error.ts:2:0 "'}' expected."`,
            `type-error.ts:3:4 "Property 'age' is missing in type '{ name: string; }' but required in type 'User'."`,
          ].join("\n") + "\n";

        strictEqual(result, expected);
      });
    });
  });
});
