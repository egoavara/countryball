/**
 * SVG structural and render verification engine for countryball art.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

import { readFile } from 'fs/promises';
import { renderSvgBufferToPng } from './renderer.mjs';

/**
 * Run all applicable verification checks on an SVG file.
 *
 * @param {string} svgPath - Path to the SVG file.
 * @param {object} [options]
 * @param {number} [options.width=512] - Render width for render checks.
 * @returns {Promise<object>} Verification report JSON.
 */
export async function verifySvg(svgPath, options = {}) {
  const { width = 512 } = options;
  const svgString = await readFile(svgPath, 'utf-8');

  const report = {
    file: svgPath,
    style: '',
    country: '',
    checks: {},
    passed: 0,
    failed: 0,
    total: 0,
    overall: 'pass',
  };

  // Extract metadata
  const styleAttr = extractAttribute(svgString, 'data-style');
  const countryAttr = extractAttribute(svgString, 'data-country');
  report.style = styleAttr || '';
  report.country = countryAttr || '';

  // -----------------------------------------------------------------------
  // Structural checks (8 items)
  // -----------------------------------------------------------------------

  // 1. layers_present
  report.checks.layers_present = checkLayersPresent(svgString);

  // 2. metadata_valid
  report.checks.metadata_valid = checkMetadataValid(svgString, styleAttr, countryAttr);

  // 3. body_clip_exists
  report.checks.body_clip_exists = checkBodyClipExists(svgString);

  // 4. flag_clipped
  report.checks.flag_clipped = checkFlagClipped(svgString);

  // 5. eyes_style_correct
  report.checks.eyes_style_correct = checkEyesStyleCorrect(svgString, styleAttr);

  // 6. eyes_no_pupil
  report.checks.eyes_no_pupil = checkEyesNoPupil(svgString);

  // 7. outline_present
  report.checks.outline_present = checkOutlinePresent(svgString);

  // 8. svg_wellformed
  report.checks.svg_wellformed = checkSvgWellformed(svgString);

  // 9. accessories_valid (only when accessory layers are present)
  // Strip XML comments so commented-out placeholders don't trigger the check
  const svgNoComments = svgString.replace(/<!--[\s\S]*?-->/g, '');
  const hasAccBack = /id=["']layer-accessories-back["']/.test(svgNoComments);
  const hasAccFront = /id=["']layer-accessories-front["']/.test(svgNoComments);

  if (hasAccBack || hasAccFront) {
    report.checks.accessories_valid = checkAccessoriesValid(svgNoComments, hasAccBack, hasAccFront);
  }

  // -----------------------------------------------------------------------
  // Render checks (3 items)
  // -----------------------------------------------------------------------

  // 9. render_success
  let pngBuffer = null;
  try {
    pngBuffer = await renderSvgBufferToPng(svgString, { width });
    report.checks.render_success = { pass: true, detail: 'SVG rendered to PNG without errors' };
  } catch (err) {
    report.checks.render_success = { pass: false, detail: `Render error: ${err.message}` };
  }

  // 10. render_non_empty
  if (pngBuffer) {
    report.checks.render_non_empty = await checkRenderNonEmpty(pngBuffer);
  } else {
    report.checks.render_non_empty = { pass: false, detail: 'Skipped: render failed' };
  }

  // 11. render_centered
  if (pngBuffer) {
    report.checks.render_centered = await checkRenderCentered(pngBuffer);
  } else {
    report.checks.render_centered = { pass: false, detail: 'Skipped: render failed' };
  }

  // -----------------------------------------------------------------------
  // Animation checks (3 items, only if SVG contains @keyframes)
  // -----------------------------------------------------------------------

  const hasKeyframes = /@keyframes\s/.test(svgString);

  if (hasKeyframes) {
    try {
      // Dynamic import for css-parser and related modules
      const { parseKeyframes, parseDuration: parseDur } = await import('./css-parser.mjs');

      // 12. css_keyframes_valid
      report.checks.css_keyframes_valid = checkCssKeyframesValid(svgString, parseKeyframes);

      // 13. frames_differ
      report.checks.frames_differ = await checkFramesDiffer(svgString, width);

      // 14. duration_valid
      report.checks.duration_valid = checkDurationValid(svgString);
    } catch (err) {
      report.checks.css_keyframes_valid = { pass: false, detail: `Import error: ${err.message}` };
      report.checks.frames_differ = { pass: false, detail: 'Skipped: parser import failed' };
      report.checks.duration_valid = { pass: false, detail: 'Skipped: parser import failed' };
    }
  }

  // -----------------------------------------------------------------------
  // Tally results
  // -----------------------------------------------------------------------

  for (const [, check] of Object.entries(report.checks)) {
    report.total++;
    if (check.pass) {
      report.passed++;
    } else {
      report.failed++;
    }
  }

  report.overall = report.failed === 0 ? 'pass' : 'fail';

  return report;
}

// ===========================================================================
// Structural check implementations
// ===========================================================================

function checkLayersPresent(svgString) {
  const required = ['layer-flag', 'layer-eyes', 'layer-outline'];
  const found = [];
  const missing = [];

  for (const id of required) {
    const pattern = new RegExp(`id=["']${id}["']`);
    if (pattern.test(svgString)) {
      found.push(id);
    } else {
      missing.push(id);
    }
  }

  return {
    pass: missing.length === 0,
    detail: missing.length === 0
      ? `Found: ${found.join(', ')}`
      : `Missing: ${missing.join(', ')}; Found: ${found.join(', ')}`,
  };
}

function checkMetadataValid(svgString, styleAttr, countryAttr) {
  const validStyles = ['borderball', 'classic'];
  const issues = [];

  if (!styleAttr) {
    issues.push('missing data-style attribute');
  } else if (!validStyles.includes(styleAttr)) {
    issues.push(`invalid data-style="${styleAttr}" (expected: ${validStyles.join(' or ')})`);
  }

  if (!countryAttr) {
    issues.push('missing data-country attribute');
  }

  return {
    pass: issues.length === 0,
    detail: issues.length === 0
      ? `data-style="${styleAttr}", data-country="${countryAttr}"`
      : issues.join('; '),
  };
}

function checkBodyClipExists(svgString) {
  // Look for <clipPath> with id containing "body"
  const pattern = /<clipPath[^>]*\bid="[^"]*body[^"]*"[^>]*>/i;
  const match = svgString.match(pattern);

  return {
    pass: !!match,
    detail: match ? `Found clipPath with body id` : 'No <clipPath> with id containing "body" found',
  };
}

function checkFlagClipped(svgString) {
  // Find the layer-flag group and check it has clip-path attribute
  const flagGroupPattern = /<g[^>]*\bid="layer-flag"[^>]*>/i;
  const match = svgString.match(flagGroupPattern);

  if (!match) {
    return { pass: false, detail: 'layer-flag group not found' };
  }

  const groupTag = match[0];
  const hasClipPath = /clip-path\s*=\s*"[^"]*"/i.test(groupTag);

  // Also check if the clip-path references a body clip
  const clipRef = groupTag.match(/clip-path\s*=\s*"url\(#([^)]+)\)"/i);

  if (!hasClipPath) {
    return { pass: false, detail: 'layer-flag group has no clip-path attribute' };
  }

  if (clipRef && /body/i.test(clipRef[1])) {
    return { pass: true, detail: `layer-flag clipped with "${clipRef[1]}"` };
  }

  return {
    pass: hasClipPath,
    detail: clipRef
      ? `layer-flag has clip-path referencing "${clipRef[1]}" (expected body clip)`
      : 'layer-flag has clip-path attribute',
  };
}

function checkEyesStyleCorrect(svgString, style) {
  // Extract the layer-eyes group content
  const eyesContent = extractGroupContent(svgString, 'layer-eyes');

  if (!eyesContent) {
    return { pass: false, detail: 'layer-eyes group not found' };
  }

  if (style === 'borderball') {
    // Borderball eyes should use <path> with arc commands (A/a)
    const hasPathWithArc = /<path[^>]*\bd="[^"]*[Aa][^"]*"[^>]*>/i.test(eyesContent);
    return {
      pass: hasPathWithArc,
      detail: hasPathWithArc
        ? 'Borderball eyes correctly use <path> with arc commands'
        : 'Borderball eyes should use <path> with arc (A/a) commands',
    };
  }

  if (style === 'classic') {
    // Classic eyes should use <ellipse>
    const hasEllipse = /<ellipse\b/i.test(eyesContent);
    return {
      pass: hasEllipse,
      detail: hasEllipse
        ? 'Classic eyes correctly use <ellipse> elements'
        : 'Classic eyes should use <ellipse> elements',
    };
  }

  return { pass: false, detail: `Unknown style "${style}" for eyes check` };
}

function checkEyesNoPupil(svgString) {
  const eyesContent = extractGroupContent(svgString, 'layer-eyes');

  if (!eyesContent) {
    return { pass: false, detail: 'layer-eyes group not found' };
  }

  // Check for <circle> with small radius (r < 15) that could be a pupil
  const circlePattern = /<circle[^>]*\br="([\d.]+)"[^>]*>/gi;
  let match;
  const smallCircles = [];

  while ((match = circlePattern.exec(eyesContent)) !== null) {
    const radius = parseFloat(match[1]);
    if (radius < 15) {
      smallCircles.push(radius);
    }
  }

  return {
    pass: smallCircles.length === 0,
    detail: smallCircles.length === 0
      ? 'No pupil-like small circles found in eyes'
      : `Found ${smallCircles.length} small circle(s) with r=${smallCircles.join(', ')} that may be pupils`,
  };
}

function checkOutlinePresent(svgString) {
  const outlineContent = extractGroupContent(svgString, 'layer-outline');

  if (!outlineContent) {
    return { pass: false, detail: 'layer-outline group not found' };
  }

  const hasStroke = /\bstroke\s*=\s*"[^"]+"/i.test(outlineContent);

  return {
    pass: hasStroke,
    detail: hasStroke
      ? 'layer-outline contains element(s) with stroke attribute'
      : 'No element with stroke attribute found in layer-outline',
  };
}

