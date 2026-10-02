// Transpila el Web Worker de la aurora y su motor a public/aurora/ (módulos ES sin bundler).
// Turbopack copia `new Worker(new URL("./x.ts", import.meta.url))` como asset sin compilar, por eso se hace aquí.
// Corre en predev / prebuild; la salida está en .gitignore.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const OUT = "public/aurora/";
mkdirSync(OUT, { recursive: true });
for (const name of ["aurora-core", "aurora.worker"]) {
  const { outputText } = ts.transpileModule(readFileSync(`components/${name}.ts`, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, removeComments: true },
  });
  writeFileSync(OUT + name + ".js", outputText);
  console.log(OUT + name + ".js");
}
