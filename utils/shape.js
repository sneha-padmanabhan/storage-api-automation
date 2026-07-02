// Reduce a value to its *shape*: keys + value types, recursively. Values are
// discarded so the contract catches structural drift, not routine data changes.
// Known-noisy fields (Mongoose's __v) are ignored so the contract stays meaningful.

const IGNORED_KEYS = new Set(['__v']);

function shapeOf(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    return value.length ? [shapeOf(value[0])] : [];
  }
  if (typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      if (IGNORED_KEYS.has(key)) continue;
      out[key] = shapeOf(value[key]);
    }
    return out;
  }
  return typeof value; // 'number' | 'string' | 'boolean'
}

module.exports = { shapeOf, IGNORED_KEYS };