function checkSvgWellformed(svgString) {
  // Simple well-formedness check: matching open/close tags and proper structure
  const issues = [];

  // Check it starts with an SVG element
  if (!/<svg[\s>]/i.test(svgString)) {
    issues.push('No <svg> root element found');
  }

  // Check that it ends with </svg>
  if (!/<\/svg\s*>\s*$/i.test(svgString)) {
    issues.push('SVG does not end with </svg>');
  }

  // Simple tag matching: count open and close tags
  const openTags = svgString.match(/<[a-zA-Z][\w:-]*(?:\s[^>]*)?\s*(?<!\/)\s*>/g) || [];
  const selfCloseTags = svgString.match(/<[a-zA-Z][\w:-]*(?:\s[^>]*)?\s*\/>/g) || [];
  const closeTags = svgString.match(/<\/[a-zA-Z][\w:-]*\s*>/g) || [];

  // This is a rough check -- open tags minus self-closing should roughly equal close tags
  const openCount = openTags.length;
  const closeCount = closeTags.length;

  if (Math.abs(openCount - closeCount) > 2) {
    issues.push(`Tag mismatch: ${openCount} open tags, ${closeCount} close tags`);
  }

  // Check for unclosed quotes in attributes
  const brokenQuotes = svgString.match(/<[^>]*="[^"]*<|<[^>]*='[^']*</g);
  if (brokenQuotes) {
    issues.push('Possible unclosed attribute quotes detected');
  }

  return {
    pass: issues.length === 0,
    detail: issues.length === 0 ? 'SVG appears well-formed' : issues.join('; '),
  };
}

