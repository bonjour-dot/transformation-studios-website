# Transformation Studios website

Marketing site for the Transformation Studios app. Everything that is published lives in `site/`; Netlify publishes that folder on every push to `main`.

## Ground rules

- The design and the words are approved. Don't redesign, restyle, reorder sections or rewrite copy. Change only what you were asked to change. If something looks wrong, list it at the end instead.
- Keep every colour hex value and both fonts (Fraunces, DM Sans) exactly as they are.
- Never touch DNS or the email records (MX, SPF, DKIM, Google verification). The domain is registered at WordPress.com; email is Google Workspace.
- Never commit secrets or tokens. No tracking cookies.
- Small commits with clear messages. After each step, push and check the Netlify deploy succeeded.
- Test at 390 px, 768 px and 1440 px after every step. No sideways scrolling at any width. The phone layout matters most.
- Carousels move on their own, pause briefly when touched or hovered, and stay still with "reduce motion" turned on.

## Layout

- `site/index.html` the home page; `site/privacy/`, `site/terms/`, `site/support/`, `site/404.html`
- `site/assets/css/site.css`, `site/assets/js/site.js`, `site/assets/img/`, `site/assets/fonts/`
- Site-wide settings (App Store links, story video, support email) are the `SITE` object at the top of `site/assets/js/site.js`.
- `netlify.toml` holds the publish folder, headers and redirects. Images and fonts are cached for a year, so a replaced image needs a new file name. When the story video link is set, allow its player in `frame-src` there.
- `tools/build_pages.py` writes privacy, terms, support and 404; edit the text there and run it, don't edit those HTML files by hand.
- Asset paths are root-absolute (`/assets/...`), so preview with a local server from `site/`, not by opening the file.
