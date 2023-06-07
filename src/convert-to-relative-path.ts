import * as path from "path";

export function convertToRelativePath(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath);
}