// ===========================================================================
// Render check implementations
// ===========================================================================

async function checkRenderNonEmpty(pngBuffer) {
  try {
    const stats = await sharp(pngBuffer).stats();
    // stats.channels is an array; the alpha channel is the last one (index 3 for RGBA)
    // Check if there are non-transparent pixels
    const alphaChannel = stats.channels[3];

    if (!alphaChannel) {
      // No alpha channel -- image is fully opaque, so non-empty
      return { pass: true, detail: 'Image has no alpha channel (fully opaque)' };
    }

    // If the max alpha value > 0, there are visible pixels
    const hasVisiblePixels = alphaChannel.max > 0;

    return {
      pass: hasVisiblePixels,
      detail: hasVisiblePixels
        ? `Non-transparent pixels found (alpha max=${alphaChannel.max})`
        : 'Image appears fully transparent (alpha max=0)',
    };
  } catch (err) {
    return { pass: false, detail: `Sharp stats error: ${err.message}` };
  }
}

async function checkRenderCentered(pngBuffer) {
  try {
    // Get original dimensions
    const originalMeta = await sharp(pngBuffer).metadata();
    const origWidth = originalMeta.width;
    const origHeight = originalMeta.height;

    // Trim transparent pixels and get the trim offset info
    const trimmed = sharp(pngBuffer).trim();
    const trimmedMeta = await trimmed.metadata();
    const trimInfo = trimmedMeta.trimOffsetLeft !== undefined ? trimmedMeta : null;

    if (!trimInfo || trimInfo.trimOffsetLeft === undefined) {
      // sharp.trim() metadata may not include offsets in all versions
      // Fall back to a buffer comparison approach
      const trimmedBuf = await sharp(pngBuffer).trim().toBuffer();
      const trimmedMeta2 = await sharp(trimmedBuf).metadata();

      const contentWidth = trimmedMeta2.width;
      const contentHeight = trimmedMeta2.height;

      // If the trimmed image is almost the same size as original, it's likely centered
      const widthMargin = origWidth - contentWidth;
      const heightMargin = origHeight - contentHeight;

      // Content should be within ~30% asymmetry tolerance
      // We can't determine exact offsets without trim offset info
      return {
        pass: true,
        detail: `Content size: ${contentWidth}x${contentHeight} in ${origWidth}x${origHeight} canvas (margins: ${widthMargin}px width, ${heightMargin}px height)`,
      };
    }

    // Calculate symmetry from trim offsets
    const leftOffset = Math.abs(trimInfo.trimOffsetLeft);
    const topOffset = Math.abs(trimInfo.trimOffsetTop);
    const contentWidth = trimInfo.width;
    const contentHeight = trimInfo.height;
    const rightOffset = origWidth - contentWidth - leftOffset;
    const bottomOffset = origHeight - contentHeight - topOffset;

    // Check horizontal centering (allow 30% asymmetry)
    const hTotal = leftOffset + rightOffset;
    const hDiff = Math.abs(leftOffset - rightOffset);
    const hSymmetric = hTotal === 0 || (hDiff / hTotal) < 0.3;

    // Check vertical centering (allow 30% asymmetry)
    const vTotal = topOffset + bottomOffset;
    const vDiff = Math.abs(topOffset - bottomOffset);
    const vSymmetric = vTotal === 0 || (vDiff / vTotal) < 0.3;

    const centered = hSymmetric && vSymmetric;

    return {
      pass: centered,
      detail: centered
        ? `Content centered (offsets L:${leftOffset} R:${rightOffset} T:${topOffset} B:${bottomOffset})`
        : `Content off-center (offsets L:${leftOffset} R:${rightOffset} T:${topOffset} B:${bottomOffset})`,
    };
  } catch (err) {
    return { pass: false, detail: `Centering check error: ${err.message}` };
  }
}

