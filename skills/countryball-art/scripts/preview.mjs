#!/usr/bin/env node

/**
 * CLI: Generate a GIF preview from an animated SVG.
 *
 * Usage: node preview.mjs <animated.svg> [--fps=8] [--size=256] [--output=preview.gif]
 *
 * - Extracts frames from the animated SVG, renders each to PNG, then encodes as GIF.
 * - Default output: "<input-name>.gif" next to the input SVG.
 */

import { resolve, dirname, join, basename } from 'path';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { generateFrames } from './lib/css-frame-generator.mjs';
import { renderSvgBufferToPng } from './lib/renderer.mjs';
import { generateGif } from './lib/preview-engine.mjs';

function parseArgs(argv) {
  const args = { input: null, fps: 8, size: 256, output: null };

  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--fps=')) {
      args.fps = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--size=')) {
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
    console.error('Usage: node preview.mjs <animated.svg> [--fps=8] [--size=256] [--output=preview.gif]');
    process.exit(1);
  }

  const inputPath = resolve(process.cwd(), args.input);

  let outputPath;
  if (args.output) {
    outputPath = resolve(process.cwd(), args.output);
  } else {
    const dir = dirname(inputPath);
    const name = basename(inputPath, '.svg');
    outputPath = join(dir, `${name}.gif`);
  }

  try {
    const svgString = await readFile(inputPath, 'utf-8');

    // Extract frames from animated SVG
    const frameSvgs = generateFrames(svgString, { fps: args.fps });

    // Render each frame to PNG buffer
    const framePngBuffers = [];
    for (const frameSvg of frameSvgs) {
      const pngBuf = await renderSvgBufferToPng(frameSvg, { width: args.size });
      framePngBuffers.push(pngBuf);
    }

    // Encode as GIF
    const gifBuffer = await generateGif(framePngBuffers, {
      fps: args.fps,
      width: args.size,
    });

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, gifBuffer);

    const report = {
      input: inputPath,
      output: outputPath,
      fps: args.fps,
      size: args.size,
      totalFrames: frameSvgs.length,
      gifSize: gifBuffer.length,
    };

    console.log(JSON.stringify(report, null, 2));
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }, null, 2));
    process.exit(1);
  }
}

main();
