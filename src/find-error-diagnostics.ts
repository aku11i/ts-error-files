import { Diagnostic, DiagnosticCategory, Program } from "ts-morph";

export function findErrorDiagnostics(program: Program): Diagnostic[] {
  const diagnostics = [
    program.getGlobalDiagnostics(),
    program.getSemanticDiagnostics(),
    program.getDeclarationDiagnostics(),
    program.getSyntacticDiagnostics(),
    program.getConfigFileParsingDiagnostics(),
  ].flat();

  return diagnostics.filter((diagnostic) => {
    return diagnostic.getCategory() === DiagnosticCategory.Error;
  });
}
