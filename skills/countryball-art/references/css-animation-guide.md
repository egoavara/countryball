# CSS Animation Guide for Countryball SVGs

This document explains how to write CSS animations for countryball SVGs that will be rendered into animated GIFs.

---

## 1. How Animations Work in This System

The animation pipeline follows these steps:

1. **Author CSS**: Write `@keyframes` rules inside an SVG `<style>` block.
2. **Parse**: Our custom CSS parser extracts the keyframes and animation properties.
3. **Generate frames**: The parser computes interpolated property values for each frame at the target FPS.
4. **Render**: `resvg` renders each static frame as a PNG image.
5. **Assemble**: The individual frames are assembled into an animated GIF.

Because of this pipeline, animations must be expressible as discrete static frames. Continuous browser-level rendering features that cannot be decomposed into per-frame property values are not supported.

---

## 2. Supported CSS Properties for Animation

### Transform Functions

The `transform` property is the most versatile tool for animation:

| Function | Example | Notes |
|----------|---------|-------|
| `translate(x, y)` | `translate(0, -20px)` | Move element. Use px units. |
| `translateX(x)` | `translateX(10px)` | Horizontal movement only. |
| `translateY(y)` | `translateY(-20px)` | Vertical movement only. |
| `scale(s)` | `scale(1.1)` | Uniform scale. |
| `scale(sx, sy)` | `scale(1.0, 0.9)` | Non-uniform scale (squash/stretch). |
| `rotate(angle)` | `rotate(5deg)` | Rotation. Use deg units. |

### Opacity

```css
opacity: 0;    /* fully transparent */
opacity: 0.5;  /* half transparent */
opacity: 1;    /* fully opaque */
```

### SVG-Specific Attributes

These SVG presentation attributes can be animated:

| Attribute | Applies to | Example |
|-----------|-----------|---------|
| `cx` | `<circle>`, `<ellipse>` | `cx: 260;` |
| `cy` | `<circle>`, `<ellipse>` | `cy: 250;` |
| `r` | `<circle>` | `r: 210;` |
| `rx` | `<ellipse>` | `rx: 18;` |
| `ry` | `<ellipse>` | `ry: 25;` |

### Path Data (`d` property)

The `d` property (SVG path data) can be animated **only** when the source and target paths have the same command structure (same number and types of commands). The numeric values are interpolated between keyframes.

```css
@keyframes morph-eye {
  0%   { d: path("M 220 230 A 28 28 0 0 1 276 230 Z"); }
  100% { d: path("M 220 245 A 28 14 0 0 1 276 245 Z"); }
}
```

---

## 3. Supported Timing Functions

| Function | Description |
|----------|-------------|
| `linear` | Constant speed throughout. |
| `ease` | Slow start, fast middle, slow end. |
| `ease-in` | Slow start, accelerating. |
| `ease-out` | Fast start, decelerating. |
| `ease-in-out` | Slow start and end, fast middle. Best for natural motion. |

Specify the timing function in the `animation` shorthand or via `animation-timing-function`:

```css
animation: bounce 2s ease-in-out infinite;
/* or */
animation-timing-function: ease-in-out;
```

---

## 4. Writing Animation CSS

### Basic Structure

Place the `<style>` block inside the SVG `<defs>` section:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
     data-style="borderball" data-country="PL"
     data-animation-duration="2" data-animation-fps="12">
  <defs>
    <style>
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      #layer-flag, #layer-eyes, #layer-outline {
        animation: bounce 2s ease-in-out infinite;
      }
    </style>
    <clipPath id="body-clip">
      <circle cx="256" cy="256" r="200"/>
    </clipPath>
  </defs>
  <!-- layers... -->
</svg>
```

### Bounce Animation

A simple up-and-down hop:

```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

#layer-flag, #layer-eyes, #layer-outline {
  animation: bounce 2s ease-in-out infinite;
}
```

### Squash and Stretch

A bouncy deformation effect:

```css
@keyframes squash-stretch {
  0%, 100% {
    transform: scaleX(1) scaleY(1) translateY(0);
  }
  25% {
    transform: scaleX(0.95) scaleY(1.05) translateY(-15px);
  }
  50% {
    transform: scaleX(1.05) scaleY(0.95) translateY(0);
  }
  75% {
    transform: scaleX(0.98) scaleY(1.02) translateY(-5px);
  }
}

#layer-flag, #layer-eyes, #layer-outline {
  transform-origin: 256px 380px;
  animation: squash-stretch 1.5s ease-in-out infinite;
}
```

### Wobble

A side-to-side tilting motion:

```css
@keyframes wobble {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  75% { transform: rotate(-5deg); }
}

#layer-flag, #layer-eyes, #layer-outline {
  transform-origin: 256px 256px;
  animation: wobble 2s ease-in-out infinite;
}
```

### Blink

An eye-blink animation that animates the eye shapes:

```css
@keyframes blink {
  0%, 40%, 60%, 100% { ry: 25; }
  50% { ry: 2; }
}

#layer-eyes ellipse {
  animation: blink 3s ease-in-out infinite;
}
```

For arch eyes (borderball), morph the path data:

```css
@keyframes blink-arch {
  0%, 40%, 60%, 100% {
    d: path("M 220 230 A 28 28 0 0 1 276 230 Z");
  }
  50% {
    d: path("M 220 230 A 28 3 0 0 1 276 230 Z");
  }
}

