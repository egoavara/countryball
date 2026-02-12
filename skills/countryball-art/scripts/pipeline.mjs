#!/usr/bin/env node

/**
 * CLI: Full countryball art pipeline.
 *
 * Usage: node pipeline.mjs <input.svg> [--animated] [--fps=8] [--size=512]
 *
 * Steps:
 *   1. Render static PNG
 *   2. Run verification
 *   3. (if --animated) Extract frames
 *   4. (if --animated) Generate GIF preview
 *
 * Prints a summary JSON report of all steps to stdout.
 */

import { resolve, dirname, join, basename } from 'path';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { renderSvgToPng, renderSvgBufferToPng } from './lib/renderer.mjs';
import { verifySvg } from './lib/verify-engine.mjs';
import { generateFrames } from './lib/css-frame-generator.mjs';
import { generateGif } from './lib/preview-engine.mjs';

function parseArgs(argv) {
  const args = { input: null, animated: false, fps: 8, size: 512 };

  for (const arg of argv.slice(2)) {
    if (arg === '--animated') {
      args.animated = true;
    } else if (arg.startsWith('--fps=')) {
      args.fps = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--size=')) {
      args.size = parseInt(arg.split('=')[1], 10);
    } else if (!arg.startsWith('-')) {
      args.input = arg;
    }
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.input) {
    console.error('Usage: node pipeline.mjs <input.svg> [--animated] [--fps=8] [--size=512]');
    process.exit(1);
  }

  const inputPath = resolve(process.cwd(), args.input);
  const dir = dirname(inputPath);
  const name = basename(inputPath, '.svg');

  const summary = {
    input: inputPath,
    steps: {},
    overall: 'success',
  };

  try {
    // -----------------------------------------------------------------------
    // Step 1: Render static PNG
    // -----------------------------------------------------------------------
    const pngOutput = join(dir, `${name}.png`);
    try {
      const renderResult = await renderSvgToPng(inputPath, pngOutput, { width: args.size });
      summary.steps.render = {
        status: 'success',
        output: pngOutput,
        width: renderResult.width,
        height: renderResult.height,
        size: renderResult.size,
      };
    } catch (err) {
      summary.steps.render = { status: 'error', error: err.message };
      summary.overall = 'failed';
    }

    // -----------------------------------------------------------------------
    // Step 2: Run verification
    // -----------------------------------------------------------------------
    try {
      const verifyReport = await verifySvg(inputPath, { width: args.size });
      summary.steps.verify = {
        status: verifyReport.overall === 'pass' ? 'success' : 'warning',
        passed: verifyReport.passed,
        failed: verifyReport.failed,
        total: verifyReport.total,
        overall: verifyReport.overall,
        checks: verifyReport.checks,
      };
      if (verifyReport.overall !== 'pass') {
        summary.overall = 'warning';
      }
    } catch (err) {
      summary.steps.verify = { status: 'error', error: err.message };
      // Verification failure doesn't necessarily fail the whole pipeline
      if (summary.overall === 'success') summary.overall = 'warning';
    }

    // -----------------------------------------------------------------------
    // Step 3 & 4: Animation pipeline (if --animated)
    // -----------------------------------------------------------------------
    if (args.animated) {
      const svgString = await readFile(inputPath, 'utf-8');

      // Step 3: Extract frames
      let framePngBuffers = null;
      try {
        const frameSvgs = generateFrames(svgString, { fps: args.fps });
        framePngBuffers = [];

        const framesDir = join(dir, `${name}_frames`);
        await mkdir(framesDir, { recursive: true });

        for (let i = 0; i < frameSvgs.length; i++) {
          const pngBuf = await renderSvgBufferToPng(frameSvgs[i], { width: args.size });
          framePngBuffers.push(pngBuf);

          const framePath = join(framesDir, `frame_${String(i).padStart(4, '0')}.png`);
          await writeFile(framePath, pngBuf);
        }

        summary.steps.extractFrames = {
          status: 'success',
          outputDir: framesDir,
          totalFrames: frameSvgs.length,
          fps: args.fps,
        };
      } catch (err) {
        summary.steps.extractFrames = { status: 'error', error: err.message };
        summary.overall = 'failed';
      }

      // Step 4: Generate GIF preview
      if (framePngBuffers && framePngBuffers.length > 0) {
        try {
          const gifOutput = join(dir, `${name}.gif`);
          const gifSize = Math.min(args.size, 256); // GIF is smaller
          const gifBuffer = await generateGif(framePngBuffers, {
            fps: args.fps,
            width: gifSize,
          });
          await writeFile(gifOutput, gifBuffer);

          summary.steps.generateGif = {
            status: 'success',
            output: gifOutput,
            gifSize: gifBuffer.length,
            fps: args.fps,
            frameCount: framePngBuffers.length,
          };
        } catch (err) {
          summary.steps.generateGif = { status: 'error', error: err.message };
          summary.overall = 'failed';
        }
      } else {
        summary.steps.generateGif = { status: 'skipped', reason: 'No frames extracted' };
      }
    }

    console.log(JSON.stringify(summary, null, 2));

    // Exit code
    if (summary.overall === 'failed') {
      process.exit(1);
    }
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }, null, 2));
    process.exit(1);
  }
}

main();
