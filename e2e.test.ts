import { describe, it } from "node:test";
import { execSync } from "child_process";
import assert from "assert";

describe("ts-error-files", () => {
  it("should print nothing when tsc is succeeded", () => {
    const command = `npm --silent run dev -- --config test-cases/no-errors/tsconfig.json`;

    const result = execSync(command).toString();

    const expected = "\n";

    assert.strictEqual(result, expected);
  });

  it("should print error files when tsc detects any errors", () => {
    const command = `npm --silent run dev -- --config test-cases/has-errors/tsconfig.json`;

    const result = execSync(command).toString();

    const expected =
      [
        "test-cases/has-errors/type-error.ts",
        "test-cases/has-errors/syntax-error.ts",
      ].join("\n") + "\n";

    assert.strictEqual(result, expected);
  });

  describe("--config option", () => {
    it(`should complement "tsconfig.json" when directory path is specified`, () => {
      const command = `npm --silent run dev -- --config test-cases/has-errors`;

      const result = execSync(command).toString();

      const expected =
        [
          "test-cases/has-errors/type-error.ts",
          "test-cases/has-errors/syntax-error.ts",
        ].join("\n") + "\n";

      assert.strictEqual(result, expected);
    });
  });

  describe("--help option", () => {
    it("should print help message", () => {
      const command = `npm --silent run dev -- --help`;

      const result = execSync(command).toString();

      const expected =
        [
          "Usage: ts-error-files [options]",
          "",
          "Options:",
          "  -c, --config <path>  Path to tsconfig.json or its directory",
          "  -h, --help           Display this help message",
        ].join("\n") + "\n";

      assert.strictEqual(result, expected);
    });
  });

  describe("--position option", () => {
    it("should print position", () => {
      const command = `npm --silent run dev -- --config test-cases/has-errors --position`;

      const result = execSync(command).toString();

      const expected =
        [
          "test-cases/has-errors/type-error.ts:3:50",
          "test-cases/has-errors/syntax-error.ts:2:11",
        ].join("\n") + "\n";

      assert.strictEqual(result, expected);
    });
  });

  describe("--reason option", () => {
    it("should print reason", () => {
      const command = `npm --silent run dev -- --config test-cases/has-errors --reason`;

      const result = execSync(command).toString();

      const expected =
        [
          `test-cases/has-errors/type-error.ts "Property 'age' is missing in type '{ name: string; }' but required in type 'User'."`,
          `test-cases/has-errors/syntax-error.ts "'}' expected."`,
        ].join("\n") + "\n";

      assert.strictEqual(result, expected);
    });
  });

  describe("--position and --reason options", () => {
    it("should print position and reason", () => {
      const command = `npm --silent run dev -- --config test-cases/has-errors --position --reason`;

      const result = execSync(command).toString();

      const expected =
        [
          `test-cases/has-errors/type-error.ts:3:50 "Property 'age' is missing in type '{ name: string; }' but required in type 'User'."`,
          `test-cases/has-errors/syntax-error.ts:2:11 "'}' expected."`,
        ].join("\n") + "\n";

      assert.strictEqual(result, expected);
    });
  });
});
