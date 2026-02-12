# Countryball Accessories

This document provides SVG code snippets and styling guidelines for optional countryball accessories. Accessories are placed in dedicated layers that sit between the existing layers.

---

## 1. Layer Structure

Accessories use two optional layers with different Z-order positions:

```
layer-flag            (1 - bottom)
layer-outline         (2)
layer-accessories-back (3 - optional: hats, scarves)
layer-eyes            (4)
layer-accessories-front (5 - optional: glasses, monocle)
```

- **Back layer** (`layer-accessories-back`): Items that appear **behind** the eyes (hats, scarves, bow ties).
- **Front layer** (`layer-accessories-front`): Items that appear **in front of** the eyes (glasses, monocle, pipe).

### Metadata

Add a `data-accessories` attribute to the root `<svg>` element listing all accessories by ID:

```xml
<svg ... data-accessories="top-hat,monocle">
```

---

## 2. Back Layer Accessories (Hats, Scarves)

All coordinates are based on the **borderball** template (body center: `cx=256, cy=256, r=200`). For **classic** style, shift `cy` by **+9px** (body center is at `cy=265`).

### 2.1 Top Hat (`top-hat`)

A tall black silk hat, British style.

```xml
<g id="acc-top-hat">
  <!-- Hat brim -->
  <ellipse cx="256" cy="80" rx="100" ry="14"
           fill="#1A1A1A" stroke="#000" stroke-width="3"/>
  <!-- Hat body -->
  <rect x="186" y="10" width="140" height="70" rx="6"
        fill="#1A1A1A" stroke="#000" stroke-width="3"/>
  <!-- Hat band -->
  <rect x="186" y="60" width="140" height="12"
        fill="#8B0000"/>
</g>
```

### 2.2 Beret (`beret`)

A flat French-style beret.

```xml
<g id="acc-beret">
  <!-- Beret body -->
  <ellipse cx="256" cy="78" rx="90" ry="30"
           fill="#1A1A1A" stroke="#000" stroke-width="3"/>
  <!-- Beret stem -->
  <circle cx="256" cy="52" r="6"
          fill="#1A1A1A" stroke="#000" stroke-width="2"/>
</g>
```

### 2.3 Ushanka (`ushanka`)

A Russian fur hat with ear flaps.

```xml
<g id="acc-ushanka">
  <!-- Main hat body -->
  <ellipse cx="256" cy="75" rx="95" ry="35"
           fill="#5C4033" stroke="#000" stroke-width="3"/>
  <!-- Fur brim -->
  <ellipse cx="256" cy="95" rx="105" ry="18"
           fill="#D2B48C" stroke="#000" stroke-width="2"/>
  <!-- Left ear flap -->
  <path d="M 165 90 Q 150 130 155 165 Q 165 170 180 160 Q 175 130 170 95 Z"
        fill="#5C4033" stroke="#000" stroke-width="2"/>
  <!-- Right ear flap -->
  <path d="M 347 90 Q 362 130 357 165 Q 347 170 332 160 Q 337 130 342 95 Z"
        fill="#5C4033" stroke="#000" stroke-width="2"/>
</g>
```

### 2.4 Fez (`fez`)

An Ottoman-style red fez with tassel.

```xml
<g id="acc-fez">
  <!-- Fez body (trapezoid shape) -->
  <path d="M 216 95 L 210 55 Q 256 40 302 55 L 296 95 Z"
        fill="#DC143C" stroke="#000" stroke-width="3"/>
  <!-- Tassel base -->
  <circle cx="256" cy="50" r="5"
          fill="#1A1A1A" stroke="#000" stroke-width="2"/>
  <!-- Tassel string -->
  <path d="M 256 55 Q 290 50 295 75"
        fill="none" stroke="#1A1A1A" stroke-width="2"/>
  <!-- Tassel tip -->
  <circle cx="295" cy="75" r="6"
          fill="#1A1A1A"/>
</g>
```

### 2.5 Military Cap (`military-cap`)

A military peaked cap with badge.

```xml
<g id="acc-military-cap">
  <!-- Cap body -->
  <path d="M 166 95 Q 170 55 256 45 Q 342 55 346 95 Z"
        fill="#3C5A3C" stroke="#000" stroke-width="3"/>
  <!-- Cap brim -->
  <path d="M 166 95 Q 256 115 346 95 Q 340 105 256 110 Q 172 105 166 95 Z"
        fill="#1A1A1A" stroke="#000" stroke-width="2"/>
  <!-- Badge -->
  <circle cx="256" cy="72" r="10"
          fill="#FFD700" stroke="#000" stroke-width="2"/>
</g>
```

