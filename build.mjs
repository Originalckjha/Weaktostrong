/**
 * build.mjs — Copies all static assets to public/ and compiles the TS bundle there.
 * Used by both local builds and Vercel (outputDirectory: "public").
 */
import { execSync }                                    from 'child_process';
import { mkdirSync, copyFileSync, readdirSync, statSync } from 'fs';
import { extname, join }                               from 'path';

const OUT = 'public';
mkdirSync(OUT, { recursive: true });

const STATIC = new Set(['.html', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp']);

for (const file of readdirSync('.')) {
  if (file === OUT || file === 'node_modules' || file.startsWith('.')) continue;
  try {
    if (statSync(file).isFile() && STATIC.has(extname(file))) {
      copyFileSync(file, join(OUT, file));
      console.log(`  copy  ${file} → ${OUT}/${file}`);
    }
  } catch { /* skip unreadable files */ }
}

console.log('  build bundle.js …');
execSync(
  `npx esbuild src/main.ts --bundle --outfile=${OUT}/bundle.js --target=es2020 --minify`,
  { stdio: 'inherit' }
);

console.log(`\nBuild complete → ${OUT}/`);
