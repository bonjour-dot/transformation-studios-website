# Website remodel to match build 47: report

**Summary**
1. transformationstudio.site now shows build 47 (version 1.0): every iPhone and iPad screen is a real build 47 screenshot with demo content, the Mac screens are current Mac app screens, and the six tools sit in their app colours.
2. One subscription ($9.99 a month or $99.99 a year, 7 days free), the Founding 100 band with three ways to join, and the launch-list form are live. The words "watermark" and "4K" are gone from the whole repo and the live page.
3. **Update:** Netlify Forms is now on and the launch-list form works live (test submit from the page showed "You're on the list" and Netlify logged a submission at 2:19 PM). An email notification to admin@transformationstudio.site was added; Netlify is waiting for that address to confirm it.

Live: https://transformationstudio.site · commit on `main`: see the last line of this file's git log (merge `835b246`, then `da58db8` and a wording fix on top).

## Step 0 map: what each section showed, and now

| Section | Was | Now | Status |
| --- | --- | --- |--- |
| Nav | All in one, Editing, Teleprompter, Transcripts, Mac, Pricing, Our story | Tools, How it works, Teleprompter, Mac, Founding 100, Pricing, Our story, "Try it free" | UPDATED |
| Hero | Hand-built phone and iPad pictures, older Mac Home, chips for 4 ideas | Build 47 iPhone Home (largest and first on phones), current Mac Home, iPad Home; chips Teleprompter, Video, Photo, Voice, Auto captions, Voice to text; tool chips in app colours | UPDATED |
| "Eight apps in one" | 8 tiles, "8 apps · 8 logins · 8 bills" | "Six apps in one": Video, Voice, Photo, Teleprompter, then Captions and Transcripts, each in its tool colour with the 3px lip; "6 apps · 6 logins · 6 bills = 1 studio · $9.99 / month" | UPDATED |
| Editing | 5 hand-built phones, numbering mismatch | "How it works": four real screens, Record, Edit, Captions, Share (the same four steps as the Carry on card on Home); Cut and Smart Cut as its own block under "Inside Edit" | UPDATED |
| Photo | Missing | New section: three doors, layout first, collage editor, Filters, Adjust, "Add to video" | NEW |
| Teleprompter | Older screens | Script list with time estimate ("33 words · about 0:12"), Level 2 Delivery in yellow with the two-line reading band | UPDATED |
| Transcripts | Hold-a-paragraph demo from an older design | Real Voice, Text and Export screens in pink | UPDATED |
| Real screens rail | Older screens | "One library": Library page, the Recent / All / Folders tabs, four coloured kinds | UPDATED |
| Day and night | Missing | New strip, Mac day and night (the iPhone app has no day mode) | NEW |
| Mac | Older images | Current Mac Home, Record, Teleprompter, Captions, Text; "Included in the same subscription" | UPDATED |
| iPad | Only in the hero | New small strip with the build 47 iPad Home | NEW |
| Pricing | Two different cards, "No watermark, export up to 4K" | One subscription, same three lines and same button on both cards, US dollars note, honesty line | UPDATED |
| Founding 100 | Missing | New band: Creator, Partner, Ambassador, 100-dot counter from `SITE.foundingCount`, honesty line | NEW |
| Our story | Story video placeholder | Placeholder removed (no real video in the repo); mission wording as agreed; 22+ years and Toulouse kept | UPDATED |
| Funding missions | Three steps | Same three steps; "sold by Ryan Caley EI"; honesty line | OK |
| FAQ | 5 questions | 8 questions: the four you asked for are added | UPDATED |
| Final call and footer | Mac badge, "Download on the App Store" | "Try it free", admin@ email in the footer, no Mentions légales link (see below) | UPDATED |

## Which app commit, and where each screenshot came from

