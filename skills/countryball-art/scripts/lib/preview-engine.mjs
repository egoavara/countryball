/**
 * Generate GIF previews and filmstrip images from animation frame PNG buffers.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
const { GIFEncoder, quantize, applyPalette } = require('gifenc');

/**
 * Generate an animated GIF from an array of PNG frame buffers.
 *
 * @param {Buffer[]} framePngBuffers - Array of PNG image buffers (one per frame).
 * @param {object} [options]
 * @param {number} [options.fps=8] - Frames per second.
 * @param {number} [options.width=256] - Target width (GIFs are smaller than full PNGs).
 * @param {number} [options.loop=0] - Loop count (0 = infinite).
 * @returns {Promise<Buffer>} GIF file buffer.
 */
export async function generateGif(framePngBuffers, options = {}) {
  const { fps = 8, width = 256, loop = 0 } = options;

  if (framePngBuffers.length === 0) {
    throw new Error('No frames provided for GIF generation');
  }

  // Get dimensions from first frame after resize
  const firstMeta = await sharp(framePngBuffers[0]).resize(width).ensureAlpha().metadata();
  const height = firstMeta.height;

  const gif = GIFEncoder();
  const delay = Math.round(1000 / fps);

  for (const pngBuf of framePngBuffers) {
    // Resize and get raw RGBA pixel data
    const { data, info } = await sharp(pngBuf)
      .resize(width)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const rgbaData = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);

    // Quantize colors to 256 palette
    const palette = quantize(rgbaData, 256);

    // Map pixels to palette indices
    const indexed = applyPalette(rgbaData, palette);

    // Find transparent color index if there is transparency
    // (palette entries are [r, g, b] arrays)
    let transparentIndex = -1;
    // Check if any pixel in the frame is transparent (alpha < 128)
    for (let i = 3; i < rgbaData.length; i += 4) {
      if (rgbaData[i] < 128) {
        // Find the palette entry closest to fully transparent
        // Use the first palette index that maps to a transparent pixel
        transparentIndex = indexed[Math.floor(i / 4)];
        break;
      }
    }

    const frameOpts = { palette, delay };
    if (transparentIndex >= 0) {
      frameOpts.transparent = true;
      frameOpts.transparentIndex = transparentIndex;
    }

    gif.writeFrame(indexed, info.width, info.height, frameOpts);
  }

  gif.finish();

  return Buffer.from(gif.bytes());
}

/**
 * Generate a horizontal filmstrip image from an array of PNG frame buffers.
 *
 * @param {Buffer[]} framePngBuffers - Array of PNG image buffers.
 * @param {object} [options]
 * @param {number} [options.frameWidth=128] - Width of each frame in the filmstrip.
 * @returns {Promise<Buffer>} PNG buffer of the filmstrip.
 */
export async function generateFilmstrip(framePngBuffers, options = {}) {
  const { frameWidth = 128 } = options;

  if (framePngBuffers.length === 0) {
    throw new Error('No frames provided for filmstrip generation');
  }

  // Resize all frames to the target width and get metadata for height
  const resizedBuffers = [];
  let frameHeight = 0;

  for (const pngBuf of framePngBuffers) {
    const resized = await sharp(pngBuf).resize(frameWidth).ensureAlpha().png().toBuffer();
    resizedBuffers.push(resized);
  }

  // Determine height from the first resized frame
  const meta = await sharp(resizedBuffers[0]).metadata();
  frameHeight = meta.height;

  const totalWidth = frameWidth * resizedBuffers.length;

  // Build composite input array
  const composites = resizedBuffers.map((buf, index) => ({
    input: buf,
    left: index * frameWidth,
    top: 0,
  }));

  // Create the filmstrip canvas and composite all frames
  const filmstrip = await sharp({
    create: {
      width: totalWidth,
      height: frameHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();

  return filmstrip;
}