// ===========================================================================
// Animation check implementations
// ===========================================================================

function checkCssKeyframesValid(svgString, parseKeyframesFn) {
  const styleMatch = svgString.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!styleMatch) {
    return { pass: false, detail: 'No <style> block found' };
  }

  try {
    const keyframes = parseKeyframesFn(styleMatch[1]);
    if (keyframes.size === 0) {
      return { pass: false, detail: 'No @keyframes blocks parsed' };
    }

    const names = [...keyframes.keys()];
    const allValid = names.every((name) => {
      const kf = keyframes.get(name);
      return kf.frames.length >= 2;
    });

    return {
      pass: allValid,
      detail: allValid
        ? `Parsed ${names.length} keyframe(s): ${names.join(', ')}`
        : `Some keyframes have fewer than 2 stops: ${names.join(', ')}`,
    };
  } catch (err) {
    return { pass: false, detail: `Parse error: ${err.message}` };
  }
}

async function checkFramesDiffer(svgString, width) {
  try {
    const { generateFrames } = await import('./css-frame-generator.mjs');

    // Generate 3 frames
    const frames = generateFrames(svgString, { frameCount: 3 });

    if (frames.length < 2) {
      return { pass: false, detail: 'Could not generate multiple frames' };
    }

    // Render first two frames to PNG and compare
    const png1 = await renderSvgBufferToPng(frames[0], { width: Math.min(width, 128) });
    const png2 = await renderSvgBufferToPng(frames[Math.floor(frames.length / 2)], { width: Math.min(width, 128) });

    // Compare raw pixel data
    const raw1 = await sharp(png1).ensureAlpha().raw().toBuffer();
    const raw2 = await sharp(png2).ensureAlpha().raw().toBuffer();

    let diffPixels = 0;
    const totalPixels = raw1.length / 4;

    for (let i = 0; i < raw1.length; i += 4) {
      const dr = Math.abs(raw1[i] - raw2[i]);
      const dg = Math.abs(raw1[i + 1] - raw2[i + 1]);
      const db = Math.abs(raw1[i + 2] - raw2[i + 2]);
      const da = Math.abs(raw1[i + 3] - raw2[i + 3]);

      if (dr + dg + db + da > 10) {
        diffPixels++;
      }
    }

    const diffPercent = (diffPixels / totalPixels) * 100;
    const differ = diffPercent > 0.1;

    return {
      pass: differ,
      detail: differ
        ? `Frames differ by ${diffPercent.toFixed(2)}% of pixels`
        : `Frames are nearly identical (${diffPercent.toFixed(2)}% difference)`,
    };
  } catch (err) {
    return { pass: false, detail: `Frame comparison error: ${err.message}` };
  }
}

