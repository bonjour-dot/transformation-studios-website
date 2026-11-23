#!/usr/bin/env python3
"""Writes the small pages (privacy, terms, support, 404) into site/ so they share one nav, footer and <head>.

Run from the repo root:  python3 tools/build_pages.py
The home page (site/index.html) is edited by hand and is not touched by this script.
"""
import html
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent / "site"
ORIGIN = "https://transformationstudio.site"
FONT = "woff2"  # extension and format of the two font files
LEGAL = pathlib.Path(__file__).resolve().parent.parent / "legal"  # the finished texts, word for word

LOGO = ('<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="logo" viewBox="0 0 50 50">'
        '<rect width="50" height="50" rx="14" fill="#FFF4E6"/><rect x="10.5" y="19" width="3" height="12" rx="1.5" fill="#E8572A"/>'
        '<rect x="16.5" y="13.5" width="3" height="23" rx="1.5" fill="#E8572A"/><rect x="22.5" y="17.5" width="3" height="15" rx="1.5" fill="#E8572A"/>'
        '<path d="M27.5 18L39.5 25L27.5 32Z" fill="#1F8A63"/></symbol></svg>')

NAV = '''<header class="nav">
  <div class="wrap">
    <a class="logo" href="/" aria-label="Transformation Studio home"><svg><use href="#logo"/></svg><span class="wordmark"><b>Transformation</b><i>STUDIO</i></span></a>
    <nav class="nav-links" aria-label="Main"><a href="/#all">Tools</a><a href="/#how">How it works</a><a href="/#prompter">Teleprompter</a><a href="/#mac">Mac</a><a href="/#founding">Founding 100</a><a href="/#pricing">Pricing</a><a href="/#story">Our story</a></nav>
    <a class="btn btn-primary" href="/#pricing" data-store="ios">Try it free</a>
  </div>
</header>'''

FOOTER = ('<footer><div class="wrap"><span>Made in Toulouse, France · Transformation Studio</span>'
          '<span><a href="/#story">Our story</a><a href="/support/">Support</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/legal/" lang="fr">Mentions légales</a></span></div></footer>')

MAIL = '<a data-support data-fill href="mailto:admin@transformationstudio.site">admin@transformationstudio.site</a>'


def page(path, title, desc, body, robots=None, lang="en"):
    url = ORIGIN + path
    mime = "font/woff2" if FONT == "woff2" else "font/ttf"
    head = f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — Transformation Studio</title>
<meta name="description" content="{desc}">
'''
    if robots:
        head += f'<meta name="robots" content="{robots}">\n'
    else:
        head += f'<link rel="canonical" href="{url}">\n'
    head += f'''<meta property="og:type" content="website">
<meta property="og:site_name" content="Transformation Studio">
<meta property="og:title" content="{title} — Transformation Studio">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{ORIGIN}/assets/img/share-build47.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0F1A16">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/Fraunces.{FONT}" as="font" type="{mime}" crossorigin>
<link rel="preload" href="/assets/fonts/DMSans.{FONT}" as="font" type="{mime}" crossorigin>
<link rel="stylesheet" href="/assets/css/site-b21.css">
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


def doc(eyebrow, h1, lead, inner):
    return f'''<section class="doc">
  <div class="wrap">
    <div class="eyebrow">{eyebrow}</div>
    <h1>{h1}</h1>
    <p class="lead">{lead}</p>
    {inner}
  </div>
</section>'''


FAQ = '''<details><summary>Does one subscription cover iPhone, iPad and Mac?</summary><p>Yes. Subscribe once with your Apple Account and use them all.</p></details>
    <details><summary>Do I need editing experience?</summary><p>No. It was built for one person and a phone. Smart Cut and auto captions do the slow parts.</p></details>
    <details><summary>Which platforms can I post to?</summary><p>Anything your phone shares to: Instagram, TikTok, YouTube, WhatsApp and more, in 9:16, 16:9, 1:1 or 4:5.</p></details>
    <details><summary>Is my content private?</summary><p>Speech-to-text and captions run on your device.</p></details>
    <details><summary>Is my subscription a donation?</summary><p>No. It's an app subscription, and it isn't tax-deductible. The income helps support Ryan and Marita's missionary work in France.</p></details>'''

# ---------------------------------------------------------------- legal texts
# privacy, terms and legal (mentions légales) are rendered from legal/*.md, which are copied word for word from
# the app repo's Legal/ folder. Change the text there, copy it here, and run this script. Never reword it in HTML.

