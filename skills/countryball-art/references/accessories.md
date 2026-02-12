# Countryball Accessories

This document defines the accessory system for countryball SVGs. Accessories are created as **standalone SVGs** with their own visual feedback loop, then embedded into the final countryball.

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

## 2. Standalone Accessory Creation Workflow

**NEVER draw accessories directly onto the countryball.** Each accessory must be created and verified independently before being embedded.

### Step 1: Search for Reference Images

Before drawing ANY accessory, **search the internet** for real-world reference images:

```
WebSearch: "{accessory name}" OR "{accessory name} illustration flat"
```

If the user provides a reference image, use that instead. Study the reference carefully:
- Overall shape and silhouette
- Key structural details (e.g., ushanka has distinct fur brim + ear flaps that fold down)
- Proportions between parts (e.g., top hat crown height vs brim width)
- Characteristic features that make it recognizable

### Step 2: Create Standalone Accessory SVG

Use the accessory template at `templates/accessory-base.svg`. Save to:

```
.countryball/<name>/accessories/<accessory-id>.svg
```

The template includes:
- **Ghost body guide**: A dashed gray circle (cx=256, cy=256, r=200) showing where the countryball body will be. Use this for positioning.
- **Ghost eye guides**: Dashed arches showing default eye positions. Use for eyewear alignment.
- **Accessory group**: `<g id="acc-{id}">` — draw your accessory inside this group.

Metadata on the standalone SVG root:
- `data-accessory-id="{id}"` — the accessory ID
- `data-accessory-layer="back|front"` — which layer it belongs to

### Step 3: Visual Feedback Loop (max 5 iterations)

```
for each iteration:
  a. Render: node ${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/scripts/render.mjs .countryball/<name>/accessories/<id>.svg --size=512
  b. Read the PNG to visually inspect
  c. Compare with reference image:
     - Does the silhouette match the real object?
     - Are proportions correct? (not too flat, not too stretched)
     - Are characteristic details present?
     - Is positioning correct relative to the ghost body?
     - Does it follow the flat-color countryball aesthetic?
  d. If issues found → Edit and go to (a)
  e. If good → proceed to next accessory or embedding
```

### Step 4: Embed into Countryball

Once all accessories pass quality checks:

1. Read each standalone accessory SVG
2. Extract the `<g id="acc-{id}">` group (WITHOUT ghost guides)
3. Insert into the countryball SVG:
   - Back-layer accessories → inside `<g id="layer-accessories-back">`
   - Front-layer accessories → inside `<g id="layer-accessories-front">`
4. Add `data-accessories="id1,id2"` to the root `<svg>`
5. Render final result and verify the combined look

---

## 3. Accessory Catalog

Each entry describes the accessory. **Do NOT use hardcoded SVG code.** Always search for a reference image and draw from scratch.

### Back Layer (behind eyes)

| ID | Name | Layer | Description | Key Features to Reference |
|----|------|-------|-------------|---------------------------|
| `top-hat` | Top Hat | back | Tall formal hat | Tall cylindrical crown, wide flat brim, ribbon band. Sits on top of body. |
| `beret` | Beret | back | Flat round cap | Soft, round, slightly drooping to one side. Small stem/tab on top center. |
| `ushanka` | Ushanka | back | Russian fur hat | Thick fur brim, rounded crown, ear flaps that hang down on both sides. |
| `fez` | Fez | back | Ottoman tassel hat | Truncated cone shape (flat top, wider bottom), tassel hanging from top. Red color. |
| `military-cap` | Military Cap | back | Peaked military cap | Structured crown, stiff front brim/visor, badge/emblem on front. |
| `crown` | Crown | back | Royal crown | Gold band base, pointed peaks rising from base, jewels inset into band. |
| `bow-tie` | Bow Tie | back | Neck bow tie | Two symmetric triangular wings, small round knot in center. Sits at body bottom. |
| `scarf` | Scarf | back | Knitted scarf | Wraps around lower body, one tail hanging down. Visible knit texture or stripes. |