#layer-eyes path:first-child {
  animation: blink-arch 3s ease-in-out infinite;
}
```

### Hop (Jump with Landing)

A hop that includes a squash on landing:

```css
@keyframes hop {
  0%, 100% {
    transform: translateY(0) scaleX(1) scaleY(1);
  }
  20% {
    transform: translateY(0) scaleX(1.08) scaleY(0.92);
  }
  40% {
    transform: translateY(-40px) scaleX(0.95) scaleY(1.05);
  }
  60% {
    transform: translateY(-40px) scaleX(0.95) scaleY(1.05);
  }
  80% {
    transform: translateY(0) scaleX(1.08) scaleY(0.92);
  }
}

#layer-flag, #layer-eyes, #layer-outline {
  transform-origin: 256px 400px;
  animation: hop 1.5s ease-in-out infinite;
}
```

### Idle Bounce

A subtle, slow breathing/idle motion:

```css
@keyframes idle-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

#layer-flag, #layer-eyes, #layer-outline {
  animation: idle-bounce 3s ease-in-out infinite;
}
```

---

## 5. Best Practices

### Coordinate All Layers

Apply the **same animation** to all visible layers so the ball moves as one unit:

```css
#layer-flag, #layer-eyes, #layer-outline {
  animation: bounce 2s ease-in-out infinite;
}
```

If layers animate independently, the ball will appear to fall apart.

### Use `transform-origin` for Rotation and Scale

When rotating or scaling, set the pivot point explicitly:

```css
#layer-flag, #layer-eyes, #layer-outline {
  transform-origin: 256px 256px; /* center of canvas */
  animation: wobble 2s ease-in-out infinite;
}
```

For bouncing/squashing, place the origin at the "ground" level:

```css
transform-origin: 256px 400px; /* bottom of ball */
```

### Duration Guidelines

| Animation Type | Recommended Duration |
|----------------|---------------------|
| Idle/breathing | 3-4 seconds |
| Bounce/hop | 1.5-2 seconds |
| Wobble | 2-3 seconds |
| Blink | 3-4 seconds |
| Quick reaction | 1-1.5 seconds |

Keep durations between **1 and 4 seconds**. Anything shorter looks frantic; anything longer feels sluggish.

### Use `ease-in-out` for Natural Motion

`ease-in-out` produces the most natural-looking movement for most countryball animations. Use `linear` only for continuous rotation or sliding.

### Test with Low Frame Count First

When developing, use low settings to iterate quickly:

```bash
--fps=4 --frames=8
```

Once the animation looks right, increase to production quality:

```bash
--fps=12 --frames=24
```

---

## 6. Available Animation Presets

The following preset names can be referenced in SVG metadata or used as base keyframe names:

| Preset | Description | Duration | Best For |
|--------|-------------|----------|----------|
| `idle-bounce` | Subtle up-and-down | 3s | Default idle state |
| `blink` | Eye close-and-open | 3s | Idle with personality |
| `squash-stretch` | Bouncy deformation | 1.5s | Energetic characters |
| `hop` | Jump with squash landing | 1.5s | Excited reaction |
| `wobble` | Side-to-side tilt | 2s | Uncertainty, shyness |

### Combining Presets

You can combine animations by applying different presets to different layers or by composing keyframes:

```css
/* Body bounces while eyes blink independently */
@keyframes idle-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes blink {
  0%, 45%, 55%, 100% { ry: 25; }
  50% { ry: 2; }
}

#layer-flag, #layer-outline {
  animation: idle-bounce 3s ease-in-out infinite;
}

#layer-eyes {
  animation: idle-bounce 3s ease-in-out infinite;
}

#layer-eyes ellipse {
  animation: blink 4s ease-in-out infinite;
}
```

Note: When combining, the body layers (`layer-flag`, `layer-outline`) and the `layer-eyes` group must still share the movement animation so the ball stays together. Only child elements within `layer-eyes` (the actual eye shapes) should have independent animations like blinking.

---

## 7. SVG Metadata for Animation

Add these attributes to the root `<svg>` element to declare animation intent:

| Attribute | Type | Description |
|-----------|------|-------------|
| `data-animation-duration` | Number (seconds) | Total duration of one animation cycle. E.g., `"2"` for 2 seconds. |
| `data-animation-fps` | Number | Preferred frames per second. E.g., `"12"` for 12 FPS. |

### Example

```xml
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 512 512" width="512" height="512"
     data-style="borderball"
     data-country="PL"
     data-animation-duration="2"
     data-animation-fps="12">
```

The total number of frames generated will be `duration * fps`. For example, 2 seconds at 12 FPS = 24 frames.

---

## 8. Limitations

- **No `cubic-bezier()` custom timing functions.** Only the five named functions are supported.
- **No `animation-delay`.** All animations start at frame 0.
- **No `animation-direction: alternate`.** Use explicit keyframe percentages to achieve ping-pong effects.
- **No CSS variables** (`var(--name)`). Use literal values only.
- **No `calc()` expressions.** Pre-compute all values.
- **Path `d` interpolation** requires identical command structure between keyframes.
