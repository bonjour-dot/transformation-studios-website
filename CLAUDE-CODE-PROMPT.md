# Prompt for Claude Code: take the Transformation Studios website live

Paste everything below the line into Claude Code, opened in the unzipped `transformation-studios-website` folder.

---

You are taking a finished website design for **Transformation Studios** (an iPhone, iPad and Mac app for video, audio, photo, teleprompter, captions and transcripts) and turning it into a production site, live at **https://transformationstudio.site**.

## Ground rules

- **The design and the words are approved.** Do not redesign, restyle, reorder sections or rewrite copy. Change only what this prompt lists. If something looks wrong to you, list it at the end instead of changing it.
- The colours come from the app's palette (Forest Vivid). Keep every hex value exactly as it is in `index.html`.
- The fonts are the app's own `Fraunces.ttf` and `DMSans.ttf`. Keep them.
- Ask me before: creating the GitHub repo, connecting Netlify, changing any DNS, or deploying to the live domain. Show me what you'll do first.
- Never commit secrets, API keys or tokens. Don't add tracking cookies.
- Work in small commits with clear messages.

## What's in the folder

- `index.html`: the whole site (inline CSS and JS)
- `mac-*.jpg`, `iphone-*.jpg`: real app screenshots
- `camera.jpg`: soft camera background used behind the teleprompter and captions screens
- `Fraunces.ttf`, `DMSans.ttf`: the app's fonts

## Phase 1: project and repo

1. Restructure into:
   ```
   /index.html
   /assets/css/site.css     (move the inline <style> here, unchanged)
   /assets/js/site.js       (move the inline <script> here, unchanged)
   /assets/img/             (all images)
   /assets/fonts/           (fonts)
   ```
   Update every path. Check that the page looks identical before and after (screenshots at 390 px and 1440 px).
2. Create a **private** GitHub repo `bonjour-dot/transformation-studios-website` (ask me first) and push.

## Phase 2: performance

1. Convert every JPG to WebP (quality about 80), served with `<picture>` and a JPG fallback. Keep `width` and `height` on every image.
2. Make 2 sizes of each Mac screenshot (1800 px and 900 px) and use `srcset`/`sizes`.
3. Convert the fonts to `woff2` (keep the variable axes), update `@font-face` and the preload links.
4. Lazy-load everything below the hero. The hero Mac screenshot keeps `fetchpriority="high"`.
5. Target: Lighthouse mobile scores of 90+ for Performance, Accessibility, Best Practices and SEO.

## Phase 3: placeholders to wire up

Put these in one config block at the top of `site.js` so I can change them in one place:

```js
const SITE = {
  appStoreUrl: "#",          // iPhone and iPad App Store link (TBD)
  macAppStoreUrl: "#",       // Mac App Store link (TBD)
  storyVideoUrl: "",         // YouTube or Vimeo link for "Ryan's story" (TBD)
  supportEmail: "hello@transformationstudio.site"
};
```

1. Every "Download on the App Store", "Try it free" and "Start free trial" button uses `SITE.appStoreUrl`. While it is `#`, scroll to `#pricing` (current behaviour).
2. Use Apple's official "Download on the App Store" badge (black, from Apple's marketing resources) next to the orange buttons in Pricing and the closing banner. Follow Apple's badge guidelines.
3. Story video: when `storyVideoUrl` is set, swap the gradient placeholder for a click-to-play facade (thumbnail first, then load the YouTube/Vimeo iframe on click, with `youtube-nocookie.com` for YouTube). While it's empty, keep the placeholder as it is.

## Phase 4: pages the App Store needs

App Store Connect asks for a **Privacy Policy URL** and a **Support URL**. Create these in the same look as the site (dark page, same nav and footer):

- `/privacy/`: privacy policy. The app does speech-to-text and captions on the device. Write a plain-English draft and put a clear "DRAFT: Ryan to review" banner at the top. Don't invent facts: where you don't know something (data collected, account provider, analytics), leave a `[TO CONFIRM]` marker.
- `/terms/`: link to Apple's standard licensed application EULA, plus the subscription terms ($9.99/month, $99.99/year, 7-day free trial, cancel in Apple ID settings, managed by Apple). It's an app subscription, not a donation, and it isn't tax-deductible.
- `/support/`: contact email, short FAQ (reuse the site's FAQ), how to cancel or restore a subscription.
- A `404.html` in the same style.

Update the footer links (Support, Privacy, Terms) to these pages.

## Phase 5: SEO and sharing

1. `<title>`: `Transformation Studios — One video. One post. Reaching many at a time.`
2. Keep the current meta description, then add a canonical URL, Open Graph and Twitter card tags.
3. Make a 1200×630 share image from the hero (the three-device collage on the dark background, with the logo and "Many creator apps. One studio.").
4. Favicon set and `apple-touch-icon` from the logo tile (cream tile, orange bars #E8572A, green play #1F8A63).
5. `robots.txt`, `sitemap.xml`, and JSON-LD `SoftwareApplication` (iOS and macOS, price 9.99 USD per month, free trial).

## Phase 6: hosting on Netlify

1. Add `netlify.toml`:
   - publish directory `/`
   - long cache headers for `/assets/*`
   - security headers: `Content-Security-Policy` (allow self, plus YouTube/Vimeo frames only if the video is used), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone and geolocation off)
   - redirect `www` to the root domain
2. Connect the GitHub repo to Netlify (I have Netlify Pro) so every push to `main` deploys, with deploy previews on branches. Ask me first.
3. The domain `transformationstudio.site` is registered at **WordPress.com**. Give me the exact DNS records to enter in WordPress.com (or the Netlify nameservers if that's simpler), step by step, and wait for me to do it. Then turn on HTTPS in Netlify.
4. Keep my email working: the domain's email runs through Google Workspace. Don't remove or change any MX, SPF, DKIM or DMARC records. List them before and after.

## Phase 7: final checks

- Test at 390 px (iPhone), 768 px (iPad) and 1440 px (desktop). No horizontal scrolling at any width.
- Every carousel moves on its own, pauses when touched or hovered, and stays still with "reduce motion" turned on.
- The transcript demo (hold a paragraph), the teleprompter demo (tap record) and the Mac tabs all still work.
- Every link and button goes somewhere.
- Run Lighthouse on mobile and report the scores.

## When you're done, show me

1. The live URL and a deploy preview URL
2. Lighthouse scores
3. Screenshots at 390 px and 1440 px
4. A short list of anything still marked `[TO CONFIRM]` or `TBD`
