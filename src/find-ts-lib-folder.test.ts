import test from "node:test";
import { findTsLibFolder } from "./find-ts-lib-folder.js";
import * as assert from "node:assert";
import * as path from "node:path";

test.describe("findTsLibFolder", () => {
  test("should return path to ts lib from tsconfig.json", async () => {
    const libPath = await findTsLibFolder(
      path.join(process.cwd(), "tsconfig.json")
    );
    assert.strictEqual(
      libPath,
      path.join(process.cwd(), "node_modules/typescript/lib")
    );
  });

  test("should return path to ts lib from tsconfig.json which is contained in child directory", async () => {
    const libPath = await findTsLibFolder(
      "test-cases/has-errors/tsconfig.json"
    );
    assert.strictEqual(
      libPath,
      path.join(process.cwd(), "node_modules/typescript/lib")
    );
  });
});
