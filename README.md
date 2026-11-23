# Transformation Studio website

Marketing site for the Transformation Studio app (iPhone, iPad and Mac): video, voice, photo, teleprompter, captions and transcripts in one studio. It matches app version 1.0, build 47.

- Everything published is in `site/`: `index.html`, plus CSS, JS, images and fonts under `site/assets/`.
- Screens are real build 47 screenshots in `site/assets/img/build47/` (iPhone from the simulator with demo content, Mac from the app repo's `Docs/screenshots`). `tools/process_shots.py` turns raw screenshots into the WebP and PNG sizes the page uses.
- Fonts are the app's own Fraunces and DM Sans.
- Hosted on Netlify: every push to `main` deploys. Privacy, terms, support and the 404 page are written by `tools/build_pages.py`.

## Site settings (the `SITE` object at the top of `site/assets/js/site.js`)

| Setting | What it does |
| --- | --- |
| `appStoreUrl` | Empty now. While it is empty, every "Try it free", "Start free trial" and "Join for a year" button opens the launch-list form (Netlify Forms, form name `launch-list`). |
| `campaignToken` | Added to the App Store link as `?ct=<token>&mt=8`. Starts as `website`. |
| `foundingCount` | Founding places taken (0 to 100). Update by hand. At 0 the page shows "Founding places open 8 December"; above 0 it shows 100 dots and "X of 100". |
| `supportEmail` | `admin@transformationstudio.site`. |

### The one-line switch when Apple approves the app

Paste the App Store link into `appStoreUrl` and push:

```js
appStoreUrl: "https://apps.apple.com/app/idXXXXXXXXXX",
```

Every join button then goes straight to the App Store with `?ct=website&mt=8`, the launch-list form is removed, and the official "Download on the App Store" badge appears.

### Launch-list emails

In Netlify: Forms, `launch-list`, add an email notification to `admin@transformationstudio.site`.

## Checks

`/tmp`-style local run: serve `site/` (for example `python3 -m http.server` from `site/`) and open it at 390, 768 and 1440 px. Review screenshots are in `docs/review/build47/`.
