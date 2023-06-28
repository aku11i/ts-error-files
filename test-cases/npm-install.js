import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const baseDir = dirname(fileURLToPath(import.meta.url));

readdirSync(baseDir).map((dir) => {
  const path = join(baseDir, dir);
  if (!statSync(path).isDirectory()) {
    return;
  }

  process.chdir(path);
  console.log(dir);
  execFileSync("npm", ["install"], { stdio: "inherit" });
});
