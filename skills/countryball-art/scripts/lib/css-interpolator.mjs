/**
 * CSS property interpolation engine with easing functions.
 */

// ---------------------------------------------------------------------------
// Cubic Bezier
// ---------------------------------------------------------------------------

/**
 * Create a cubic-bezier easing function.
 * Uses Newton's method to find t for a given x, then evaluates y(t).
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {(t: number) => number}
 */
export function cubicBezier(x1, y1, x2, y2) {
  // Compute coefficients for the cubic polynomial in t
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  function sampleCurveX(t) {
    return ((ax * t + bx) * t + cx) * t;
  }

  function sampleCurveY(t) {
    return ((ay * t + by) * t + cy) * t;
  }

  function sampleCurveDerivX(t) {
    return (3 * ax * t + 2 * bx) * t + cx;
  }

  /**
   * Find parameter t for a given x using Newton's method with bisection fallback.
   */
  function solveCurveX(x) {
    let t = x;
    // Newton's method iterations
    for (let i = 0; i < 8; i++) {
      const xEstimate = sampleCurveX(t) - x;
      if (Math.abs(xEstimate) < 1e-7) return t;
      const d = sampleCurveDerivX(t);
      if (Math.abs(d) < 1e-7) break;
      t -= xEstimate / d;
    }

    // Bisection fallback
    let lo = 0;
    let hi = 1;
    t = x;
    while (lo < hi) {
      const xEst = sampleCurveX(t);
      if (Math.abs(xEst - x) < 1e-7) return t;
      if (x > xEst) {
        lo = t;
      } else {
        hi = t;
      }
      t = (lo + hi) / 2;
      if (hi - lo < 1e-7) break;
    }
    return t;
  }

  return function easing(progress) {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;
    return sampleCurveY(solveCurveX(progress));
  };
}

// ---------------------------------------------------------------------------
// Easing functions
// ---------------------------------------------------------------------------

export const easingFunctions = {
  linear: (t) => t,
  ease: cubicBezier(0.25, 0.1, 0.25, 1.0),
  'ease-in': cubicBezier(0.42, 0, 1.0, 1.0),
  'ease-out': cubicBezier(0, 0, 0.58, 1.0),
  'ease-in-out': cubicBezier(0.42, 0, 0.58, 1.0),
};

// ---------------------------------------------------------------------------
// Value interpolation
// ---------------------------------------------------------------------------

/**
 * Interpolate between two CSS property values.
 *
 * @param {string} from - Start value.
 * @param {string} to - End value.
 * @param {number} progress - Normalized progress (0-1, before easing).
 * @param {string} [timingFunction='linear'] - CSS timing function name.
 * @returns {string} Interpolated value.
 */
export function interpolate(from, to, progress, timingFunction = 'linear') {
  const easing = easingFunctions[timingFunction] || easingFunctions.linear;
  const t = easing(progress);
  return interpolateValue(String(from), String(to), t);
}

/**
 * Detect value type and delegate to the appropriate interpolator.
 *
 * @param {string} from
 * @param {string} to
 * @param {number} t - Eased progress (0-1).
 * @returns {string}
 */