- App repo: tag `ios-build-47` (commit `6a9cd0e`, on `main`). Version 1.0, build 47. I built it in a separate worktree and a fresh simulator, so the main checkout and its branch were not touched.
- iPhone screens (Home, Video, Your video, Cut, Captions, Share, Photo, collage, Filters, Adjust, Teleprompter, Level, Voice, Text, Export, Library): simulator, iPhone 18 Pro, 9:41, full battery, `TS_PREVIEW` launches plus taps. Demo content only: "Morning routine", "Sunday reel", "Team update", "3 ways to start your week", three voice notes, scripts named Weekly update, Friday invite and Morning routine. Not Ryan's recordings.
- iPad Home: simulator, iPad Pro 13-inch, landscape.
- Mac screens: copied from the app repo's `Docs/screenshots/light-forest-borders` (Home, Record, Teleprompter, day and night, Captions, Text). I did not rebuild the Mac app: its Home screen needs a real library folder and I did not want to risk showing real projects. The Mac Home folder and cards ("Self Test", "Studio Horizon launch") are test names.
- Kept: the Mac update feed and the DMG downloads (`site/downloads`, `site/appcast.xml`) that another session had pushed to `main`.
- Images are WebP with a PNG or JPG fallback at 1x and 2x, each under 250 KB, in `site/assets/img/build47/`, with alt text on every image. Old images that are no longer used were deleted. The new share image is `site/assets/img/share-build47.jpg` (1200 × 630).

## Decisions I made without asking you

