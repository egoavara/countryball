#!/usr/bin/env node

/**
 * CLI: Extract static PNG frames from an animated SVG.
 *
 * Usage: node extract-frames.mjs <animated.svg> [--fps=8] [--frames=16] [--output-dir=frames/]
 *
 * - Extracts frames from animated SVG using CSS keyframe interpolation.
 * - Renders each frame to PNG and saves to the output directory.
 * - Default output directory: "frames/" next to the input SVG.
 */

import { resolve, dirname, join, basename } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { generateFrames } from './lib/css-frame-generator.mjs';
import { renderSvgBufferToPng } from './lib/renderer.mjs';

function parseArgs(argv) {
  const args = { input: null, fps: 8, frames: null, outputDir: null };

  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--fps=')) {
      args.fps = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--frames=')) {
      args.frames = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--output-dir=')) {
      args.outputDir = arg.split('=')[1];
    } else if (!arg.startsWith('-')) {
      args.input = arg;
    }
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.input) {
    console.error('Usage: node extract-frames.mjs <animated.svg> [--fps=8] [--frames=16] [--output-dir=frames/]');
    process.exit(1);
  }

  const inputPath = resolve(process.cwd(), args.input);

  let outputDir;
  if (args.outputDir) {
    outputDir = resolve(process.cwd(), args.outputDir);
  } else {
    outputDir = join(dirname(inputPath), 'frames');
  }

  try {
    const svgString = await readFile(inputPath, 'utf-8');

    const frameOptions = { fps: args.fps };
    if (args.frames) {
      frameOptions.frameCount = args.frames;
    }

    const frameSvgs = generateFrames(svgString, frameOptions);

    await mkdir(outputDir, { recursive: true });

    const svgBaseName = basename(inputPath, '.svg');
    const results = [];

    for (let i = 0; i < frameSvgs.length; i++) {
      const frameName = `${svgBaseName}_frame_${String(i).padStart(4, '0')}.png`;
      const framePath = join(outputDir, frameName);
      const pngBuffer = await renderSvgBufferToPng(frameSvgs[i], { width: 512 });
      await writeFile(framePath, pngBuffer);
      results.push({ frame: i, file: framePath, size: pngBuffer.length });
    }

    const report = {
      input: inputPath,
      outputDir,
      fps: args.fps,
      totalFrames: frameSvgs.length,
      frames: results,
    };

    console.log(JSON.stringify(report, null, 2));
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }, null, 2));
    process.exit(1);
  }
}

main();