### Front Layer (in front of eyes)

| ID | Name | Layer | Description | Key Features to Reference |
|----|------|-------|-------------|---------------------------|
| `glasses` | Glasses | front | Round eyeglasses | Two circular frames connected by nose bridge, temples extending to sides. Transparent lenses (`fill="none"`). |
| `sunglasses` | Sunglasses | front | Dark sunglasses | Rectangular or aviator frames, opaque dark lenses (`fill="#1A1A1A"`), nose bridge, temples. |
| `monocle` | Monocle | front | Single eyepiece | One circular lens (right eye), thin gold frame, chain hanging down. |
| `pipe` | Pipe | front | Smoking pipe | Curved stem, bowl at the end. Positioned at the side of the body. Optional smoke wisps. |

---

## 4. Positioning Guide

All positions are based on **borderball** (body: `cx=256, cy=256, r=200`).

| Category | Vertical Zone | Notes |
|----------|---------------|-------|
| Hats | Top of body, `cy ≈ 60-100` | Should sit on or slightly above the body circle |
| Eyewear | Eye level, `cy ≈ 200-240` | Must align with the ghost eye guides |
| Bow tie | Bottom of body, `cy ≈ 410-440` | Centered horizontally |
| Scarf | Lower body, `cy ≈ 370-410` | Wraps around the body curve |
| Pipe | Side of body, `cx ≈ 370-430` | Extends from the body edge |

### Classic Style Offset

Classic body center is at `cy=265` (+9px from borderball). Apply offset via transform:

```xml
<g id="acc-top-hat" transform="translate(0, 9)">
  <!-- ... -->
</g>
```

---

## 5. Styling Rules

1. **Flat colors only.** No gradients, radial shading, or drop shadows.
2. **Black stroke.** `stroke="#000"` with `stroke-width="2"` to `"5"` depending on element size.
3. **Simple shapes.** Basic SVG elements (`rect`, `circle`, `ellipse`, `path`). No filters or effects.
4. **Proportional to body.** Accessories should look natural on a ~400px diameter body on a 512x512 canvas.
5. **Recognizable silhouette.** The accessory should be instantly identifiable even at small sizes.
6. **No fill on transparent lenses.** Glasses use `fill="none"`. Sunglasses use opaque dark fill.

---

## 6. Combination Guidelines

### Recommended Combinations

- **Top hat + Monocle**: Classic British gentleman
- **Beret + Pipe**: French intellectual
- **Military cap + Sunglasses**: Authoritative military
- **Crown + Scarf**: Royal winter attire
- **Ushanka + Scarf**: Cold weather ensemble

### Limits

- **Maximum 3 accessories** per countryball.
- **Maximum 1 hat** at a time.
- **Maximum 1 eyewear** at a time.

### Prohibited

- **Accessories that cover the flag**: No full-body coats, capes, or wraps that obscure the flag.
- **Limb-like accessories**: No arms, legs, hands, or holding-pose items.
- **Accessories with gradients or shadows**: Keep the flat countryball aesthetic.

---

## 7. Animation Behavior

- **Body animations** (bounce, hop, wobble): Accessories inside `<g class="animated-body">` move with the body automatically.
- **Eye animations** (blink): Only affect `#layer-eyes`. Front-layer accessories stay static while eyes animate behind them.

```xml
<g class="animated-body">
  <g id="layer-flag" clip-path="url(#body-clip)">...</g>
  <g id="layer-outline">...</g>
  <g id="layer-accessories-back">...</g>
  <g id="layer-eyes" class="animated-eyes">...</g>
  <g id="layer-accessories-front">...</g>
</g>
```

---

## 8. Directory Structure Example

```
.countryball/uk-gentleman/
  accessories/
    top-hat.svg          ← Standalone accessory (with ghost guides)
    top-hat.png          ← Rendered preview
    monocle.svg          ← Standalone accessory
    monocle.png          ← Rendered preview
  static.svg             ← Final countryball with embedded accessories
  static.png             ← Final rendered output
```
