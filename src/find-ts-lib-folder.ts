import { createRequire } from "node:module";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

export async function findTsLibFolder(
  tsConfigFilePath: string
): Promise<string | null> {
  const require = createRequire(import.meta.url);

  try {
    // const libUrl = await import.meta.resolve!(
    //   "typescript",
    //   ["file://", path.resolve(tsConfigFilePath)].join("")
    // );

    // return path.dirname(fileURLToPath(libUrl));

    const libUrl = require.resolve("typescript", { paths: [tsConfigFilePath] });

    return path.dirname(libUrl);
  } catch (e) {
    console.error(e);
    return null;
  }
}