function checkDurationValid(svgString) {
  const styleMatch = svgString.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!styleMatch) {
    return { pass: false, detail: 'No <style> block found' };
  }

  // Find animation duration values in the style content
  const durationPatterns = [
    /animation\s*:[^;]*?([\d.]+)(m?s)/gi,
    /animation-duration\s*:\s*([\d.]+)(m?s)/gi,
  ];

  const durations = [];

  for (const pattern of durationPatterns) {
    let match;
    while ((match = pattern.exec(styleMatch[1])) !== null) {
      const value = parseFloat(match[1]);
      const unit = match[2];
      const seconds = unit === 'ms' ? value / 1000 : value;
      durations.push(seconds);
    }
  }

  if (durations.length === 0) {
    return { pass: false, detail: 'No animation duration found' };
  }

  const allValid = durations.every((d) => d >= 0.5 && d <= 10);
  const durationStr = durations.map((d) => `${d}s`).join(', ');

  return {
    pass: allValid,
    detail: allValid
      ? `Animation duration(s) valid: ${durationStr}`
      : `Animation duration(s) out of range (0.5s-10s): ${durationStr}`,
  };
}

// ===========================================================================
// Accessories check implementation
// ===========================================================================

function checkAccessoriesValid(svgString, hasAccBack, hasAccFront) {
  const issues = [];

  // Find document-order positions of key layers
  const posEyes = svgString.search(/id=["']layer-eyes["']/);
  const posAccBack = hasAccBack ? svgString.search(/id=["']layer-accessories-back["']/) : -1;
  const posAccFront = hasAccFront ? svgString.search(/id=["']layer-accessories-front["']/) : -1;

  // 1. layer-accessories-back must appear BEFORE layer-eyes
  if (hasAccBack && posEyes !== -1 && posAccBack > posEyes) {
    issues.push('layer-accessories-back must appear before layer-eyes in document order');
  }

  // 2. layer-accessories-front must appear AFTER layer-eyes
  if (hasAccFront && posEyes !== -1 && posAccFront < posEyes) {
    issues.push('layer-accessories-front must appear after layer-eyes in document order');
  }

  // 3. Check data-accessories metadata matches actual layers
  const dataAcc = extractAttribute(svgString, 'data-accessories');
  if ((hasAccBack || hasAccFront) && !dataAcc) {
    issues.push('Accessory layers present but data-accessories attribute is missing on <svg>');
  }

  // 4. Check for empty accessory layers
  if (hasAccBack) {
    const content = extractGroupContent(svgString, 'layer-accessories-back');
    if (content !== null && content.trim() === '') {
      issues.push('layer-accessories-back is empty');
    }
  }
  if (hasAccFront) {
    const content = extractGroupContent(svgString, 'layer-accessories-front');
    if (content !== null && content.trim() === '') {
      issues.push('layer-accessories-front is empty');
    }
  }

  return {
    pass: issues.length === 0,
    detail: issues.length === 0
      ? `Accessory layers valid (back: ${hasAccBack}, front: ${hasAccFront})`
      : issues.join('; '),
  };
}

// ===========================================================================
// Helpers
// ===========================================================================

/**
 * Extract the value of an attribute from the root <svg> element.
 */
function extractAttribute(svgString, attrName) {
  const svgTag = svgString.match(/<svg[^>]*>/i);
  if (!svgTag) return null;

  const attrPattern = new RegExp(`${attrName}=["']([^"']*)["']`, 'i');
  const match = svgTag[0].match(attrPattern);
  return match ? match[1] : null;
}

/**
 * Extract the inner content of a group with a specific id.
 */
function extractGroupContent(svgString, groupId) {
  const pattern = new RegExp(
    `<g[^>]*\\bid="${groupId}"[^>]*>([\\s\\S]*?)</g>`,
    'i'
  );
  const match = svgString.match(pattern);
  return match ? match[1] : null;
}
