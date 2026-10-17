# Freelance Ledger

Static site on GitHub Pages (custom domain in `CNAME`). No framework. Pages are hand-written HTML; a small Node script keeps the generated parts in sync.

## Everyday tasks

| Task | How |
|---|---|
| Rebuild generated parts (tools grid, affiliate links, sitemap) | `node scripts/build.mjs` |
| Check titles, descriptions, links, anchors, JSON-LD, sitemap | `node scripts/check.mjs` |
| Run the calculator unit tests | `node tests/calc.test.js` |

Run all three before every commit. Node 18+ is enough; there are no dependencies.

## Affiliate links (`affiliates.json`)

Every partner has an entry. A link is only treated as an affiliate link once it has a tracking `url` **and** `"live": true`. Until then the site links to the plain vendor page, adds no "sponsored" tag and shows no disclosure banner. When you paste an approved URL:

1. Put it in `affiliates.json` and set `"live": true`.
2. Run `node scripts/build.mjs`.

That one step switches on the tracking link on the home-page tool card and on every page that uses `<a data-aff="key">`, adds `rel="sponsored nofollow noopener"`, shows the "(affiliate link)" label and un-hides the disclosure banner on those pages. Keys match `data-aff` values and lowercase tool names in `tools.js` (spaces become hyphens). In page HTML write affiliate links as:

```html
<a data-aff="wave" href="https://www.waveapps.com">Wave</a><span data-aff-label hidden> (affiliate link)</span>
```

Never hand-edit `aff-data.js` (generated). The `gumroad-templates` entry switches on the "Prefer a ready-made template?" boxes the same way.

## Newsletter (`site-config.js`)

No signup form shows anywhere until `SITE_CONFIG.newsletter.action` is set to your email provider's form-post URL. Fill in `action` (and `emailName` / `extra` if your provider needs them), then **update `privacy.html` to name the provider**. Signup blocks are placeholders `<div data-newsletter>` that `js/newsletter.js` fills in; with no `action` they are removed, so visitors never see a dead form.

## Adding or editing pages

* New guide or calculator: copy a similar page, keep the `<head>` (canonical, Open Graph, JSON-LD) and breadcrumb pattern, add it to `guides.html` or `calculators.html`, then run build + check (the build adds it to `sitemap.xml`).
* Tools directory: edit `tools.js`, then `node scripts/build.mjs` (it prerenders the grid into `index.html` so search engines see it without JavaScript).
* Calculation logic lives in `js/fl-calc.js` (pure functions, unit-tested in `tests/calc.test.js`). 2026 tax figures are in the `T` object at the top. **Update them each year** and re-run the tests.
* Each page shows a "last reviewed" date and `dateModified` in its JSON-LD. Change both when you re-verify a page.

## Yearly refresh checklist

- Tax brackets, standard deduction, Social Security wage base, retirement limits (`js/fl-calc.js`, the guides that quote them).
- Mileage rates (`js/fl-calc.js`, mileage page, expense-tracker workbook).
- Estimated-tax due dates (`js/deadline.js`, `js/fl-calc.js` `DUE`, 2027 dates page and `.ics`).
- Vendor prices on `tools.js` and the invoicing, bank, Wave and QuickBooks pages.
