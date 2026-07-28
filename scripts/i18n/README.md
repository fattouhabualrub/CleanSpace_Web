# Site translations (17 languages)

The site UI is Arabic + English authored **inline** via `i18n.t('عربي', 'English')`.
The other **15 languages** are generated into a lazy-loaded dictionary keyed by the
English source string, with automatic fallback to English for any missing key.

## Files
- `catalog.json` — the 168 unique English source strings (the dictionary keys).
- `tr/<code>.json` — an array of 168 translations, **index-aligned** to `catalog.json`,
  for each of: `de es fr it nl pt-BR ru tr id hi ja zh-Hans fa ur ckb`.
- `build.js` — assembles the above into `src/app/services/i18n-translations.ts`.

## Edit a translation
1. Edit the string at the right index in `tr/<code>.json` (same index as in `catalog.json`).
2. Run `node scripts/i18n/build.js`.
3. Rebuild the app.

## Add / change a source string
When you add or change an `i18n.t(...)` call (or a data-array English field), the
English key changes. Re-extract the catalog, then re-translate the new/changed lines
and rebuild. (Any key not present in a `tr/<code>.json` simply falls back to English,
so the site never breaks — it just shows English for the missing string.)

RTL languages: `ar, ckb, fa, ur` (handled by `I18n.isRTL`). Kurdish (`ckb`) has no emoji
flag, so the language picker renders a small inline Kurdistan flag.