function interpolateValue(from, to, t) {
  // Hex color: #rgb or #rrggbb
  if (/^#[0-9a-fA-F]{3,8}$/.test(from) && /^#[0-9a-fA-F]{3,8}$/.test(to)) {
    return interpolateColor(from, to, t);
  }

  // Transform functions: e.g. translate(10, 20) rotate(45deg)
  if (/\w+\(/.test(from) && /\w+\(/.test(to)) {
    return interpolateTransform(from, to, t);
  }

  // Number with unit: e.g. 10px, 2.5em, 90deg
  const unitFrom = parseNumberWithUnit(from);
  const unitTo = parseNumberWithUnit(to);
  if (unitFrom && unitTo && unitFrom.unit === unitTo.unit) {
    const val = lerp(unitFrom.value, unitTo.value, t);
    return `${roundTo(val, 4)}${unitFrom.unit}`;
  }

  // Plain numbers
  const numFrom = parseFloat(from);
  const numTo = parseFloat(to);
  if (!isNaN(numFrom) && !isNaN(numTo) && isNumericString(from) && isNumericString(to)) {
    return String(roundTo(lerp(numFrom, numTo, t), 4));
  }

  // SVG path d attribute - interpolate numeric values if same structure
  if (looksLikePath(from) && looksLikePath(to)) {
    return interpolatePath(from, to, t);
  }

  // Fallback: return nearest value
  return t < 0.5 ? from : to;
}

// ---------------------------------------------------------------------------
// Color interpolation
// ---------------------------------------------------------------------------

function normalizeHex(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  return hex;
}

function interpolateColor(from, to, t) {
  const f = normalizeHex(from);
  const e = normalizeHex(to);

  const r1 = parseInt(f.slice(0, 2), 16);
  const g1 = parseInt(f.slice(2, 4), 16);
  const b1 = parseInt(f.slice(4, 6), 16);

  const r2 = parseInt(e.slice(0, 2), 16);
  const g2 = parseInt(e.slice(2, 4), 16);
  const b2 = parseInt(e.slice(4, 6), 16);

  const r = Math.round(lerp(r1, r2, t));
  const g = Math.round(lerp(g1, g2, t));
  const b = Math.round(lerp(b1, b2, t));

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function toHex(n) {
  return n.toString(16).padStart(2, '0');
}

// ---------------------------------------------------------------------------
// Transform interpolation
// ---------------------------------------------------------------------------

/**
 * Interpolate transform strings like "translate(10, 20) rotate(45deg)".
 * Both strings must have the same function names in the same order.
 */
function interpolateTransform(from, to, t) {
  const fromFns = parseTransformFunctions(from);
  const toFns = parseTransformFunctions(to);

  if (fromFns.length !== toFns.length) {
    return t < 0.5 ? from : to;
  }

  const parts = [];
  for (let i = 0; i < fromFns.length; i++) {
    const ff = fromFns[i];
    const tf = toFns[i];

    if (ff.name !== tf.name || ff.args.length !== tf.args.length) {
      return t < 0.5 ? from : to;
    }

    const interpolatedArgs = ff.args.map((arg, j) => {
      const a = parseNumberWithUnit(arg) || { value: parseFloat(arg) || 0, unit: '' };
      const b = parseNumberWithUnit(tf.args[j]) || { value: parseFloat(tf.args[j]) || 0, unit: '' };
      const val = lerp(a.value, b.value, t);
      return `${roundTo(val, 4)}${a.unit || b.unit}`;
    });

    parts.push(`${ff.name}(${interpolatedArgs.join(', ')})`);
  }

  return parts.join(' ');
}

function parseTransformFunctions(str) {
  const results = [];
  const regex = /([\w-]+)\(([^)]*)\)/g;
  let match;
  while ((match = regex.exec(str)) !== null) {
    const name = match[1];
    const args = match[2].split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
    results.push({ name, args });
  }
  return results;
}

// ---------------------------------------------------------------------------
// Path interpolation
// ---------------------------------------------------------------------------

function looksLikePath(str) {
  return /^[MmLlHhVvCcSsQqTtAaZz\d\s.,eE+-]+$/.test(str.trim()) && /[MmLl]/.test(str);
}

function interpolatePath(from, to, t) {
  // Tokenize both paths and interpolate numeric tokens
  const fromTokens = tokenizePath(from);
  const toTokens = tokenizePath(to);

  if (fromTokens.length !== toTokens.length) {
    return t < 0.5 ? from : to;
  }

  const result = fromTokens.map((ft, i) => {
    const tt = toTokens[i];
    const fNum = parseFloat(ft);
    const tNum = parseFloat(tt);
    if (!isNaN(fNum) && !isNaN(tNum)) {
      return String(roundTo(lerp(fNum, tNum, t), 4));
    }
    // Non-numeric tokens (commands) must match
    return ft;
  });

  return result.join(' ');
}

function tokenizePath(d) {
  // Split path into command letters and numbers
  return d.match(/[a-zA-Z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || [];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function roundTo(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function parseNumberWithUnit(str) {
  const match = String(str).match(/^([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)(px|em|rem|%|deg|rad|turn|s|ms|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/);
  if (!match) return null;
  return { value: parseFloat(match[1]), unit: match[2] };
}

function isNumericString(str) {
  return /^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?$/.test(str.trim());
}