- **Four steps, not five.** Build 47's Carry on card says Record, Edit, Captions, Share. Cut and Smart Cut sit inside Edit, so the site shows four numbered steps and a separate Cut and Smart Cut block. That matches the screens exactly.
- **No Smart Cut screenshot.** The simulator has no speech engine, so Smart Cut found nothing to cut. The Cut screen is shown instead and Smart Cut is described in words (Tight, Natural, Relaxed are real in the app's shared code).
- **Day and night uses the Mac.** The iPhone app is dark only, so an iPhone light screenshot would be identical to the dark one. The strip says "Shown here on the Mac".
- **The transcript hold-a-paragraph demo is gone.** Build 47's Text screen works differently (choose a paragraph to hear it, "Fix the words"), so I replaced the demo with the real screens rather than show behaviour the app no longer has.
- **Brand.** The site says "Transformation Studio" with "Studio" in gold. The App Store listing draft (`Docs/IOS-LISTING.md`) still has the name "Transformation Studios". The site never tells people what to search for, so nothing needed that exact name. Check which name Apple has.
- **Mac on the site.** There is no Mac App Store badge. The page says the Mac app is included in the same subscription.
- **Colours.** The site already used the app's real palette tokens (video #FF8A5C, voice #FF7CC4, photo #5CC8FF, script #FFD85C). I kept those rather than the reference hexes in your prompt.
- **Merge with another session.** `origin/main` had moved a lot while I worked (Mac downloads, update feed, a renamed stylesheet `site-b21.css`, new legal pages). I merged it in, kept all of that, dropped the hand-built phone replicas it no longer needs, and reapplied my changes. Your instruction in the repo's `CLAUDE.md` ("design and words are approved") conflicts with this job; your pasted prompt won.
- **Legal pages.** I changed only their header, footer, email address (now admin@) and share image. Their body text still says "Transformation Studios" and is still marked "TO CONFIRM". `/legal` returns 404, so there is no "Mentions légales" link.
- **No deploy preview.** Netlify gave no branch preview (404), so I ran all checks locally and then on the live site after the merge.
- **Checks ran in Playwright** (Python, headless Chromium; there is no Node on this Mac). The repo has no build or test script.

## Live check results

- 390, 768 and 1440 px: no sideways scroll, zero console errors, every image has alt text. Screenshots of every section are in `docs/review/build47/live/` (390 and 1440) and `docs/review/build47/local/` (all three widths).
- Hero shows the build 47 screens; the Founding 100 band shows "Founding places open 8 December" while `foundingCount` is 0.
- All 7 join buttons open the launch-list form. The first test submit got a 404 because Netlify Forms was off. After Ryan switched on form detection I redeployed from the Netlify dashboard, and a second test submit (admin+test@transformationstudio.site) succeeded and was logged by Netlify.
- With `appStoreUrl` set (tested by swapping the file in the browser): every button goes to `…?ct=website&mt=8`, the form is removed and the badge shows. With `foundingCount` 7: 7 of 100 dots lit.
- Share the link: copies the link and says "Link copied" (no Web Share API in headless Chromium).
- `/privacy`, `/terms`, `/support`: 200. `/legal`: 404.
- Page text and repo contain no "watermark", "4K", "Ultra HD" or "full resolution" (checked by search and in the browser). Text contrast checked in the browser; the green-to-orange bands now use dark text.
- I did not revert: the site itself is healthy. Reverting would put the old "No watermark, export up to 4K" card back on the live page.

## Things only Ryan can do

- [ ] **Confirm the notification email:** Netlify shows "Waiting for admin@transformationstudio.site to confirm". Open the confirmation email it sent to that inbox and click the link. (Forms and the `launch-list` form are already on.) Delete the two test submissions (admin+test@ and probe+test@) in Netlify, Forms.
- [ ] When Apple approves the app: paste the App Store link into `appStoreUrl` in `site/assets/js/site.js` and push (one line, see README.md).
- [ ] Each week: update `SITE.foundingCount` (0 to 100).
- [ ] Run the legal pages job: `/legal` is missing and the privacy, terms and support pages still say "Transformation Studios" and "TO CONFIRM".
- [ ] Decide which name Apple has ("Transformation Studio" or "Transformation Studios") and make the listing, site and legal pages agree.
- [ ] Optional: send real build 47 screenshots to `~/Desktop/TS-website-screens` if you want your own phone's in place of the simulator ones. That folder did not exist, so I used the simulator.

## Watermark check in the app (read only, nothing changed)

Searched `iOS/`, `Sources/TSCore`, `Sources/ReelStudio`, `Resources` and `Localization` on `main`:

- **No code anywhere draws a watermark.** The only hits are text:
  - `Sources/ReelStudio/Plan.swift:198` and `:304`: "Export up to 4K, no watermark" (Mac plan screens)
  - `Sources/ReelStudio/StorePlan.swift:184`: same line (Mac store plan)
  - `iOS/App/PaywallScreen.swift:123`: "The Mac app as well: no watermark, export up to 4K" (iPhone paywall)
  - `Sources/ReelStudio/SelfTestStore.swift:55` (a comment) and `:60` (a check that 4K is offered when subscribed)
  - `Localization/Localizable.xcstrings:32674`: an old comment, "Watermark drawn into videos exported on the free plan", and the strings at `:37160` and `:37183`. Leftovers; nothing uses them to draw anything.
- **4K on Mac:** `Sources/ReelStudio/Export.swift:10-19` defines 540 to 2160 ("4K", "Ultra HD") and `ExportSheet.swift:201` offers every size, plus an "Archive 4K" preset at `:255`. Nothing limits it by plan.
- **iPhone exports** use `AVAssetExportPresetHighestQuality` or the HEVC equivalent (`ShareScreen.swift:137`, `VideoQuality.swift:94`, `ProjectExporter.swift:155`); there is no 4K cap and no watermark step.
- **Subscriber vs non-subscriber today:** a subscriber (or a TestFlight tester build) gets everything, with no watermark. A non-subscriber gets nothing to export: on iPhone `PlanRules` (`iOS/App/Plan.swift:37-46`) gives zero length, no formats, no bilingual, no b-roll and no voice work, and on the Mac there is no limited mode (`SelfTestStore.swift:55`), so the subscribe screen appears instead.
- **Your suspicion about the Mac:** I found no code that watermarks Mac exports. If you saw a watermark on a Mac export, it did not come from this code; it would be worth a screenshot.
- Because the app text still promises "no watermark, export up to 4K", the website no longer repeats it, as agreed. You may want to reword those paywall lines in the app too.

## Things I wanted to change but did not

- Rewrite the legal pages' body text for the new brand and the Founding 100 (separate job).
- Add a real Smart Cut screenshot (needs a device or a speech file).
- Rebuild the Mac app to capture fresh Mac screens with neutral demo data.
- Trim the unused rules left in the stylesheet (`site-b21.css`), and rename it back to `site.css`.