def inline(t):
    """Markdown inline marks -> HTML. Text is escaped first; only the marks become tags."""
    t = html.escape(t, quote=False)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<i>\1</i>", t)
    t = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+|mailto:[^)\s]+|/[^)\s]*)\)", r'<a href="\2" rel="noopener">\1</a>', t)
    t = re.sub(r"(?<![\w/\">:.@-])(https?://[^\s<)]+[^\s<).,;:])", r'<a href="\1" rel="noopener">\1</a>', t)
    t = re.sub(r"(?<![\w.:/\">-])([\w.+-]+@[\w-]+(?:\.[\w-]+)+)", r'<a href="mailto:\1">\1</a>', t)
    return t


def render_md(text):
    """A small Markdown renderer for the legal texts: headings, paragraphs, bullet and numbered lists
    (one level of nesting), tables, blockquotes and rules. Lines of one paragraph are joined with a space."""
    out, para, lines, i = [], [], text.replace("\r\n", "\n").split("\n"), 0

    def flush():
        if para:
            out.append("<p>" + inline(" ".join(x.strip() for x in para)) + "</p>")
            para.clear()

    item = re.compile(r"^(\s*)([-*+]|\d+[.)])\s+(.*)$")
    while i < len(lines):
        line = lines[i]
        st = line.strip()
        if not st:
            flush(); i += 1; continue
        m = re.match(r"^(#{1,6})\s+(.*)$", st)
        if m:
            flush()
            level = max(2, len(m.group(1)))  # the page has one h1 already
            out.append(f"<h{level}>{inline(m.group(2))}</h{level}>"); i += 1; continue
        if re.match(r"^(-{3,}|\*{3,}|_{3,})$", st):
            flush(); out.append("<hr>"); i += 1; continue
        if st.startswith(">"):
            flush(); q = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                q.append(lines[i].strip()[1:].strip()); i += 1
            out.append("<blockquote>" + render_md("\n".join(q)) + "</blockquote>"); continue
        if st.startswith("|") and i + 1 < len(lines) and re.match(r"^\|?\s*:?-{2,}", lines[i + 1].strip()):
            flush()
            cells = lambda r: [c.strip() for c in r.strip().strip("|").split("|")]
            head = cells(st); i += 2; rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append(cells(lines[i])); i += 1
            t = ['<div class="tablewrap"><table>', "<thead><tr>" + "".join(f"<th>{inline(c)}</th>" for c in head) + "</tr></thead>", "<tbody>"]
            t += ["<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in rows]
            out.append("".join(t) + "</tbody></table></div>"); continue
        m = item.match(line)
        if m and len(m.group(1)) == 0:
            flush()
            ordered = m.group(2)[0].isdigit()
            first = int(m.group(2)[:-1]) if ordered else 1
            items = []  # [text lines, child items, child ordered]
            while i < len(lines):
                l = lines[i]
                mm = item.match(l)
                if mm and len(mm.group(1)) == 0 and mm.group(2)[0].isdigit() == ordered:
                    items.append([[mm.group(3)], [], False]); i += 1
                elif mm and len(mm.group(1)) > 0 and items:
                    items[-1][1].append([mm.group(3)]); items[-1][2] = mm.group(2)[0].isdigit(); i += 1
                elif l.strip() and l[:1] in (" ", "\t") and items:
                    (items[-1][1][-1] if items[-1][1] else items[-1][0]).append(l.strip()); i += 1
                elif not l.strip() and i + 1 < len(lines) and item.match(lines[i + 1] or "") and items:
                    i += 1  # a blank line between items of the same list
                else:
                    break
            tag = "ol" if ordered else "ul"
            start = f' start="{first}"' if ordered and first != 1 else ""
            h = [f"<{tag}{start}>"]
            for text_lines, kids, kid_ordered in items:
                li = inline(" ".join(text_lines))
                if kids:
                    kt = "ol" if kid_ordered else "ul"
                    li += f"<{kt}>" + "".join("<li>" + inline(" ".join(k)) + "</li>" for k in kids) + f"</{kt}>"
                h.append(f"<li>{li}</li>")
            out.append("".join(h) + f"</{tag}>"); continue
        para.append(line); i += 1
    flush()
    return "\n    ".join(out)


def legal_page(name, eyebrow):
    """Title from the text's '# ' line, lead from its first italic line ('Last updated …'), the rest as the body."""
    text = (LEGAL / name).read_text(encoding="utf-8")
    lines = text.strip("\n").split("\n")
    title, lead = eyebrow, ""
    while lines and not lines[0].strip():
        lines.pop(0)
    if lines and lines[0].startswith("# "):
        title = lines.pop(0)[2:].strip()
    while lines and not lines[0].strip():
        lines.pop(0)
    if lines and re.match(r"^[*_][^*_].*[*_]$", lines[0].strip()):
        lead = lines.pop(0).strip()[1:-1]
    body = render_md("\n".join(lines))
    return title, doc(eyebrow, inline(title), inline(lead), body)


privacy_title, privacy = legal_page("PRIVACY.md", "Privacy")
terms_title, terms = legal_page("TERMS.md", "Terms")
legal_title, legal = legal_page("MENTIONS-LEGALES.md", "Mentions légales")

# ---------------------------------------------------------------- support
support = doc("Support", "How can we help?", "Write to us and a real person will answer.", f'''
    <p class="mailrow"><a class="btn btn-primary" data-support href="mailto:admin@transformationstudio.site">Email support</a><span>{MAIL}</span></p>

    <h2 id="cancel">Cancel your subscription</h2>
    <p>Your subscription is managed by Apple, so you cancel it in your Apple Account settings. Deleting the app does not cancel it.</p>
    <ul>
      <li><b>iPhone or iPad.</b> Open Settings › Apple Account › Subscriptions. Choose Transformation Studio and tap Cancel Subscription. In the app, Account › Manage subscription opens the same screen.</li>
      <li><b>Mac.</b> Open the App Store, click your name, then Account Settings. Under Subscriptions click Manage, then Edit next to Transformation Studio and Cancel Subscription.</li>
      <li><b>Any browser.</b> Go to <a href="https://apps.apple.com/account/subscriptions" rel="noopener">apps.apple.com/account/subscriptions</a>.</li>
    </ul>
    <p>Cancel at least 24 hours before the renewal date. You keep access until the end of the period you paid for.</p>

    <h2 id="restore">Restore your subscription</h2>
    <p>If you changed device or reinstalled the app, sign in with the same account and use the same Apple Account you subscribed with.</p>
    <ul>
      <li><b>iPhone or iPad.</b> On the Home screen, tap Account at the top of the screen. Under Your plan, tap Restore purchases. On the subscription screen, Restore Purchases is also below the Subscribe buttons.</li>
      <li><b>Mac.</b> Sign in with the same account you use on iPhone or iPad. The subscription unlocks the Mac on its own.</li>
    </ul>
    <p>For a refund, ask Apple at <a href="https://reportaproblem.apple.com" rel="noopener">reportaproblem.apple.com</a>.</p>

    <h2 id="delete">Delete your account</h2>
    <p><b>Cancel your App Store subscription first</b>, in Settings › Apple Account › Subscriptions. Deleting your account does not cancel it, and Apple would keep charging you.</p>
    <ul>
      <li><b>iPhone or iPad.</b> Home › Account (top of the screen) › Delete account › Delete account and data.</li>
      <li><b>Mac.</b> Help › Delete My Account…</li>
      <li><b>By email.</b> Write to {MAIL} from the email address you sign in with, and ask us to delete your account.</li>
    </ul>
    <p>Deleting removes your account and its plan records on every device. The videos you made stay on your devices.</p>

    <h2>Questions</h2>
    {FAQ}
''')

# ---------------------------------------------------------------- 404
notfound = '''<section class="doc nf">
  <div class="wrap" style="text-align:center">
    <div class="eyebrow">Page not found</div>
    <h1>That page isn't here.</h1>
    <p class="lead">The link may be old, or the address may have a typo.</p>
    <p class="cta"><a class="btn btn-primary" href="/">Back to the home page</a><a class="btn btn-ghost" href="/support/">Get support</a></p>
  </div>
</section>'''

page("/privacy/", "Privacy policy", "How Transformation Studio handles your data. Your videos, photos and recordings stay on your devices.", privacy)
page("/terms/", "Terms of use", "Terms of use and licence (EULA) for Transformation Studio on iPhone, iPad and Mac: one auto-renewing subscription, managed in your Apple Account settings.", terms)
page("/legal/", "Mentions légales", "Mentions légales de Transformation Studio : éditeur, hébergeur et contact.", legal, lang="fr")
page("/support/", "Support", "Get help with Transformation Studio, and see how to cancel or restore your subscription or delete your account.", support)
page("/404.html", "Page not found", "This page could not be found.", notfound, robots="noindex")
