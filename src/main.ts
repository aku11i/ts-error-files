import { DiagnosticCategory, Project } from "ts-morph";
import { ParseArgsConfig, parseArgs } from "node:util";

const [, , ...args] = process.argv;

const options: ParseArgsConfig["options"] = {
  config: {
    type: "string",
    short: "c",
    default: "tsconfig.json",
  },
};

const { values } = parseArgs({ options, args });

// TODO Validation
const tsConfigFilePath = values["config"] as string;

const project = new Project({ tsConfigFilePath });
const program = project.getProgram();

const diagnostics = [
  program.getGlobalDiagnostics(),
  program.getSemanticDiagnostics(),
  program.getDeclarationDiagnostics(),
  program.getSyntacticDiagnostics(),
  program.getConfigFileParsingDiagnostics(),
].flat();

const errorDiagnostics = diagnostics.filter((diagnostic) => {
  return diagnostic.getCategory() === DiagnosticCategory.Error;
});

const errorFiles = errorDiagnostics
  .map((diagnostic) => diagnostic.getSourceFile()!)
  .filter(Boolean);

errorFiles
  .map((_) => _.getFilePath())
  .filter((file, i, self) => self.indexOf(file) === i)
  .forEach((file) => {
    console.log(file);
  });
