// Zero-dependency Node ESM loader hook resolving the "@/*" -> "src/*"
// path alias (matches tsconfig.json), so Phase 6 validation/test
// scripts can `import "@/..."` under plain `node`/`node --test`
// exactly like the Next.js build does, without adding a bundler or
// a path-alias npm package just for scripts.
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";

const srcRoot = path.resolve(import.meta.dirname, "..", "src");

register(import.meta.url);

function resolveExtension(absPath) {
  if (existsSync(absPath + ".ts")) return absPath + ".ts";
  if (existsSync(path.join(absPath, "index.ts"))) {
    return path.join(absPath, "index.ts");
  }
  return absPath;
}

export async function resolve(specifier, context, nextResolve) {
  // Next.js aliases this marker internally. Plain Node test/validation runs
  // need a no-op module so server-only domain modules remain importable there.
  if (specifier === "server-only") {
    return { url: "data:text/javascript,export%20default%20undefined", shortCircuit: true };
  }
  if (specifier.startsWith("@/")) {
    const absPath = resolveExtension(
      path.join(srcRoot, specifier.slice(2)),
    );
    return nextResolve(pathToFileURL(absPath).href, context);
  }
  return nextResolve(specifier, context);
}
