#!/usr/bin/env python3
"""Turn raw simulator screenshots into the site's phone images.
Usage: process_shots.py RAW_DIR OUT_DIR
Each NAME.png becomes NAME-360.webp, NAME-720.webp and NAME-360.png (fallback), all under 250 KB."""
import sys, os
from PIL import Image
raw, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
for f in sorted(os.listdir(raw)):
    if not f.lower().endswith(".png"): continue
    name = f[:-4]
    im = Image.open(os.path.join(raw, f)).convert("RGBA")
    for w in (360, 720):
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        q = 82
        p = os.path.join(out, f"{name}-{w}.webp")
        while True:
            r.save(p, "WEBP", quality=q, method=6)
            if os.path.getsize(p) < 245_000 or q < 40: break
            q -= 8
    r = im.resize((360, round(im.height * 360 / im.width)), Image.LANCZOS)
    p = os.path.join(out, f"{name}-360.png")
    r.quantize(colors=256, method=Image.Quantize.FASTOCTREE).save(p, optimize=True)
    print(name, im.size, os.path.getsize(p) // 1024, "KB png")
