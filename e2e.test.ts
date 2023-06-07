import { describe, it } from "node:test";
import { execSync } from "child_process";
import assert from "assert";

describe("tsc-error-files", () => {
  it("should print nothing when tsc is succeeded", () => {
    const command = `npm --silent run dev -- --config test-cases/no-errors/tsconfig.json`;

    const result = execSync(command).toString();

    const expected = "";

    assert.strictEqual(result, expected);
  });

  it("should print error files when tsc detects any errors", () => {
    const command = `npm --silent run dev -- --config test-cases/has-errors/tsconfig.json`;

    const result = execSync(command).toString();

    const expected =
      [
        "/Users/main/ghq/github.com/aku11i/tsc-error-files/test-cases/has-errors/type-error.ts",
        "/Users/main/ghq/github.com/aku11i/tsc-error-files/test-cases/has-errors/syntax-error.ts",
      ].join("\n") + "\n";

    assert.strictEqual(result, expected);
  });

  describe("--config option", () => {
    it(`should complement "tsconfig.json" when directory path is specified`, () => {
      const command = `npm --silent run dev -- --config test-cases/has-errors`;

      const result = execSync(command).toString();

      const expected =
        [
          "/Users/main/ghq/github.com/aku11i/tsc-error-files/test-cases/has-errors/type-error.ts",
          "/Users/main/ghq/github.com/aku11i/tsc-error-files/test-cases/has-errors/syntax-error.ts",
        ].join("\n") + "\n";

      assert.strictEqual(result, expected);
    });
  });
});
