import { describe, it } from "node:test";
import { execSync } from "child_process";
import assert from "assert";

describe("ts-error-files", () => {
  it("should print nothing when tsc is succeeded", () => {
    const command = `npm --silent run dev -- --project test-cases/no-errors/tsconfig.json`;

    const result = execSync(command).toString();

    const expected = "\n";

    assert.strictEqual(result, expected);
  });

  it("should print error files when tsc detects any errors", () => {
    const command = `npm --silent run dev -- --project test-cases/has-errors/tsconfig.json`;

    const result = execSync(command).toString();

    const expected =
      [
        "test-cases/has-errors/syntax-error.ts",
        "test-cases/has-errors/type-error.ts",
      ].join("\n") + "\n";

    assert.strictEqual(result, expected);
  });

  describe("--project option", () => {
    it(`should complement "tsconfig.json" when directory path is specified`, () => {
      const command = `npm --silent run dev -- --project test-cases/has-errors`;

      const result = execSync(command).toString();

      const expected =
        [
          "test-cases/has-errors/syntax-error.ts",
          "test-cases/has-errors/type-error.ts",
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
          "  -p, --project <path>  Path to tsconfig.json or it's directory",
          "  -r, --reason         Print reason of error",
          "  -P, --position       Print position of error",
          "  -h, --help           Display this help message",
        ].join("\n") + "\n";

      assert.strictEqual(result, expected);
    });
  });

  describe("--position option", () => {
    it("should print position", () => {
      const command = `npm --silent run dev -- --project test-cases/has-errors --position`;

      const result = execSync(command).toString();

      const expected =
        [
          "test-cases/has-errors/syntax-error.ts:2:0",
          "test-cases/has-errors/type-error.ts:3:4",
        ].join("\n") + "\n";

      assert.strictEqual(result, expected);
    });
  });

  describe("--reason option", () => {
    it("should print reason", () => {
      const command = `npm --silent run dev -- --project test-cases/has-errors --reason`;

      const result = execSync(command).toString();

      const expected =
        [
          `test-cases/has-errors/syntax-error.ts "'}' expected."`,
          `test-cases/has-errors/type-error.ts "Property 'age' is missing in type '{ name: string; }' but required in type 'User'."`,
        ].join("\n") + "\n";

      assert.strictEqual(result, expected);
    });
  });

  describe("--position and --reason options", () => {
    it("should print position and reason", () => {
      const command = `npm --silent run dev -- --project test-cases/has-errors --position --reason`;

      const result = execSync(command).toString();

      const expected =
        [
          `test-cases/has-errors/syntax-error.ts:2:0 "'}' expected."`,
          `test-cases/has-errors/type-error.ts:3:4 "Property 'age' is missing in type '{ name: string; }' but required in type 'User'."`,
        ].join("\n") + "\n";

      assert.strictEqual(result, expected);
    });
  });
});
