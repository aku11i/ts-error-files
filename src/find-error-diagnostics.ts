import { Diagnostic, DiagnosticCategory, Project } from "ts-morph";

export function findErrorDiagnostics(project: Project): Diagnostic[] {
  return project
    .getPreEmitDiagnostics()
    .filter(
      (diagnostic) =>
        diagnostic.getCategory() === DiagnosticCategory.Error &&
        !diagnostic.compilerObject.reportsUnnecessary
    );
}