### 2.6 Crown (`crown`)

A golden crown with jewels.

```xml
<g id="acc-crown">
  <!-- Crown base -->
  <rect x="196" y="65" width="120" height="35" rx="3"
        fill="#FFD700" stroke="#000" stroke-width="3"/>
  <!-- Crown points -->
  <path d="M 196 65 L 210 30 L 226 65 L 242 25 L 256 65 L 270 25 L 286 65 L 302 30 L 316 65"
        fill="#FFD700" stroke="#000" stroke-width="3"/>
  <!-- Jewels -->
  <circle cx="226" cy="78" r="5" fill="#DC143C" stroke="#000" stroke-width="1"/>
  <circle cx="256" cy="78" r="5" fill="#4169E1" stroke="#000" stroke-width="1"/>
  <circle cx="286" cy="78" r="5" fill="#DC143C" stroke="#000" stroke-width="1"/>
</g>
```

### 2.7 Bow Tie (`bow-tie`)

A decorative bow tie at the bottom of the ball.

```xml
<g id="acc-bow-tie">
  <!-- Left wing -->
  <path d="M 256 420 L 216 400 L 216 440 Z"
        fill="#DC143C" stroke="#000" stroke-width="3"/>
  <!-- Right wing -->
  <path d="M 256 420 L 296 400 L 296 440 Z"
        fill="#DC143C" stroke="#000" stroke-width="3"/>
  <!-- Center knot -->
  <circle cx="256" cy="420" r="8"
          fill="#B01030" stroke="#000" stroke-width="2"/>
</g>
```

### 2.8 Scarf (`scarf`)

A knitted scarf wrapped around the lower body.

```xml
<g id="acc-scarf">
  <!-- Scarf wrap -->
  <path d="M 140 370 Q 200 395 256 390 Q 312 395 372 370 Q 365 400 256 410 Q 147 400 140 370 Z"
        fill="#CC2200" stroke="#000" stroke-width="3"/>
  <!-- Scarf tail -->
  <path d="M 330 385 Q 350 420 340 460 Q 335 465 320 460 Q 325 425 315 395"
        fill="#CC2200" stroke="#000" stroke-width="3"/>
  <!-- Stripe detail -->
  <path d="M 150 380 Q 200 400 256 397 Q 312 400 362 380"
        fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.5"/>
</g>
```

---

## 3. Front Layer Accessories (Glasses, Monocle)

These accessories appear **in front of** the eyes.

### 3.1 Glasses (`glasses`)

Round glasses with transparent lenses.

```xml
<g id="acc-glasses">
  <!-- Left lens -->
  <circle cx="210" cy="220" r="32"
          fill="none" stroke="#1A1A1A" stroke-width="4"/>
  <!-- Right lens -->
  <circle cx="310" cy="220" r="32"
          fill="none" stroke="#1A1A1A" stroke-width="4"/>
  <!-- Bridge -->
  <path d="M 242 220 Q 256 212 278 220"
        fill="none" stroke="#1A1A1A" stroke-width="4"/>
  <!-- Left temple -->
  <path d="M 178 220 L 140 210"
        fill="none" stroke="#1A1A1A" stroke-width="3"/>
  <!-- Right temple -->
  <path d="M 342 220 L 380 210"
        fill="none" stroke="#1A1A1A" stroke-width="3"/>
</g>
```

### 3.2 Sunglasses (`sunglasses`)

Dark-lensed rectangular sunglasses.

```xml
<g id="acc-sunglasses">
  <!-- Left lens -->
  <rect x="178" y="198" width="64" height="44" rx="8"
        fill="#1A1A1A" stroke="#000" stroke-width="3"/>
  <!-- Right lens -->
  <rect x="278" y="198" width="64" height="44" rx="8"
        fill="#1A1A1A" stroke="#000" stroke-width="3"/>
  <!-- Bridge -->
  <path d="M 242 218 Q 256 210 278 218"
        fill="none" stroke="#1A1A1A" stroke-width="4"/>
  <!-- Left temple -->
  <path d="M 178 215 L 140 208"
        fill="none" stroke="#1A1A1A" stroke-width="3"/>
  <!-- Right temple -->
  <path d="M 342 215 L 380 208"
        fill="none" stroke="#1A1A1A" stroke-width="3"/>
</g>
```

