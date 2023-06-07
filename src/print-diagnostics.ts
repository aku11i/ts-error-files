import { Diagnostic } from "ts-morph";
import { convertToRelativePath } from "./convert-to-relative-path.js";

type OutputItem = {
  filePath: string | undefined;
  reason: string;
  position: string | undefined;
};

type OutputOptions = {
  printReason: boolean;
  printPosition: boolean;
};

export function printDiagnostics(
  diagnostics: Diagnostic[],
  options: OutputOptions
): void {
  const { printReason, printPosition } = options;

  const items: OutputItem[] = diagnostics.map((diagnostic) => {
    const sourceFile = diagnostic.getSourceFile();
    const filePath = sourceFile?.getFilePath()
      ? convertToRelativePath(sourceFile.getFilePath())
      : undefined;

    const _reason = diagnostic.getMessageText();
    const reason =
      typeof _reason === "string" ? _reason : _reason.getMessageText();

    const line = diagnostic.getLineNumber();
    const start = diagnostic.getStart();
    const position =
      typeof line === "number" && typeof start === "number"
        ? `${line}:${start}`
        : undefined;

    return { filePath, reason, position };
  });

  const output = items
    .filter((item) => item.filePath !== undefined)
    .map((item) => {
      let line = item.filePath!;

      if (printPosition) {
        line += `:${item.position}`;
      }

      if (printReason) {
        line += ` "${item.reason}"`;
      }

      return line;
    })
    .join("\n");

  console.log(output);
}
