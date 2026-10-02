import os
import shutil
from PIL import Image, ImageDraw, ImageEnhance

BRAIN_DIR = r"C:\Users\mehul\.gemini\antigravity-ide\brain\42f83280-9478-4a26-8c17-d7ba17ff51aa"
PREVIEW_IMG = os.path.join(BRAIN_DIR, "portfolio_favicon_preview_1790942814769.jpg")
APP_DIR = r"c:\mehul\DEV\Projects\4D portfoio\portfolio\app"
PUBLIC_DIR = r"c:\mehul\DEV\Projects\4D portfoio\portfolio\public"

def generate_assets():
    print(f"Loading preview image from {PREVIEW_IMG}...")
    img = Image.open(PREVIEW_IMG).convert("RGBA")

    # Precise badge bounding box centered around squircle: (132, 121, 892, 881) (760x760)
    crop_box = (132, 121, 892, 881)
    badge = img.crop(crop_box).resize((512, 512), Image.Resampling.LANCZOS)

    # Apply anti-aliased rounded squircle mask with slight padding
    mask = Image.new("L", (1024, 1024), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(16, 16), (1008, 1008)], radius=230, fill=255)
    mask = mask.resize((512, 512), Image.Resampling.LANCZOS)
    badge.putalpha(mask)

    # 1. High-Res 512x512 Master PNG
    badge.save(os.path.join(APP_DIR, "icon.png"), format="PNG")
    badge.save(os.path.join(PUBLIC_DIR, "icon.png"), format="PNG")
    badge.save(os.path.join(PUBLIC_DIR, "icon-512.png"), format="PNG")
    badge.save(os.path.join(BRAIN_DIR, "favicon_512.png"), format="PNG")
    print("512x512 icons saved.")

    # 2. Apple Touch Icon (180x180) - Solid dark squircle background as recommended for iOS
    apple_bg = Image.new("RGBA", (180, 180), (5, 6, 8, 255))
    apple_badge = badge.resize((180, 180), Image.Resampling.LANCZOS)
    apple_icon = Image.alpha_composite(apple_bg, apple_badge)
    apple_icon.save(os.path.join(APP_DIR, "apple-icon.png"), format="PNG")
    apple_icon.save(os.path.join(PUBLIC_DIR, "apple-icon.png"), format="PNG")
    apple_icon.save(os.path.join(BRAIN_DIR, "apple_icon_180.png"), format="PNG")
    print("Apple touch icons (180x180) saved.")

    # 3. Android PWA Icon (192x192)
    icon_192 = badge.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save(os.path.join(PUBLIC_DIR, "icon-192.png"), format="PNG")
    print("Android 192x192 icon saved.")

    # 4. Multi-resolution Favicon.ico (16, 32, 48, 64, 128, 256)
    ico_path_app = os.path.join(APP_DIR, "favicon.ico")
    ico_path_public = os.path.join(PUBLIC_DIR, "favicon.ico")
    ico_path_brain = os.path.join(BRAIN_DIR, "favicon.ico")
    
    # Save standard Windows/Browser multi-resolution ICO
    badge.save(ico_path_app, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    shutil.copy(ico_path_app, ico_path_public)
    shutil.copy(ico_path_app, ico_path_brain)
    print("Multi-resolution favicon.ico (16-256px) saved.")

    # 5. Scaled test previews for verification
    for size in [16, 32, 48, 64]:
        s_img = badge.resize((size, size), Image.Resampling.LANCZOS)
        s_img.save(os.path.join(BRAIN_DIR, f"favicon_{size}.png"), format="PNG")
    print("Micro-size verification PNGs saved.")

    # 6. Vector SVG Favicon (for modern high-DPI browsers)
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0e1f36" />
      <stop offset="45%" stop-color="#070c14" />
      <stop offset="100%" stop-color="#030407" />
    </radialGradient>

    <!-- Border Gradient -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.85" />
      <stop offset="35%" stop-color="#0891b2" stop-opacity="0.3" />
      <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#0e7490" stop-opacity="0.25" />
    </linearGradient>

    <!-- Glowing Cyan Gradients for M -->
    <linearGradient id="cyanBright" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a5f3fc" />
      <stop offset="40%" stop-color="#22d3ee" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>

    <linearGradient id="cyanDeep" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0891b2" />
      <stop offset="100%" stop-color="#083344" />
    </linearGradient>

    <linearGradient id="cyanFacet" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>

    <linearGradient id="tesseractWire" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#0891b2" stop-opacity="0.2" />
    </linearGradient>

    <!-- Neon Glow Filter -->
    <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur1" />
      <feGaussianBlur stdDeviation="14" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Outer Rounded Squircle Frame -->
  <rect x="20" y="20" width="472" height="472" rx="108" fill="url(#bgGlow)" stroke="url(#borderGrad)" stroke-width="4.5" />

  <!-- Inner HUD Reticle & Corner Brackets -->
  <g stroke="#22d3ee" stroke-opacity="0.45" stroke-width="2.5" fill="none">
    <!-- Top-Left Reticle -->
    <path d="M 64 88 L 64 64 L 88 64" />
    <circle cx="96" cy="96" r="6" stroke="#06b6d4" stroke-opacity="0.7" stroke-width="1.8" />
    <circle cx="96" cy="96" r="1.8" fill="#22d3ee" />
    
    <!-- Top-Right Reticle -->
    <path d="M 448 88 L 448 64 L 424 64" />
    <circle cx="416" cy="96" r="6" stroke="#06b6d4" stroke-opacity="0.7" stroke-width="1.8" />
    <circle cx="416" cy="96" r="1.8" fill="#22d3ee" />

    <!-- Bottom-Left Reticle -->
    <path d="M 64 424 L 64 448 L 88 448" />
    <circle cx="96" cy="416" r="6" stroke="#06b6d4" stroke-opacity="0.7" stroke-width="1.8" />
    <circle cx="96" cy="416" r="1.8" fill="#22d3ee" />

    <!-- Bottom-Right Reticle -->
    <path d="M 448 424 L 448 448 L 424 448" />
    <circle cx="416" cy="416" r="6" stroke="#06b6d4" stroke-opacity="0.7" stroke-width="1.8" />
    <circle cx="416" cy="416" r="1.8" fill="#22d3ee" />
  </g>

  <!-- 4D Tesseract Hexagonal Framework (Subtle Cyber Grid) -->
  <g stroke="url(#tesseractWire)" stroke-width="2" fill="none">
    <!-- Outer Hexagon -->
    <polygon points="256,84 402,168 402,336 256,420 110,336 110,168" stroke-dasharray="6,4" />
    
    <!-- Inner Projection Lines to Center -->
    <line x1="256" y1="84" x2="256" y2="252" stroke-opacity="0.35" />
    <line x1="402" y1="168" x2="256" y2="252" stroke-opacity="0.35" />
    <line x1="402" y1="336" x2="256" y2="252" stroke-opacity="0.35" />
    <line x1="256" y1="420" x2="256" y2="252" stroke-opacity="0.35" />
    <line x1="110" y1="336" x2="256" y2="252" stroke-opacity="0.35" />
    <line x1="110" y1="168" x2="256" y2="252" stroke-opacity="0.35" />
  </g>

  <!-- Luminous Ambient Halo Behind M -->
  <circle cx="256" cy="265" r="120" fill="#00f2fe" fill-opacity="0.16" filter="url(#coreGlow)" />

  <!-- 3D Geometric 4D Monogram "M" -->
  <g filter="url(#neonGlow)">
    <!-- LEFT PILLAR -->
    <!-- Front Face -->
    <path d="M 130 174 L 196 138 L 196 338 L 130 374 Z" fill="url(#cyanFacet)" opacity="0.9" />
    <!-- Bevel Top/Inner -->
    <path d="M 196 138 L 256 250 L 224 270 L 196 222 L 196 338 L 166 354 L 166 210 Z" fill="#083344" opacity="0.8" />
    <!-- Outer Rim Highlight -->
    <path d="M 130 174 L 196 138 L 196 338 L 130 374 Z" stroke="#38bdf8" stroke-width="4.5" fill="none" stroke-linejoin="round" />

    <!-- RIGHT PILLAR -->
    <!-- Front Face -->
    <path d="M 382 174 L 316 138 L 316 338 L 382 374 Z" fill="url(#cyanFacet)" opacity="0.9" />
    <!-- Bevel Top/Inner -->
    <path d="M 316 138 L 256 250 L 288 270 L 316 222 L 316 338 L 346 354 L 346 210 Z" fill="#083344" opacity="0.8" />
    <!-- Outer Rim Highlight -->
    <path d="M 382 174 L 316 138 L 316 338 L 382 374 Z" stroke="#38bdf8" stroke-width="4.5" fill="none" stroke-linejoin="round" />

    <!-- CENTER CHEVRON & 4D NODE -->
    <!-- Top Left Wing Slope -->
    <path d="M 196 138 L 256 266 L 228 280 L 164 154 Z" fill="url(#cyanBright)" />
    <!-- Top Right Wing Slope -->
    <path d="M 316 138 L 256 266 L 284 280 L 348 154 Z" fill="url(#cyanBright)" />

    <!-- Center V-Crest Point -->
    <polygon points="256,218 294,284 256,354 218,284" fill="url(#cyanDeep)" stroke="#22d3ee" stroke-width="3.5" />
    
    <!-- Central Tesseract Core Crystal -->
    <polygon points="256,240 278,284 256,326 234,284" fill="#e0f2fe" filter="url(#neonGlow)" />
    <circle cx="256" cy="284" r="5" fill="#ffffff" />

    <!-- Lower Diamond Stabilizer / 4D Vertex -->
    <path d="M 218 284 L 256 354 L 196 338 Z" fill="#0369a1" opacity="0.75" />
    <path d="M 294 284 L 256 354 L 316 338 Z" fill="#0284c7" opacity="0.75" />
    
    <!-- Bottom Anchor Spine -->
    <polygon points="256,354 274,384 256,416 238,384" fill="url(#cyanBright)" stroke="#a5f3fc" stroke-width="2" />
  </g>

  <!-- Glowing Circuit Accents -->
  <circle cx="160" cy="114" r="3.5" fill="#22d3ee" filter="url(#neonGlow)" />
  <circle cx="352" cy="114" r="3.5" fill="#22d3ee" filter="url(#neonGlow)" />
  <line x1="160" y1="114" x2="202" y2="114" stroke="#22d3ee" stroke-width="1.8" stroke-opacity="0.7" />
  <line x1="352" y1="114" x2="310" y2="114" stroke="#22d3ee" stroke-width="1.8" stroke-opacity="0.7" />
</svg>"""

    with open(os.path.join(APP_DIR, "icon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)
    with open(os.path.join(PUBLIC_DIR, "icon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)
    with open(os.path.join(BRAIN_DIR, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Vector SVG icons saved to app/ and public/ and brain/.")

if __name__ == "__main__":
    generate_assets()
