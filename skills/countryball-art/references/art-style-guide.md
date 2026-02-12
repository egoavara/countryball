# Countryball Art Style Guide

This document defines the two official art styles for countryball SVGs: **Borderball** and **Classic**. All generated countryballs must follow one of these styles.

---

## 1. Borderball Style

The borderball style uses clean, flat shapes with no shading or shadow. It is the default and preferred style.

### Body

- Perfect circle centered on the canvas.
- SVG element: `<circle cx="256" cy="256" r="200"/>`
- Outline: **12px** black stroke on the body circle (`stroke="#000" stroke-width="12"`).

### Eyes

- Shape: **Half-dome / arch** opening downward (flat edge on top, curved part below). They look like upside-down U shapes.
- SVG element: `<path>` using arc commands.
- Fill: `#FFFFFF` (pure white). Stroke: `#000000`, stroke-width `4`.
- Each eye is approximately **50-56px wide** and **25-28px tall**.
- Positioned in the upper portion of the flag area, roughly 35-40% from the top of the body.
- Two eyes spaced approximately **80px** apart, centered horizontally on the body.
- **NO pupils** (no black dots or circles inside the eyes).
- **NO eyebrows**.

### Colors and Shading

- **Flat colors only.** No gradients, no radial shading, no drop shadows.
- Flag colors fill the entire circle body via a `<clipPath>`.

### Shadow

- **None.** No ground shadow beneath the body.

---

## 2. Classic Style

The classic style has a hand-drawn, slightly irregular feel with optional shading and a ground shadow.

### Body

- Slightly irregular ellipse, taller than it is wide or vice versa, giving a squished or wobbly look.
- SVG element: `<ellipse cx="256" cy="265" rx="210" ry="195"/>`
- Outline: **10px** black stroke (`stroke="#000" stroke-width="10"`).

### Eyes

- Shape: **Vertical oval / ellipse**.
- SVG element: `<ellipse>` with approximate dimensions `rx="18" ry="25"`.
- Fill: `#FFFFFF` (pure white). Stroke: `#000000`, stroke-width `4`.
- Two eyes spaced approximately **70-80px** apart, centered horizontally.
- Positioned roughly 35-40% from the top of the body.
- **NO pupils** (the inside of the eye is always pure white).
- Optional **eyebrows**: small arc `<path>` elements above each eye.

### Shading

- A `<radialGradient>` overlay inside the body clip to create a subtle 3D spherical effect.
- Gradient goes from transparent in the upper-left to a semi-transparent dark color in the lower-right.
- Applied as a filled ellipse matching the body, layered on top of the flag.

### Shadow

- **None.** NEVER add ground shadows or drop shadows to countryballs, even in classic style.

---

## 3. Common Rules (Both Styles)

### Canvas

- **512x512 pixels.** All countryballs are drawn on a 512x512 SVG canvas.
- Root SVG element: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">`

### Simplicity

- Countryballs are **just balls with flags and eyes**. The design must remain very simple.
- Do not over-detail the flag. Use flat solid-color shapes to represent the flag pattern.

### Eye Positioning

- Eyes are positioned roughly **35-40% from the top** of the body.
- Eyes are spaced apart by roughly **20-30% of the body width**.

### Flag Clipping

- Flag patterns **must be clipped** to the body shape using a `<clipPath>`.
- The clipPath must use `id="body-clip"` and contain the body shape (circle or ellipse).

### Required SVG Layers

All SVGs must contain these groups in order:

1. `<g id="layer-flag" clip-path="url(#body-clip)">` -- Flag pattern elements
2. `<g id="layer-eyes">` -- Eye elements
3. `<g id="layer-outline">` -- Body outline (the circle/ellipse with stroke, no fill)

### Required Metadata Attributes

On the root `<svg>` element:

- `data-style="borderball"` or `data-style="classic"` -- which style is used
- `data-country="XX"` -- ISO 3166-1 alpha-2 country code (e.g., `PL`, `DE`, `FR`)

### clipPath Definition

```xml
<defs>
  <clipPath id="body-clip">
    <!-- For borderball: -->
    <circle cx="256" cy="256" r="200"/>
    <!-- For classic: -->
    <!-- <ellipse cx="256" cy="265" rx="210" ry="195"/> -->
  </clipPath>
</defs>
```

---

## 4. What NOT to Do

- **No pupils or irises.** Eyes are always solid white with a black outline. Never add black dots, colored circles, or any detail inside the eye shape.
- **No limbs.** No arms, legs, hands, or feet.
- **No mouth** unless specifically requested for a particular expression.
- **No nose.**
- **No ears or hair.**
- **No shadows.** NEVER add ground shadows, drop shadows, or any shadow effects to countryballs.
- **No excessive detail.** Simplicity is the core aesthetic. If in doubt, leave it out.
- **No text or labels** on the ball (unless it is part of the flag itself, such as a coat of arms when explicitly requested).

---

## 5. Reference Images

| File | Style | Description |
|------|-------|-------------|
| `01_polandball_classic.png` | Classic | Irregular shape, oval eyes, ground shadow |
| `02_polandball_shaded.png` | Classic | Heavy shading, thick outline |
| `03_borderball_poland.png` | Borderball | Perfect circle, arch/half-dome eyes |
| `04_polandball_squish.png` | Classic | Squished body, arch eyes looking down |
| `05_borderball_germany.png` | Borderball | Black-red-gold horizontal stripes |
| `06_borderball_france.png` | Borderball | Blue-white-red vertical stripes |
| `07_borderball_uk.png` | Borderball | Union Jack pattern |
| `08_borderball_russia.png` | Borderball | White-blue-red horizontal stripes |
| `09_borderball_italy.png` | Borderball | Green-white-red vertical stripes |
| `10_borderball_sweden.png` | Borderball | Blue with yellow Nordic cross |
