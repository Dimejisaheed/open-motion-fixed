/**
 * Post-build step for @openmotion/server.
 *
 * This file was imported by the `build` script in package.json but never
 * committed upstream, so `npm run build` died with MODULE_NOT_FOUND after
 * tsc had already succeeded. It repairs two mismatches between what tsc
 * emits and what the runtime expects:
 *
 * 1. Layout: `start` runs `node dist/src/index.js` and app.ts resolves the
 *    web build from `dist/src/server/`, but tsc (rootDir = src) emits a
 *    flat `dist/index.js`, `dist/server/`, … — so the compiled tree is
 *    moved under `dist/src/` to match the layout the rest of the repo
 *    assumes.
 *
 * 2. Shared package: `@openmotion/shared` is a `file:./src/shared`
 *    dependency whose package.json exports `./index.js`, but the source
 *    directory only contains `.ts` files, so Node cannot load it at
 *    runtime (tsx handles `.ts` in dev, which is why this only breaks
 *    prod). The compiled shared JS is therefore copied next to the
 *    sources, so the package's exports resolve to real JavaScript.
 *    (allowJs is off, so tsc ignores the copied .js on the next build.)
 */
import { cpSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pkgDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(pkgDir, "dist");
const srcDistDir = join(distDir, "src");

if (!existsSync(distDir)) {
  throw new Error(`postbuild: ${distDir} does not exist — tsc produced no output`);
}

// 1. Restructure dist/* -> dist/src/*
if (existsSync(srcDistDir)) rmSync(srcDistDir, { recursive: true, force: true });
mkdirSync(srcDistDir, { recursive: true });
// The runtime data directory (SQLite DB, exports, renders) must stay at
// dist/data — the server resolves it relative to dist/src/db — so never
// move it under dist/src. If a previous postbuild run moved it there,
// move it back first.
const dataDir = join(distDir, "data");
const movedDataDir = join(srcDistDir, "data");
if (existsSync(movedDataDir)) {
  if (existsSync(dataDir)) rmSync(dataDir, { recursive: true, force: true });
  renameSync(movedDataDir, dataDir);
}
for (const entry of readdirSync(distDir)) {
  if (entry === "src" || entry === "data") continue;
  renameSync(join(distDir, entry), join(srcDistDir, entry));
}

// 2. Copy compiled shared JS next to the shared sources so the
//    file: dependency's exports (./index.js, ./api.js, …) resolve.
const compiledShared = join(srcDistDir, "shared");
const sourceShared = join(pkgDir, "src", "shared");
if (!existsSync(join(compiledShared, "index.js"))) {
  throw new Error(`postbuild: ${compiledShared}/index.js missing — shared did not compile`);
}
cpSync(compiledShared, sourceShared, {
  recursive: true,
  filter: (src) => src.endsWith(".js") || !src.includes("."),
});
console.log("postbuild: restructured dist -> dist/src and copied compiled @openmotion/shared JS into src/shared");
