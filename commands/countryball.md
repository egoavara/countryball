---
name: countryball
description: "Create a new countryball character with AI visual feedback loop"
arguments: "[country] [--style=borderball|classic] [--accessories=id1,id2]"
---

# Countryball Creation Workflow

Create a new countryball character. This command starts an interactive design session.

## Usage

`/countryball [country] [--style=borderball|classic] [--accessories=id1,id2]`

Examples:
- `/countryball` - Start interactive design
- `/countryball poland` - Create Poland countryball
- `/countryball germany --style=classic` - Create classic-style Germany
- `/countryball uk --accessories=top-hat,monocle` - UK with top hat and monocle
- `/countryball france --accessories=beret,pipe` - France with beret and pipe

## Instructions

1. If country is provided in arguments, use it. Otherwise, ask the user which country they want.
2. If style is provided, use it. Otherwise, show reference images and let user choose:
   - Read `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/references/03_borderball_poland.png` (borderball example)
   - Read `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/references/01_polandball_classic.png` (classic example)
3. Ask about expression preference (happy, neutral, etc.)
4. If accessories are requested via `--accessories` or interactively, each accessory will be:
   - Researched (internet image search for reference)
   - Created in a standalone SVG (with ghost body guide)
   - Verified independently through its own visual feedback loop
   - Embedded into the final countryball
5. Read the SKILL.md for full workflow: `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/SKILL.md`
6. Follow the complete workflow defined in the countryball-creator agent
7. Use the AI visual feedback loop to ensure quality
8. Present final results to the user
