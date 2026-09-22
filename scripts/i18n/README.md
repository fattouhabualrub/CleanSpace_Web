# Site translations (21 languages)

The site UI is Arabic + English authored **inline** via `i18n.t('عربي', 'English')`.
The other **19 languages** are generated into a lazy-loaded dictionary keyed by the
English source string, with automatic fallback to English for any missing key.

A language can also be pinned in the URL — `/<lang>/<page>`, e.g. `/en/download`,
`/ar/download`, `/pt-BR/support` (the prefix is case-insensitive). The prefix wins
over the visitor's saved preference; without one, the saved language is used. See
`src/app/services/lang-route.ts`.

## Files
- `catalog.json` — the English source strings (the dictionary keys).
- `tr/<code>.json` — an **index-aligned** translation array for `catalog.json`,
  for each of: `de es fr it nl pl pt-BR ru tr id vi hi ja ko zh-Hans zh-Hant fa ur ckb`.
- `build.js` — assembles the above into `src/app/services/i18n-translations.ts`.

## Edit a translation
1. Edit the string at the right index in `tr/<code>.json` (same index as in `catalog.json`). A shorter array is valid; newer missing entries fall back to English.
2. Run `node scripts/i18n/build.js`.
3. Rebuild the app.

## Add / change a source string
When you add or change an `i18n.t(...)` call (or a data-array English field), the
English key changes. Re-extract the catalog, then re-translate the new/changed lines
and rebuild. (Any key not present in a `tr/<code>.json` simply falls back to English,
so the site never breaks — it just shows English for the missing string.)

RTL languages: `ar, ckb, fa, ur` (handled by `I18n.isRTL`). Kurdish (`ckb`) has no emoji
flag, so the language picker renders a small inline Kurdistan flag.
