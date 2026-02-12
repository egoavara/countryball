/**
 * Regex-based CSS @keyframes and animation parser for SVG <style> content.
 */

/**
 * Parse all @keyframes blocks from CSS text.
 *
 * @param {string} cssText - The raw CSS text (typically from an SVG <style> element).
 * @returns {Map<string, { frames: Array<{ offset: number, properties: Record<string, string> }> }>}
 */
export function parseKeyframes(cssText) {
  const result = new Map();

  // Match @keyframes blocks. The regex captures the name and the full body.
  const keyframesRegex = /@keyframes\s+([\w-]+)\s*\{([\s\S]*?\})\s*\}/g;
  let match;

  while ((match = keyframesRegex.exec(cssText)) !== null) {
    const name = match[1];
    const body = match[2];
    const frames = parseKeyframeBody(body);
    result.set(name, { frames });
  }

  return result;
}

/**
 * Parse the body of a @keyframes block into individual frame stops.
 * Supports: 0%, 50%, 100%, from, to, and multi-stop syntax like "0%, 100% { ... }".
 *
 * @param {string} body
 * @returns {Array<{ offset: number, properties: Record<string, string> }>}
 */
function parseKeyframeBody(body) {
  const frames = [];

  // Match individual keyframe stops: "<selector> { <properties> }"
  const stopRegex = /([\w%,\s]+?)\s*\{([^}]*)\}/g;
  let match;

  while ((match = stopRegex.exec(body)) !== null) {
    const selectorPart = match[1].trim();
    const propertiesText = match[2].trim();
    const properties = parseProperties(propertiesText);

    // Parse the selector into one or more offsets
    const offsets = parseOffsets(selectorPart);

    for (const offset of offsets) {
      frames.push({ offset, properties });
    }
  }

  // Sort by offset ascending
  frames.sort((a, b) => a.offset - b.offset);
  return frames;
}

/**
 * Parse a keyframe selector string into numeric offsets (0-1).
 * Handles: "0%", "50%", "100%", "from", "to", "0%, 100%"
 *
 * @param {string} selector
 * @returns {number[]}
 */
function parseOffsets(selector) {
  const parts = selector.split(',').map((s) => s.trim());
  const offsets = [];

  for (const part of parts) {
    if (part === 'from') {
      offsets.push(0);
    } else if (part === 'to') {
      offsets.push(1);
    } else {
      const percentMatch = part.match(/([\d.]+)%/);
      if (percentMatch) {
        offsets.push(parseFloat(percentMatch[1]) / 100);
      }
    }
  }

  return offsets;
}

/**
 * Parse a CSS property block into a key-value record.
 *
 * @param {string} text - e.g. "transform: rotate(10deg); opacity: 0.5"
 * @returns {Record<string, string>}
 */
function parseProperties(text) {
  const props = {};
  // Split on semicolons, handling values that might contain parentheses
  const declarations = text.split(';').filter((s) => s.trim());

  for (const decl of declarations) {
    const colonIndex = decl.indexOf(':');
    if (colonIndex === -1) continue;
    const prop = decl.slice(0, colonIndex).trim();
    const value = decl.slice(colonIndex + 1).trim();
    if (prop) {
      props[prop] = value;
    }
  }

  return props;
}

/**
 * Parse all CSS animation properties from CSS text.
 * Handles both shorthand `animation: name 2s ease-in-out infinite;`
 * and longhand `animation-name`, `animation-duration`, etc.
 *
 * @param {string} cssText
 * @returns {Map<string, { name: string, duration: number, timingFunction: string, delay: number, iterationCount: string, direction: string, fillMode: string }>}
 */
