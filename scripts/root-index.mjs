#!/usr/bin/env node
/**
 * Copies the client-rendered shell to index.html at the build root.
 *
 * `outputMode: "static"` names the shell index.csr.html, so the output has no
 * index.html at its root. Every static host looks for index.html when serving
 * "/", so without this the site's root depends entirely on the .htaccess rewrite
 * — and a host with AllowOverride off would 404 on the home page while every
 * /<lang>/ URL kept working.
 *
 * The 301 in .htaccess still takes priority; this is the fallback underneath it.
 *
 * Usage: node scripts/root-index.mjs
 */
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'dist/cleanspace-landing/browser');

const shell = join(OUT, 'index.csr.html');
const target = join(OUT, 'index.html');

if (!existsSync(shell)) {
  console.warn('root-index: index.csr.html not found — did the build run?');
  process.exit(0);
}

copyFileSync(shell, target);
console.log('root-index: index.csr.html → index.html');
