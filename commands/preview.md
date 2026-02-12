---
name: preview
description: "Generate GIF preview from animated countryball SVG"
arguments: "<animated-svg-path> [--fps=8] [--size=256]"
---

# Generate Animation Preview

Create a GIF preview from an animated countryball SVG with CSS @keyframes.

## Usage

`/preview <animated-svg-path> [--fps=8] [--size=256]`

## Instructions

1. Run the preview script:
   ```bash
   node ${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/scripts/preview.mjs $ARGUMENTS
   ```
2. Show the generated GIF to the user using Read tool
3. Report frame count, duration, and file size
