---
name: countryball-art
description: "Countryball/Polandball SVG art generation with AI visual feedback loop, structural verification, CSS animation, and GIF preview. Triggers when users want to create, modify, or animate countryball characters."
triggers:
  - "countryball"
  - "polandball"
  - "country ball"
  - "borderball"
  - "국기공"
  - "폴란드공"
---

# Countryball Art Skill

## Overview

This skill enables creation of Countryball (Polandball) SVG art with an AI-powered visual feedback loop. The AI generates SVG, renders it to PNG, visually inspects the result, and iteratively improves until quality standards are met.

## Key Principles

1. **AI Visual Feedback Loop**: Generate SVG → Render PNG → AI inspects image → Fix issues → Repeat (max 5 iterations)
2. **Dual Verification**: AI vision (semantic check) + programmatic verification (structural check)
3. **Two Art Styles**: Borderball (clean, geometric) and Classic (organic, shaded)
4. **No Pupils**: Countryball eyes are ALWAYS pure white inside - never add black dots/circles for pupils
5. **No Shadows**: NEVER add ground shadows or drop shadows to countryballs
6. **All output goes to user's CWD**: `.countryball/<character-name>/` directory

## Available Scripts

All scripts are in `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/scripts/`:

### Render SVG to PNG
```bash
node ${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/scripts/render.mjs <input.svg> [--size=512] [--output=path.png]
```

### Verify SVG Structure
```bash
node ${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/scripts/verify.mjs <input.svg>
```

### Extract Animation Frames
```bash
node ${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/scripts/extract-frames.mjs <animated.svg> [--fps=8] [--frames=16]
```

### Generate GIF Preview
```bash
node ${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/scripts/preview.mjs <animated.svg> [--fps=8] [--size=256]
```

### Full Pipeline
```bash
node ${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/scripts/pipeline.mjs <input.svg> [--animated] [--fps=8]
```

## SVG Structure Requirements

Every countryball SVG MUST have:
- Root `<svg>` with `data-style="borderball|classic"` and `data-country="name"` attributes
- `<defs>` with `<clipPath id="body-clip">` containing the body shape
- `<g id="layer-flag" clip-path="url(#body-clip)">` - flag pattern clipped to body
- `<g id="layer-outline">` - body outline with black stroke
- `<g id="layer-eyes">` - eyes WITHOUT pupils

Optional accessory layers (when accessories are present):
- `<g id="layer-accessories-back">` - hats, scarves (between outline and eyes)
- `<g id="layer-accessories-front">` - glasses, monocle (after eyes)
- `data-accessories="id1,id2"` attribute on root `<svg>` element

## Accessory Creation Workflow

Accessories are **NOT** drawn directly onto the countryball. Each accessory is:
1. **Researched** — search the internet for real reference images
2. **Created standalone** — drawn in a separate SVG using `templates/accessory-base.svg` (with ghost body guide)
3. **Verified independently** — rendered and visually inspected in its own feedback loop
4. **Embedded** — the `<g id="acc-{id}">` group is extracted and inserted into the countryball SVG

See `references/accessories.md` for the full workflow and accessory catalog.

## Reference Materials

- Templates: `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/templates/`
- Reference images: `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/references/*.png`
- Art style guide: `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/references/art-style-guide.md`
- Eye styles: `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/references/eye-styles.md`
- Flag patterns: `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/references/flag-patterns.md`
- Accessories guide: `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/references/accessories.md`
- CSS animation guide: `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/references/css-animation-guide.md`
- Animation presets: `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/templates/animation-presets/`

## AI Visual Feedback Loop Protocol

When generating a countryball:

1. **Write SVG** to `.countryball/<name>/static.svg`
2. **Render**: `node ${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/scripts/render.mjs .countryball/<name>/static.svg --size=512`
3. **Inspect**: Use Read tool to view the rendered PNG at `.countryball/<name>/static.png`
4. **Visual Checklist**:
   - Are flag colors correct and in the right order/direction?
   - Are eyes the correct style (arch for borderball, oval for classic)?
   - Is there NO pupil (no black dot) in the eyes?
   - Is the body shape correct (circle for borderball, ellipse for classic)?
   - Is the outline consistent and the right thickness?
   - Are proportions balanced?
   - If accessories present: correct layer order (back before eyes, front after eyes)?
   - If accessories present: do they match `data-accessories` metadata?
5. **Fix and repeat** if issues found (max 5 iterations)
6. **Verify**: Run verify script for structural checks
7. **Present** to user with the rendered PNG

## Animation Workflow

1. Start from completed static SVG
2. Add CSS `@keyframes` in `<style>` block → save as `animated.svg`
3. Run preview script to generate GIF
4. Inspect GIF quality
5. Adjust animation parameters if needed
