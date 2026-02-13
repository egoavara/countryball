---
description: "Verify countryball SVG structure and rendering"
---

# Verify Countryball SVG

Run structural and render verification on a countryball SVG.

## Usage

`/verify <svg-path>`

## Instructions

1. Run the verify script:
   ```bash
   node ${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/scripts/verify.mjs $ARGUMENTS
   ```
2. Parse the JSON output
3. Present results to the user:
   - List each check with pass/fail status
   - Highlight any failures with explanations
   - Suggest fixes for common issues
