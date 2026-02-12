# Countryball Eye Styles

This document provides detailed SVG code and guidance for drawing countryball eyes. All eye styles share one critical rule: **NO PUPILS**. The inside of every eye is always pure white (`#FFFFFF`).

---

## 1. Borderball Arch Eyes (Default for Borderball Style)

The standard eye for borderball countryballs. Shaped like a half-dome opening downward -- flat edge on top, curved part below. Looks like an upside-down U.

### SVG Code

```xml
<!-- Left eye -->
<path d="M 220 230 A 28 28 0 0 1 276 230 Z"
      fill="#FFF" stroke="#000" stroke-width="4"/>

<!-- Right eye -->
<path d="M 280 230 A 28 28 0 0 1 336 230 Z"
      fill="#FFF" stroke="#000" stroke-width="4"/>
```

### How the Arc Works

- `M {x1} {y}` -- Move to the left edge of the eye at the flat top.
- `A {rx} {ry} 0 0 1 {x2} {y}` -- Draw an arc from (x1, y) curving **downward** to (x2, y).
  - `rx` and `ry`: radius of the arc (controls height and width of the dome).
  - `0 0 1`: x-rotation=0, large-arc-flag=0, sweep-flag=1 (curves downward).
- `Z` -- Close the path back to the start, creating the flat top edge.

### Dimensions

- Width: **50-56px** (distance from x1 to x2).
- Height: **25-28px** (controlled by the arc radius).
- Spacing: Two eyes centered horizontally, spaced approximately **60-80px** apart (gap between right edge of left eye and left edge of right eye).

---

## 2. Classic Oval Eyes (Default for Classic Style)

Vertical oval ellipses giving a wide-eyed, slightly surprised look.

### SVG Code

```xml
<!-- Left eye -->
<ellipse cx="230" cy="245" rx="18" ry="25"
         fill="#FFF" stroke="#000" stroke-width="4"/>

<!-- Right eye -->
<ellipse cx="300" cy="245" rx="18" ry="25"
         fill="#FFF" stroke="#000" stroke-width="4"/>
```

### Dimensions

- Each eye: approximately **36px wide** (`rx="18"`) and **50px tall** (`ry="25"`).
- Spacing: centers approximately **70-80px** apart horizontally.
- Vertical position: roughly 35-40% from the top of the body.

---

## 3. Squinting Eyes

Narrowed eyes conveying suspicion, smugness, or drowsiness. Works with both styles.

### Arch Squint (Borderball)

Reduce the arc height to create a narrow slit.

```xml
<!-- Left eye -->
<path d="M 220 235 A 28 14 0 0 1 276 235 Z"
      fill="#FFF" stroke="#000" stroke-width="4"/>

<!-- Right eye -->
<path d="M 280 235 A 28 14 0 0 1 336 235 Z"
      fill="#FFF" stroke="#000" stroke-width="4"/>
```

The `ry` value is reduced from 28 to **14**, making the dome much flatter.

### Oval Squint (Classic)

Reduce the vertical radius significantly.

```xml
<!-- Left eye -->
<ellipse cx="230" cy="245" rx="20" ry="10"
         fill="#FFF" stroke="#000" stroke-width="4"/>

<!-- Right eye -->
<ellipse cx="300" cy="245" rx="20" ry="10"
         fill="#FFF" stroke="#000" stroke-width="4"/>
```

---

## 4. Happy Eyes

Arches flipped so the curved part faces **upward**, like a smile shape. Conveys joy or contentment.

### SVG Code

```xml
<!-- Left eye -->
<path d="M 220 245 A 28 28 0 0 0 276 245 Z"
      fill="#FFF" stroke="#000" stroke-width="4"/>

<!-- Right eye -->
<path d="M 280 245 A 28 28 0 0 0 336 245 Z"
      fill="#FFF" stroke="#000" stroke-width="4"/>
```

### Key Difference from Default Arch

- The sweep-flag changes from `1` to `0`: `A {rx} {ry} 0 0 0 {x2} {y}`.
- This flips the arc direction so the dome curves **upward** instead of downward.
- The flat edge is now on the **bottom** and the curve is on **top**.

---

## 5. Sad Eyes

Slightly drooping arches that angle downward at the outer edges. Conveys sadness or disappointment.

### SVG Code

```xml
<!-- Left eye (outer edge droops down) -->
<path d="M 220 233 A 28 24 0 0 1 276 240 Z"
      fill="#FFF" stroke="#000" stroke-width="4"/>

<!-- Right eye (outer edge droops down, mirrored) -->
<path d="M 280 240 A 28 24 0 0 1 336 233 Z"
      fill="#FFF" stroke="#000" stroke-width="4"/>
```

### Optional Tear

Add a small blue ellipse below one eye to indicate crying.

```xml
<!-- Tear below left eye -->
<ellipse cx="248" cy="268" rx="4" ry="8"
         fill="#42A5F5" opacity="0.8"/>
```

---

## 6. Angry Eyes

Arches with an angled flat edge (tilted inward) plus eyebrow lines for emphasis.

### SVG Code

```xml
<!-- Left eye (tilted: inner corner higher) -->
<path d="M 220 238 A 28 26 0 0 1 276 228 Z"
      fill="#FFF" stroke="#000" stroke-width="4"/>

<!-- Right eye (tilted: inner corner higher, mirrored) -->
<path d="M 280 228 A 28 26 0 0 1 336 238 Z"
      fill="#FFF" stroke="#000" stroke-width="4"/>
```

### Eyebrow Lines

Add angled lines above each eye, slanting inward to convey anger.

```xml
<!-- Left eyebrow (angled down toward center) -->
<line x1="215" y1="218" x2="278" y2="208"
      stroke="#000" stroke-width="5" stroke-linecap="round"/>

<!-- Right eyebrow (angled down toward center, mirrored) -->
<line x1="278" y1="208" x2="341" y2="218"
      stroke="#000" stroke-width="5" stroke-linecap="round"/>
```

---

## 7. Positioning Summary Table

| Eye Style | Typical cy (vertical center) | Notes |
|-----------|------------------------------|-------|
| Borderball arch | 230 (top of flat edge) | Dome hangs below this line |
| Classic oval | 245 (center of ellipse) | Centered vertically |
| Squint | 235-245 | Slightly lower to look "closed" |
| Happy | 245 | Dome curves up from this line |
| Sad | 233-240 (angled) | Outer edges droop |
| Angry | 228-238 (angled) | Inner edges raised |

---

## Critical Reminders

1. **NO PUPILS.** Never add black dots, circles, or any marks inside the eye. The fill is always `#FFFFFF`.
2. **NO IRISES.** No colored rings or shapes inside the eye.
3. **Consistent stroke.** All eyes use `stroke="#000" stroke-width="4"`.
4. **White fill.** All eyes use `fill="#FFF"` (or `fill="#FFFFFF"`).
5. **Always two eyes.** Countryballs always have exactly two eyes (unless a specific one-eyed design is requested).
6. **Eyes go in `layer-eyes`.** All eye elements must be inside `<g id="layer-eyes">`.
