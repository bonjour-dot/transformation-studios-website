#!/usr/bin/env python3
"""Writes the small pages (privacy, terms, support, 404) into site/ so they share one nav, footer and <head>.

Run from the repo root:  python3 tools/build_pages.py
The home page (site/index.html) is edited by hand and is not touched by this script.
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent / "site"
ORIGIN = "https://transformationstudio.site"
FONT = "woff2"  # extension and format of the two font files
UPDATED = "12 November 2026"

LOGO = ('<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="logo" viewBox="0 0 50 50">'
        '<rect width="50" height="50" rx="14" fill="#FFF4E6"/><rect x="10.5" y="19" width="3" height="12" rx="1.5" fill="#E8572A"/>'
        '<rect x="16.5" y="13.5" width="3" height="23" rx="1.5" fill="#E8572A"/><rect x="22.5" y="17.5" width="3" height="15" rx="1.5" fill="#E8572A"/>'
        '<path d="M27.5 18L39.5 25L27.5 32Z" fill="#1F8A63"/></symbol></svg>')

NAV = '''<header class="nav">
  <div class="wrap">
    <a class="logo" href="/" aria-label="Transformation Studios home"><svg><use href="#logo"/></svg><span class="wordmark"><b>Transformation</b><i>STUDIOS</i></span></a>
    <nav class="nav-links" aria-label="Main"><a href="/#all">All in one</a><a href="/#edit">Editing</a><a href="/#prompter">Teleprompter</a><a href="/#voice">Transcripts</a><a href="/#mac">Mac</a><a href="/#pricing">Pricing</a><a href="/#story">Our story</a></nav>
    <a class="btn btn-primary" href="/#pricing" data-store="ios">Try it free</a>
  </div>
</header>'''

FOOTER = ('<footer><div class="wrap"><span>Made in Toulouse, France · Transformation Studios</span>'
          '<span><a href="/#story">Our story</a><a href="/support/">Support</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></span></div></footer>')

DRAFT = '<p class="draft" role="note"><b>DRAFT: Ryan to review.</b> This page is not final. Anything marked <mark>[TO CONFIRM]</mark> still needs checking before launch.</p>'
TC = '<mark>[TO CONFIRM]</mark>'
MAIL = '<a data-support data-fill href="mailto:hello@transformationstudio.site">hello@transformationstudio.site</a>'


def page(path, title, desc, body, robots=None):
    url = ORIGIN + path
    mime = "font/woff2" if FONT == "woff2" else "font/ttf"
    head = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — Transformation Studios</title>
<meta name="description" content="{desc}">
'''
    if robots:
        head += f'<meta name="robots" content="{robots}">\n'
    else:
        head += f'<link rel="canonical" href="{url}">\n'
    head += f'''<meta property="og:type" content="website">
<meta property="og:site_name" content="Transformation Studios">
<meta property="og:title" content="{title} — Transformation Studios">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{ORIGIN}/assets/img/share-reaching-many.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0F1A16">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/Fraunces.{FONT}" as="font" type="{mime}" crossorigin>
<link rel="preload" href="/assets/fonts/DMSans.{FONT}" as="font" type="{mime}" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
</head>
<body>
{LOGO}
{NAV}
<main id="top">
{body}
</main>
{FOOTER}
<script src="/assets/js/site.js"></script>
</body>
</html>
'''
    out = ROOT / path.lstrip("/")
    if path.endswith("/"):
        out = out / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(head, encoding="utf-8")
    print("wrote", out.relative_to(ROOT.parent))


def doc(eyebrow, h1, lead, inner, draft=True):
    return f'''<section class="doc">
  <div class="wrap">
    <div class="eyebrow">{eyebrow}</div>
    <h1>{h1}</h1>
    <p class="lead">{lead}</p>
    {DRAFT if draft else ""}
    {inner}
  </div>
</section>'''


FAQ = '''<details><summary>Does one subscription cover iPhone, iPad and Mac?</summary><p>Yes. Subscribe once with your Apple ID and use them all.</p></details>
    <details><summary>Do I need editing experience?</summary><p>No. It was built for one person and a phone. Smart Cut and auto captions do the slow parts.</p></details>
    <details><summary>Which platforms can I post to?</summary><p>Anything your phone shares to: Instagram, TikTok, YouTube, WhatsApp and more, in 9:16, 16:9, 1:1 or 4:5.</p></details>
    <details><summary>Is my content private?</summary><p>Speech-to-text and captions run on your device.</p></details>
    <details><summary>Is my subscription a donation?</summary><p>No. It's an app subscription, and it isn't tax-deductible. The income helps support Ryan and Marita's missionary work in France.</p></details>'''

# ---------------------------------------------------------------- privacy
privacy = doc("Privacy", "Privacy policy", f"Last updated {UPDATED}.", f'''
    <h2>The short version</h2>
    <p>Your videos, photos, recordings, presentations and transcripts are made and kept on your own devices, and in the folder you choose, such as iCloud or Google Drive. We never receive them. We only keep what is needed for your account and your subscription.</p>

    <h2>Who we are</h2>
    <p>Transformation Studios is published by Ryan Caley, Toulouse, France {TC} <span class="tc-note">(legal name or company, and postal address)</span>. For anything about your data, write to {MAIL}.</p>

    <h2>What runs on your device only</h2>
    <p>Speech-to-text and captions run on your device. Editing and exporting also happen on your device. {TC} <span class="tc-note">(that translation and voice clean-up also run on the device, on iPhone and iPad as well as Mac)</span></p>

    <h2>What we collect</h2>
    <div class="tablewrap"><table>
      <thead><tr><th>What</th><th>Why</th><th>Legal basis (GDPR)</th></tr></thead>
      <tbody>
        <tr><td>Email address, and name if you sign in with Apple or Google</td><td>To create your account and sign you in</td><td>Contract</td></tr>
        <tr><td>Account identifier and sign-in times</td><td>To keep you signed in securely</td><td>Contract and legitimate interest</td></tr>
        <tr><td>Subscription status and renewal date, reported by Apple</td><td>To unlock the app on your devices</td><td>Contract</td></tr>
        <tr><td>Messages you send to support</td><td>To answer you</td><td>Legitimate interest</td></tr>
      </tbody>
    </table></div>
    <p>{TC} <span class="tc-note">(whether the iPhone and iPad app needs an account, or only the Mac app)</span></p>
    <p>We do not collect your media, your projects, what you say in your recordings, analytics of what you do in the app, or advertising identifiers. We do not sell or share personal data for advertising.</p>

    <h2>Services we use</h2>
    <ul>
      <li><b>Apple.</b> The App Store is the seller: it handles payment, VAT and invoices. Apple receives your payment details directly and we never see your card. We store the subscription status Apple reports so the app can unlock. Apple is also used if you sign in with Apple.</li>
      <li><b>Supabase.</b> Holds accounts and subscription status. Servers in {TC} <span class="tc-note">(region)</span>.</li>
      <li><b>Google.</b> Only if you choose to sign in with Google, or to import from or save to Google Drive.</li>
    </ul>
    <p>{TC} <span class="tc-note">(any other service: crash reporting, analytics, or another payment provider)</span></p>

    <h2>Features where you send data yourself</h2>
    <ul>
      <li><b>Google Drive and iCloud folders.</b> If you keep your library there, or import a script from there, Google or Apple stores those files under your agreement with them.</li>
      <li><b>Ask Claude (presentations, on Mac).</b> The text you type is sent to Anthropic using your own Anthropic API key, which is stored in your Mac's Keychain. Anthropic's privacy policy applies to that request.</li>
      <li><b>iPhone and iPad link.</b> Works on your own Wi-Fi only, directly between your devices.</li>
      <li><b>Sharing.</b> When you post or share a file, it goes to the app or service you pick.</li>
    </ul>

    <h2>This website</h2>
    <p>This website sets no cookies and has no visitor tracking. Our host, Netlify, keeps standard server logs (such as IP address and the page requested) to run and protect the site. If you play the story video, it loads from the video service only after you click. If you email us, we keep your message so we can reply.</p>

    <h2>How long we keep it</h2>
    <p>Account data: while your account exists, then deleted within 30 days of you deleting it. Subscription status: while your account exists. Apple keeps the payment invoices.</p>

    <h2>Your rights</h2>
    <p>You can access, correct, export or delete your data, object to processing, and complain to the CNIL (<a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>). You can ask for your account to be deleted from inside the app {TC} <span class="tc-note">(where the Delete My Account option is on iPhone and iPad; on Mac it is Help › Delete My Account…)</span> or by writing to {MAIL}. We do it within 30 days.</p>

    <h2>Children</h2>
    <p>Transformation Studios is not intended for children under 15 without a parent's consent.</p>

    <h2>Changes</h2>
    <p>We will tell you in the app or by email before any important change.</p>
''')

# ---------------------------------------------------------------- terms
terms = doc("Terms", "Terms of use", f"Last updated {UPDATED}.", f'''
    <h2>The subscription</h2>
    <ul>
      <li><b>Price.</b> $9.99 a month or $99.99 a year. Prices in other countries are shown in the App Store and include tax where required.</li>
      <li><b>Free trial.</b> New subscribers get 7 days free. If you don't cancel at least 24 hours before the trial ends, the subscription starts and your Apple ID is charged.</li>
      <li><b>Renewal.</b> The subscription renews automatically for the same period until you cancel. Cancel at least 24 hours before the renewal date to avoid the next charge.</li>
      <li><b>Managing and cancelling.</b> Payment is taken by Apple through your Apple ID. You manage and cancel the subscription in your Apple ID settings, not on this website. See <a href="/support/#cancel">how to cancel</a>.</li>
      <li><b>What it covers.</b> One subscription covers iPhone, iPad and Mac with the same Apple ID.</li>
      <li><b>Refunds.</b> Apple handles refunds at <a href="https://reportaproblem.apple.com" rel="noopener">reportaproblem.apple.com</a>.</li>
    </ul>

    <h2>Not a donation</h2>
    <p>Transformation Studios is an app subscription sold by Ryan Caley, not a donation, and it isn't tax-deductible. The income helps support Ryan and Marita's missionary work in France, but you are buying software, and you receive no tax receipt.</p>

    <h2>Licence</h2>
    <p>Your use of the app is covered by Apple's standard <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" rel="noopener">Licensed Application End User License Agreement (EULA)</a>, together with the points on this page. {TC} <span class="tc-note">(that the App Store listing uses Apple's standard EULA rather than a custom one)</span></p>

    <h2>Your content is yours</h2>
    <p>We claim no rights over anything you make. You are responsible for having the rights to the media, music, fonts and footage you use, and for what you publish.</p>

    <h2>Acceptable use</h2>
    <p>Don't use the app to infringe copyright, break the law, or harm others.</p>

    <h2>Third-party services</h2>
    <p>Sign in with Apple or Google, Google Drive, iCloud and Anthropic (Ask Claude) are governed by their own terms.</p>

    <h2>Updates</h2>
    <p>We may update the app to fix problems or add features. We will keep the features you paid for working for the period you paid for.</p>

    <h2>Warranty and liability</h2>
    <p>The app is provided as it is. Keep backups of important projects. Except where the law does not allow it, our total liability is limited to what you paid in the 12 months before the claim. Nothing here limits your rights as a consumer under French and EU law. {TC} <span class="tc-note">(have this section checked)</span></p>

    <h2>Law</h2>
    <p>French law applies. EU consumers may also use the courts of their own country. {TC}</p>

    <h2>Contact</h2>
    <p>{MAIL}</p>
''')

# ---------------------------------------------------------------- support
support = doc("Support", "How can we help?", "Write to us and a real person will answer.", f'''
    <p class="mailrow"><a class="btn btn-primary" data-support href="mailto:hello@transformationstudio.site">Email support</a><span>{MAIL}</span></p>

    <h2 id="cancel">Cancel your subscription</h2>
    <p>Your subscription is managed by Apple, so you cancel it in your Apple ID settings. Deleting the app does not cancel it.</p>
    <ul>
      <li><b>iPhone or iPad.</b> Open Settings, tap your name, then Subscriptions. Choose Transformation Studios and tap Cancel Subscription.</li>
      <li><b>Mac.</b> Open the App Store, click your name, then Account Settings. Under Subscriptions click Manage, then Edit next to Transformation Studios and Cancel Subscription.</li>
      <li><b>Any browser.</b> Go to <a href="https://apps.apple.com/account/subscriptions" rel="noopener">apps.apple.com/account/subscriptions</a>.</li>
    </ul>
    <p>Cancel at least 24 hours before the renewal date. You keep access until the end of the period you paid for.</p>

    <h2 id="restore">Restore your subscription</h2>
    <p>If you changed device or reinstalled the app, sign in with the same Apple ID you subscribed with, open the subscription screen in the app and choose Restore Purchases. {TC} <span class="tc-note">(the exact name and place of the Restore button)</span></p>
    <p>For a refund, ask Apple at <a href="https://reportaproblem.apple.com" rel="noopener">reportaproblem.apple.com</a>.</p>

    <h2>Questions</h2>
    {FAQ}
''', draft=False)

# ---------------------------------------------------------------- 404
notfound = '''<section class="doc nf">
  <div class="wrap" style="text-align:center">
    <div class="eyebrow">Page not found</div>
    <h1>That page isn't here.</h1>
    <p class="lead">The link may be old, or the address may have a typo.</p>
    <p class="cta"><a class="btn btn-primary" href="/">Back to the home page</a><a class="btn btn-ghost" href="/support/">Get support</a></p>
  </div>
</section>'''

page("/privacy/", "Privacy policy", "How Transformation Studios handles your data. Speech-to-text and captions run on your device.", privacy)
page("/terms/", "Terms of use", "Subscription terms for Transformation Studios: $9.99 a month or $99.99 a year, 7-day free trial, managed in your Apple ID settings.", terms)
page("/support/", "Support", "Get help with Transformation Studios, and see how to cancel or restore your subscription.", support)
page("/404.html", "Page not found", "This page could not be found.", notfound, robots="noindex")
