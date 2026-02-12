---
name: render
description: "Render a countryball SVG to PNG"
arguments: "<svg-path> [--size=512]"
---

# Render SVG to PNG

Render a countryball SVG file to PNG using resvg.

## Usage

`/render <svg-path> [--size=512]`

## Instructions

1. Run the render script:
   ```bash
   node ${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/scripts/render.mjs $ARGUMENTS
   ```
2. Show the rendered PNG to the user using the Read tool
3. Report the output file path and dimensions
