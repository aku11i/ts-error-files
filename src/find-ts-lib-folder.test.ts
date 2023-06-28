import { findTsLibFolder } from "./find-ts-lib-folder.js";
import * as path from "node:path";
import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

describe("findTsLibFolder", () => {
  it("should return path to ts lib from tsconfig.json", async () => {
    const libPath = await findTsLibFolder(
      path.join(process.cwd(), "tsconfig.json")
    );

    strictEqual(
      libPath,
      path.join(process.cwd(), "node_modules/typescript/lib")
    );
  });

  it("should return path to ts lib from tsconfig.json which is contained in child directory", async () => {
    const libPath = await findTsLibFolder(
      "test-cases/has-errors/tsconfig.json"
    );

    strictEqual(
      libPath,
      path.join(process.cwd(), "node_modules/typescript/lib")
    );
  });
});
