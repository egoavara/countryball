/**
 * Generate static SVG frames from an animated SVG by applying CSS keyframe
 * values at specific time points.
 */

import { parseKeyframes, parseAnimations, parseDuration } from './css-parser.mjs';
import { interpolate } from './css-interpolator.mjs';

/**
 * Generate an array of static SVG strings from an animated SVG.
 *
 * @param {string} svgString - The animated SVG markup.
 * @param {object} [options]
 * @param {number} [options.fps=8] - Frames per second.
 * @param {number} [options.frameCount] - Total number of frames (overrides fps * duration).
 * @returns {string[]} Array of static SVG strings, one per frame.
 */
export function generateFrames(svgString, options = {}) {
  const { fps = 8 } = options;

  // 1. Extract <style> content
  const styleContent = extractStyleContent(svgString);
  if (!styleContent) {
    // No style block -- return a single frame (the original SVG without style)
    return [svgString];
  }

  // 2. Parse keyframes and animations
  const keyframes = parseKeyframes(styleContent);
  const animations = parseAnimations(styleContent);

  if (keyframes.size === 0 || animations.size === 0) {
    return [svgString];
  }

  // 3. Determine total animation duration (use the longest animation)
  let maxDuration = 0;
  for (const [, anim] of animations) {
    if (anim.duration > maxDuration) maxDuration = anim.duration;
  }

  if (maxDuration <= 0) maxDuration = 1; // fallback

  const frameCount = options.frameCount || Math.max(1, Math.round(maxDuration * fps));

  // 4. Generate each frame
  const frames = [];
  for (let i = 0; i < frameCount; i++) {
    const time = (i / frameCount) * maxDuration; // seconds
    const frameSvg = generateSingleFrame(svgString, styleContent, keyframes, animations, time, maxDuration);
    frames.push(frameSvg);
  }

  return frames;
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

/**
 * Extract the text inside the first <style> element.
 */
function extractStyleContent(svg) {
  const match = svg.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  return match ? match[1] : null;
}

/**
 * Generate a single static SVG frame at a given time.
 */
function generateSingleFrame(svgString, styleContent, keyframes, animations, time, maxDuration) {
  let frameSvg = svgString;

  for (const [selectorGroup, anim] of animations) {
    const kf = keyframes.get(anim.name);
    if (!kf || kf.frames.length === 0) continue;

    const duration = anim.duration || maxDuration;
    const delay = anim.delay || 0;

    // Calculate effective time considering delay
    let effectiveTime = time - delay;
    if (effectiveTime < 0) effectiveTime = 0;

    // Normalize progress (0-1) considering direction
    let progress = duration > 0 ? (effectiveTime % duration) / duration : 0;

    // Handle direction
    if (anim.direction === 'reverse') {
      progress = 1 - progress;
    } else if (anim.direction === 'alternate') {
      const cycle = Math.floor(effectiveTime / duration);
      if (cycle % 2 === 1) progress = 1 - progress;
    } else if (anim.direction === 'alternate-reverse') {
      const cycle = Math.floor(effectiveTime / duration);
      if (cycle % 2 === 0) progress = 1 - progress;
    }

    // Find surrounding keyframe stops
    const interpolatedProps = interpolateKeyframeProperties(kf.frames, progress, anim.timingFunction);

    // Merge static properties (e.g. transform-origin) with animated properties
    const mergedProps = { ...(anim.staticProperties || {}), ...interpolatedProps };

    // Split comma-separated selectors and apply to each
    const selectors = selectorGroup.split(',').map(s => s.trim()).filter(Boolean);
    for (const selector of selectors) {
      frameSvg = applyPropertiesToSvg(frameSvg, selector, mergedProps);
    }
  }

  // Remove <style> block since all values are now inlined
  frameSvg = frameSvg.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  return frameSvg;
}

/**
 * Interpolate all properties at a given progress between keyframe stops.
 */
function interpolateKeyframeProperties(frames, progress, timingFunction) {
  const props = {};

  if (frames.length === 0) return props;
  if (frames.length === 1) return { ...frames[0].properties };

  // Find the two surrounding frames
  let prevFrame = frames[0];
  let nextFrame = frames[frames.length - 1];

  for (let i = 0; i < frames.length - 1; i++) {
    if (progress >= frames[i].offset && progress <= frames[i + 1].offset) {
      prevFrame = frames[i];
      nextFrame = frames[i + 1];
      break;
    }
  }

  // If progress is before the first frame or after the last
  if (progress <= frames[0].offset) return { ...frames[0].properties };
  if (progress >= frames[frames.length - 1].offset) return { ...frames[frames.length - 1].properties };

  // Calculate local progress between the two frames
  const range = nextFrame.offset - prevFrame.offset;
  const localProgress = range > 0 ? (progress - prevFrame.offset) / range : 0;

  // Gather all property names from both frames
  const allProps = new Set([
    ...Object.keys(prevFrame.properties),
    ...Object.keys(nextFrame.properties),
  ]);

  for (const prop of allProps) {
    const fromVal = prevFrame.properties[prop];
    const toVal = nextFrame.properties[prop];

    if (fromVal !== undefined && toVal !== undefined) {
      props[prop] = interpolate(fromVal, toVal, localProgress, timingFunction);
    } else if (fromVal !== undefined) {
      props[prop] = fromVal;
    } else {
      props[prop] = toVal;
    }
  }

  return props;
}

/**
 * Apply interpolated CSS properties to matching SVG elements.
 *
 * Supports simple selectors: tag, .class, #id
 */
function applyPropertiesToSvg(svgString, selector, properties) {
  let svg = svgString;

  // Build a regex to find matching elements
  const elementPattern = buildElementPattern(selector);
  if (!elementPattern) return svg;

  // Extract transform-origin if present (to bake into transform)
  const transformOrigin = properties['transform-origin'];

  // For each matching element, apply properties as inline attributes
  svg = svg.replace(elementPattern, (match) => {
    let element = match;

    for (const [prop, value] of Object.entries(properties)) {
      // Skip transform-origin as a separate attribute; it's baked into transform
      if (prop === 'transform-origin') continue;

      // Convert CSS property name to SVG attribute name
      const attrName = cssPropertyToSvgAttribute(prop);
      // Convert CSS transform values to SVG transform syntax
      if (attrName === 'transform') {
        const svgTransform = cssTransformToSvg(value);
        const attrValue = bakeTransformOrigin(svgTransform, transformOrigin);
        element = setAttributeOnElement(element, attrName, attrValue);
      } else {
        element = setAttributeOnElement(element, attrName, value);
      }
    }

    return element;
  });

  return svg;
}

/**
 * Bake transform-origin into the SVG transform by wrapping with translate/untranslate.
 * CSS: transform-origin: 256px 198px; transform: scale(1,0.1)
 * SVG: transform="translate(256,198) scale(1,0.1) translate(-256,-198)"
 */
function bakeTransformOrigin(svgTransform, transformOrigin) {
  if (!transformOrigin) return svgTransform;

  const origin = parseTransformOrigin(transformOrigin);
  if (!origin) return svgTransform;

  // Check if the transform is identity (no-op)
  if (!svgTransform || svgTransform.trim() === '') return svgTransform;

  return `translate(${origin.x},${origin.y}) ${svgTransform} translate(${-origin.x},${-origin.y})`;
}

/**
 * Parse CSS transform-origin value to {x, y} coordinates.
 * Supports: "256px 198px", "center center", "50% 50%", "center"
 */
function parseTransformOrigin(value) {
  const parts = value.trim().split(/\s+/);

  const parseComponent = (part, axis) => {
    if (part === 'center') return 256; // center of 512 canvas
    if (part === 'left' || part === 'top') return 0;
    if (part === 'right' || part === 'bottom') return 512;
    const num = parseFloat(part);
    if (part.endsWith('%')) return (num / 100) * 512;
    if (!isNaN(num)) return num;
    return null;
  };

  if (parts.length >= 2) {
    const x = parseComponent(parts[0], 'x');
    const y = parseComponent(parts[1], 'y');
    if (x !== null && y !== null) return { x, y };
  } else if (parts.length === 1) {
    const v = parseComponent(parts[0], 'x');
    if (v !== null) return { x: v, y: v };
  }

  return null;
}

/**
 * Build a regex pattern that matches SVG element opening tags based on a CSS selector.
 */
function buildElementPattern(selector) {
  const sel = selector.trim();

  // ID selector: #some-id
  if (sel.startsWith('#')) {
    const id = escapeRegex(sel.slice(1));
    return new RegExp(`<[a-zA-Z][^>]*\\bid="${id}"[^>]*/?>`, 'g');
  }

  // Class selector: .some-class
  if (sel.startsWith('.')) {
    const cls = escapeRegex(sel.slice(1));
    return new RegExp(`<[a-zA-Z][^>]*\\bclass="[^"]*\\b${cls}\\b[^"]*"[^>]*/?>`, 'g');
  }

  // Tag selector: circle, rect, etc.
  if (/^[a-zA-Z][\w-]*$/.test(sel)) {
    const tag = escapeRegex(sel);
    return new RegExp(`<${tag}\\b[^>]*/?>`, 'g');
  }

  // Tag with class: tag.class
  const tagClassMatch = sel.match(/^([a-zA-Z][\w-]*)\.([a-zA-Z][\w-]*)$/);
  if (tagClassMatch) {
    const tag = escapeRegex(tagClassMatch[1]);
    const cls = escapeRegex(tagClassMatch[2]);
    return new RegExp(`<${tag}\\b[^>]*\\bclass="[^"]*\\b${cls}\\b[^"]*"[^>]*/?>`, 'g');
  }

  // Tag with ID: tag#id
  const tagIdMatch = sel.match(/^([a-zA-Z][\w-]*)#([a-zA-Z][\w-]*)$/);
  if (tagIdMatch) {
    const tag = escapeRegex(tagIdMatch[1]);
    const id = escapeRegex(tagIdMatch[2]);
    return new RegExp(`<${tag}\\b[^>]*\\bid="${id}"[^>]*/?>`, 'g');
  }

  return null;
}

/**
 * Set or replace an attribute on an SVG element opening tag string.
 */
function setAttributeOnElement(elementTag, attrName, value) {
  const attrRegex = new RegExp(`\\b${escapeRegex(attrName)}="[^"]*"`, 'g');
  const replacement = `${attrName}="${value}"`;

  if (attrRegex.test(elementTag)) {
    return elementTag.replace(attrRegex, replacement);
  }

  // Attribute doesn't exist yet -- insert before the closing > or />
  return elementTag.replace(/(\/?>)$/, ` ${replacement}$1`);
}

/**
 * Convert a CSS property name to the corresponding SVG attribute name.
 * Most SVG presentation attributes use the same name as CSS,
 * but `transform` stays as is, etc.
 */
function cssPropertyToSvgAttribute(cssProp) {
  // In SVG, most presentation attributes use the exact CSS property name.
  // For camelCase properties, convert to kebab-case.
  return cssProp.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Convert CSS transform value to SVG transform attribute syntax.
 * CSS: translateY(-20px) → SVG: translate(0,-20)
 * CSS: translateX(10px) → SVG: translate(10,0)
 * CSS: translate(10px, 20px) → SVG: translate(10,20)
 * CSS: rotate(5deg) → SVG: rotate(5)
 * CSS: scale(1.1) → SVG: scale(1.1)
 * CSS: scaleX(0.9) scaleY(1.1) → SVG: scale(0.9,1.1)
 */
function cssTransformToSvg(cssTransform) {
  const parts = [];
  // Match individual transform functions
  const funcRegex = /([\w]+)\(([^)]*)\)/g;
  let m;
  let scaleX = null, scaleY = null;

  while ((m = funcRegex.exec(cssTransform)) !== null) {
    const func = m[1];
    const args = m[2].trim();

    switch (func) {
      case 'translateX': {
        const val = parseFloat(args);
        parts.push(`translate(${val},0)`);
        break;
      }
      case 'translateY': {
        const val = parseFloat(args);
        parts.push(`translate(0,${val})`);
        break;
      }
      case 'translate': {
        const vals = args.split(',').map(s => parseFloat(s.trim()));
        parts.push(`translate(${vals[0] || 0},${vals[1] || 0})`);
        break;
      }
      case 'rotate': {
        const val = parseFloat(args);
        parts.push(`rotate(${val})`);
        break;
      }
      case 'scale': {
        const vals = args.split(',').map(s => parseFloat(s.trim()));
        if (vals.length === 1) {
          parts.push(`scale(${vals[0]})`);
        } else {
          parts.push(`scale(${vals[0]},${vals[1]})`);
        }
        break;
      }
      case 'scaleX': {
        scaleX = parseFloat(args);
        break;
      }
      case 'scaleY': {
        scaleY = parseFloat(args);
        break;
      }
      default:
        // Pass through unknown functions
        parts.push(`${func}(${args})`);
    }
  }

  // Combine scaleX/scaleY into a single scale()
  if (scaleX !== null || scaleY !== null) {
    parts.push(`scale(${scaleX ?? 1},${scaleY ?? 1})`);
  }

  return parts.join(' ');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
