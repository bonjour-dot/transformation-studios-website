# Handoff to Codex: Transformation Studios website

## Where things are
- Website repo: github.com/bonjour-dot/transformation-studios-website, branch `new-app-look`, draft PR #1.
  Latest commit: 8ccfd42 ("Teleprompter demo: Delivery level pause chips…").
  Preview: https://deploy-preview-1--transformation-studios.netlify.app
- App repo (source of truth, Build 20): github.com/bonjour-dot/Market-TRANSFORMATION-STUDIOS-app.
  Run `git pull` and make sure you have commit 513a4e9 or newer.
  Screens: Docs/website-kit/iphone/*.png, Docs/screenshots/*.png, Docs/website-kit/STYLE-GUIDE.md.
  SwiftUI: iOS/App (Look.swift, HomeScreen.swift, EditAllScreen.swift, ManualCutScreen.swift,
  SmartCutScreen.swift, CaptionsScreen.swift, ShareScreen.swift, VoiceEditor.swift, VoiceTranscript.swift).

## Read first
Treat CLAUDE.md in the website repo as your AGENTS.md. Key rules:
- Only published folder is `site/`. Netlify publishes it from `main`. Do NOT merge to main; Ryan says when.
- Design and words are approved. Change only what is asked. List anything odd at the end.
- Keep every hex colour and both fonts (Fraunces, DM Sans).
- Never touch DNS or email records. No secrets. No tracking cookies.
- No faces anywhere. No "Sunday welcome" in screens. No "Build 8".
- Replaced images get NEW file names (images are cached a year).
- Test at 390, 768, 1440 px. No sideways scroll. Carousels auto-move, pause on touch/hover,
  and stay still with "reduce motion".
- `site/privacy|terms|support|404` come from `tools/build_pages.py`; edit that, not the HTML.
- Preview from `site/` with a local server (paths start with /assets/): `python3 -m http.server 8765`.
- Small commits; push; check the Netlify deploy.

## Done already (do not redo)
Home, editing steps (Edit all together, Cut, Smart Cut, Captions, Share), Teleprompter
(levels, pause chips, section flags), voice transcript and share phones, "Straight from
the app" rail (Build 20), Mac Home slide, languages FAQ line.

## Still to do
1. Mac: fresh screens (19 Nov, Build 21) are in the app repo on `main`:
   `Docs/website-kit/mac/` (01-home, 02-video-library, 03-messages, 04-images-library,
   05-video-editor-empty, 06-audio-library, 07-new-project; 1400x846; see README there).
   They are NOT site-ready: they show the real library ("Hope that holds", "HOPE", "john",
   "Nov newsletter") and a ~/Movies path, the app was signed out (SIGN UP button), and the
   editor is an empty project. Still missing: Slides, Scripts, Presentation, Captions, and a
   filled editor. Retake those from the Mac app (Ryan signs in; never type his password) using a
   demo project: no personal names, no "PRO" badge, no /var/folders or ~/Movies path, no faces.
   Use new file names (e.g. mac-editor-b21.*).
2. Compare every hand-built phone with its app screen at 390, 768 and 1440 px and fix drift.
3. Reply with a short list: what changed, anything that breaks a CLAUDE.md rule, open questions.

## Open questions for Ryan
- Scripts screen shows "Sunday welcome" / "Easter invitation": hide or keep?
- Mac Home shows "Hope that doesn't disappoint", "Bethel Sundays": hide or keep?
