---
name: countryball
description: "Create a new countryball character with AI visual feedback loop"
arguments: "[country] [--style=borderball|classic]"
---

# Countryball Creation Workflow

Create a new countryball character. This command starts an interactive design session.

## Usage

`/countryball [country] [--style=borderball|classic]`

Examples:
- `/countryball` - Start interactive design
- `/countryball poland` - Create Poland countryball
- `/countryball germany --style=classic` - Create classic-style Germany

## Instructions

1. If country is provided in arguments, use it. Otherwise, ask the user which country they want.
2. If style is provided, use it. Otherwise, show reference images and let user choose:
   - Read `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/references/03_borderball_poland.png` (borderball example)
   - Read `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/references/01_polandball_classic.png` (classic example)
3. Ask about expression preference (happy, neutral, etc.)
4. Read the SKILL.md for full workflow: `${CLAUDE_PLUGIN_ROOT}/skills/countryball-art/SKILL.md`
5. Follow the complete workflow defined in the countryball-creator agent
6. Use the AI visual feedback loop to ensure quality
7. Present final results to the user
