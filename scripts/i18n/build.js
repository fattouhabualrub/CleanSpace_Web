#!/usr/bin/env node
// Assemble catalog.json + tr/<code>.json (index-aligned) into
// src/app/services/i18n-translations.ts. Run: node scripts/i18n/build.js
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const DEST = path.resolve(HERE, '../../src/app/services/i18n-translations.ts');
const catalog = JSON.parse(fs.readFileSync(path.join(HERE, 'catalog.json'), 'utf8'));

// Stable, human-friendly language order (ar & en are authored inline, not here).
const codes = ['de', 'es', 'fr', 'it', 'nl', 'pt-BR', 'ru', 'tr', 'id', 'hi', 'ja', 'zh-Hans', 'fa', 'ur', 'ckb'];

const out = {};
for (const code of codes) {
  const tr = JSON.parse(fs.readFileSync(path.join(HERE, 'tr', `${code}.json`), 'utf8'));
  if (tr.length !== catalog.length) throw new Error(`${code}: ${tr.length} != ${catalog.length} strings`);
  const map = {};
  catalog.forEach((en, i) => { map[en] = tr[i]; });
  out[code] = map;
}

const header = `// AUTO-GENERATED — do not edit by hand. Run \`node scripts/i18n/build.js\` to regenerate.
// Maps each non-ar/en language code to { <English source string>: <translation> }.
// Missing keys fall back to English at runtime (see I18n.t). ${codes.length} languages × ${catalog.length} strings.
`;
fs.writeFileSync(DEST, header + `export const TRANSLATIONS: Record<string, Record<string, string>> = ${JSON.stringify(out, null, 2)};\n`);
console.log(`Wrote ${path.relative(process.cwd(), DEST)} — ${codes.length} langs × ${catalog.length} strings`);