### 3.3 Monocle (`monocle`)

A single eyepiece with chain, worn on the right eye.

```xml
<g id="acc-monocle">
  <!-- Monocle rim -->
  <circle cx="310" cy="220" r="34"
          fill="none" stroke="#B8860B" stroke-width="4"/>
  <!-- Chain -->
  <path d="M 310 254 Q 320 320 300 400"
        fill="none" stroke="#B8860B" stroke-width="2" stroke-dasharray="4 3"/>
</g>
```

### 3.4 Pipe (`pipe`)

A smoking pipe held at the side.

```xml
<g id="acc-pipe">
  <!-- Pipe stem -->
  <path d="M 370 280 Q 400 260 410 230"
        fill="none" stroke="#5C4033" stroke-width="6"/>
  <!-- Pipe bowl -->
  <path d="M 400 240 Q 415 220 410 200 Q 425 195 425 215 Q 425 240 410 245 Z"
        fill="#5C4033" stroke="#000" stroke-width="2"/>
  <!-- Smoke puffs -->
  <circle cx="420" cy="185" r="8" fill="#CCCCCC" opacity="0.4"/>
  <circle cx="430" cy="170" r="6" fill="#CCCCCC" opacity="0.3"/>
  <circle cx="418" cy="160" r="5" fill="#CCCCCC" opacity="0.2"/>
</g>
```

---

## 4. Classic Style Position Offsets

The classic body center is at `cy=265` (vs borderball `cy=256`), giving a **+9px vertical offset**. Apply these adjustments when using accessories on classic-style countryballs:

| Accessory Category | Borderball Position | Classic Offset |
|--------------------|---------------------|----------------|
| Hats (top) | Based on `cy=256` | Move down **+9px** |
| Glasses / Monocle | Eye area ~`cy=220` | Move down **+9px** to `~cy=229` |
| Bow tie / Scarf | Bottom ~`cy=420` | Move down **+9px** to `~cy=429` |
| Pipe | Side ~`cy=280` | Move down **+9px** to `~cy=289` |

Apply the offset using a `transform` on the accessory group:

```xml
<g id="acc-top-hat" transform="translate(0, 9)">
  <!-- ... hat SVG ... -->
</g>
```

---

## 5. Styling Rules

1. **Flat colors only.** No gradients, radial shading, or drop shadows on accessories.
2. **Black stroke.** All accessory shapes use `stroke="#000"` with `stroke-width="2"` to `"5"` depending on size.
3. **Simple shapes.** Use basic SVG elements (`rect`, `circle`, `ellipse`, `path`). No filters or effects.
4. **Consistent scale.** Accessories should be proportional to the 512x512 canvas and the ~400px diameter body.
5. **No fill on lenses.** Glasses lenses use `fill="none"` (transparent). Sunglasses use `fill="#1A1A1A"` (opaque dark).

---

## 6. Combination Guidelines

### Recommended Combinations

- **Top hat + Monocle**: Classic British gentleman look
- **Beret + Pipe**: French intellectual aesthetic
- **Military cap + Sunglasses**: Authoritative military style
- **Crown + Scarf**: Royal winter attire
- **Ushanka + Scarf**: Cold weather ensemble

### Limits

- **Maximum 3 accessories** per countryball. More than 3 creates visual clutter.
- **Maximum 1 hat** at a time. Do not stack hats.
- **Maximum 1 eyewear** at a time. No glasses + monocle combinations.

### Prohibited

- **Accessories that cover the flag**: No full-body coats, capes, or wraps that obscure the flag pattern.
- **Limb-like accessories**: No arms, legs, hands, or holding-pose items. Accessories must be wearable.
- **Accessories with gradients or shadows**: Keep the flat countryball aesthetic.

---

## 7. Animation Behavior

When a countryball has animations:

- **Body animations** (bounce, hop, wobble): Accessories inside `<g class="animated-body">` move with the body automatically. No extra CSS needed.
- **Eye animations** (blink): Only affect `#layer-eyes`. Front-layer accessories (glasses, monocle) remain static while eyes animate behind them, creating a natural effect.

```xml
<g class="animated-body">
  <g id="layer-flag" clip-path="url(#body-clip)">...</g>
  <g id="layer-outline">...</g>
  <g id="layer-accessories-back">...</g>
  <g id="layer-eyes" class="animated-eyes">...</g>
  <g id="layer-accessories-front">...</g>
</g>
```
