import * as path from "node:path";
import { fileURLToPath } from "node:url";

export async function findTsLibFolder(
  tsConfigFilePath: string
): Promise<string | null> {
  try {
    const libUrl = await import.meta.resolve!(
      "typescript",
      ["file://", path.resolve(tsConfigFilePath)].join("")
    );

    return path.dirname(fileURLToPath(libUrl));
  } catch (e) {
    console.error(e);
    return null;
  }
}
