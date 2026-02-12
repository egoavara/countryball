#!/usr/bin/env node

/**
 * CLI: Render an SVG file to PNG.
 *
 * Usage: node render.mjs <input.svg> [--size=512] [--output=path]
 *
 * - Input path is resolved relative to the current working directory.
 * - If --output is not specified, the PNG is placed next to the SVG with a .png extension.
 */

import { resolve, basename, dirname, join } from 'path';
import { renderSvgToPng } from './lib/renderer.mjs';

function parseArgs(argv) {
  const args = { input: null, size: 512, output: null };

  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--size=')) {
      args.size = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--output=')) {
      args.output = arg.split('=')[1];
    } else if (!arg.startsWith('-')) {
      args.input = arg;
    }
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.input) {
    console.error('Usage: node render.mjs <input.svg> [--size=512] [--output=path]');
    process.exit(1);
  }

  const inputPath = resolve(process.cwd(), args.input);

  let outputPath;
  if (args.output) {
    outputPath = resolve(process.cwd(), args.output);
  } else {
    // Place PNG next to the SVG with .png extension
    const dir = dirname(inputPath);
    const name = basename(inputPath, '.svg');
    outputPath = join(dir, `${name}.png`);
  }

  try {
    const result = await renderSvgToPng(inputPath, outputPath, { width: args.size });
    const report = {
      input: inputPath,
      output: outputPath,
      width: result.width,
      height: result.height,
      size: result.size,
    };
    console.log(JSON.stringify(report, null, 2));
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }, null, 2));
    process.exit(1);
  }
}

main();
