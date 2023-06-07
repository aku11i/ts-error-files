import { Diagnostic } from "ts-morph";

export function listFilesFromDiagnostics(diagnostics: Diagnostic[]): string[] {
  return diagnostics
    .map((diagnostic) => diagnostic.getSourceFile())
    .filter(Boolean)
    .map((sourceFile) => sourceFile!.getFilePath())
    .filter((file, i, self) => self.indexOf(file) === i);
}