export function parseAnimations(cssText) {
  const result = new Map();

  // Match rule blocks: "selector { ... }"
  // Skip @keyframes blocks first by removing them
  const withoutKeyframes = cssText.replace(/@keyframes\s+[\w-]+\s*\{[\s\S]*?\}\s*\}/g, '');

  const ruleRegex = /([\w.#\-[\]=:,\s*>+~]+?)\s*\{([^}]*)\}/g;
  let match;

  while ((match = ruleRegex.exec(withoutKeyframes)) !== null) {
    const selector = match[1].trim();
    const body = match[2].trim();

    if (!selector || selector.startsWith('@')) continue;

    const props = parseProperties(body);
    const animInfo = extractAnimationInfo(props);

    if (animInfo.name) {
      // Collect non-animation static properties (e.g. transform-origin)
      const staticProps = {};
      const animPropNames = [
        'animation', 'animation-name', 'animation-duration',
        'animation-timing-function', 'animation-delay',
        'animation-iteration-count', 'animation-direction',
        'animation-fill-mode', 'animation-play-state',
      ];
      for (const [key, value] of Object.entries(props)) {
        if (!animPropNames.includes(key)) {
          staticProps[key] = value;
        }
      }
      result.set(selector, { ...animInfo, staticProperties: staticProps });
    }
  }

  return result;
}

/**
 * Extract animation info from parsed CSS properties.
 * Handles both shorthand and longhand.
 *
 * @param {Record<string, string>} props
 * @returns {{ name: string, duration: number, timingFunction: string, delay: number, iterationCount: string, direction: string, fillMode: string }}
 */
function extractAnimationInfo(props) {
  const info = {
    name: '',
    duration: 0,
    timingFunction: 'ease',
    delay: 0,
    iterationCount: '1',
    direction: 'normal',
    fillMode: 'none',
  };

  // Longhand properties take precedence over shorthand parsing
  if (props['animation']) {
    const parsed = parseAnimationShorthand(props['animation']);
    Object.assign(info, parsed);
  }

  // Override with longhand if present
  if (props['animation-name']) info.name = props['animation-name'];
  if (props['animation-duration']) info.duration = parseDuration(props['animation-duration']);
  if (props['animation-timing-function']) info.timingFunction = props['animation-timing-function'];
  if (props['animation-delay']) info.delay = parseDuration(props['animation-delay']);
  if (props['animation-iteration-count']) info.iterationCount = props['animation-iteration-count'];
  if (props['animation-direction']) info.direction = props['animation-direction'];
  if (props['animation-fill-mode']) info.fillMode = props['animation-fill-mode'];

  return info;
}

/**
 * Parse the CSS `animation` shorthand value.
 *
 * The shorthand order is:
 *   name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
 * Not all parts are required. We use heuristics to identify each part.
 *
 * @param {string} shorthand
 * @returns {object}
 */
function parseAnimationShorthand(shorthand) {
  const info = {
    name: '',
    duration: 0,
    timingFunction: 'ease',
    delay: 0,
    iterationCount: '1',
    direction: 'normal',
    fillMode: 'none',
  };

  const timingFunctions = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end'];
  const directions = ['normal', 'reverse', 'alternate', 'alternate-reverse'];
  const fillModes = ['none', 'forwards', 'backwards', 'both'];

  const parts = shorthand.trim().split(/\s+/);
  let durationFound = false;

  for (const part of parts) {
    // Check if it's a time value
    if (/^[\d.]+m?s$/.test(part)) {
      if (!durationFound) {
        info.duration = parseDuration(part);
        durationFound = true;
      } else {
        info.delay = parseDuration(part);
      }
    } else if (timingFunctions.includes(part)) {
      info.timingFunction = part;
    } else if (part === 'infinite' || /^\d+$/.test(part)) {
      info.iterationCount = part;
    } else if (directions.includes(part)) {
      info.direction = part;
    } else if (fillModes.includes(part)) {
      info.fillMode = part;
    } else if (part === 'running' || part === 'paused') {
      // play-state, ignore
    } else {
      // Assume it's the animation name
      info.name = part;
    }
  }

  return info;
}

/**
 * Parse a CSS time value (e.g. "2s", "500ms") to seconds.
 *
 * @param {string} value
 * @returns {number} Duration in seconds.
 */
export function parseDuration(value) {
  const msMatch = value.match(/([\d.]+)ms/);
  if (msMatch) return parseFloat(msMatch[1]) / 1000;

  const sMatch = value.match(/([\d.]+)s/);
  if (sMatch) return parseFloat(sMatch[1]);

  return 0;
}
