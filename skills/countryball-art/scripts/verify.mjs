#!/usr/bin/env node

/**
 * CLI: Verify an SVG file (structural, render, and animation checks).
 *
 * Usage: node verify.mjs <input.svg> [--output=report.json]
 *
 * - Runs full verification and prints JSON report to stdout.
 * - Optionally writes the report to a file with --output.
 */

import { resolve } from 'path';
import { writeFile } from 'fs/promises';
import { verifySvg } from './lib/verify-engine.mjs';

function parseArgs(argv) {
  const args = { input: null, output: null };

  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--output=')) {
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
    console.error('Usage: node verify.mjs <input.svg> [--output=report.json]');
    process.exit(1);
  }

  const inputPath = resolve(process.cwd(), args.input);

  try {
    const report = await verifySvg(inputPath);
    const json = JSON.stringify(report, null, 2);

    console.log(json);

    if (args.output) {
      const outputPath = resolve(process.cwd(), args.output);
      await writeFile(outputPath, json, 'utf-8');
    }

    // Exit with non-zero if verification failed
    if (report.overall !== 'pass') {
      process.exit(2);
    }
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }, null, 2));
    process.exit(1);
  }
}

main();
