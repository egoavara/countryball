import { Resvg } from '@resvg/resvg-js';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

/**
 * Render an SVG file to a PNG file on disk.
 * @param {string} svgPath - Absolute or CWD-relative path to the SVG file.
 * @param {string} outputPath - Absolute or CWD-relative path for the output PNG.
 * @param {object} options
 * @param {number} [options.width=512] - Target width in pixels.
 * @returns {{ width: number, height: number, size: number }}
 */
export async function renderSvgToPng(svgPath, outputPath, options = {}) {
  const { width = 512 } = options;
  const svgData = await readFile(svgPath, 'utf-8');

  const resvg = new Resvg(svgData, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: false },
    logLevel: 'off',
  });

  const rendered = resvg.render();
  const pngBuffer = rendered.asPng();

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, pngBuffer);

  return {
    width: rendered.width,
    height: rendered.height,
    size: pngBuffer.length,
  };
}

/**
 * Render an SVG string directly to a PNG buffer (no disk I/O for output).
 * @param {string} svgString - Raw SVG markup.
 * @param {object} options
 * @param {number} [options.width=512] - Target width in pixels.
 * @returns {Buffer} PNG image buffer.
 */
export async function renderSvgBufferToPng(svgString, options = {}) {
  const { width = 512 } = options;

  const resvg = new Resvg(svgString, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: false },
    logLevel: 'off',
  });

  const rendered = resvg.render();
  return rendered.asPng();
}
