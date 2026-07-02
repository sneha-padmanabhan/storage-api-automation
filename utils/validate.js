const AjvImport = require('ajv');
const Ajv = AjvImport.default || AjvImport; // handle CJS/ESM interop

const schemas = {
  cart: require('../schemas/cart.schema.json'),
  product: require('../schemas/product.schema.json'),
  auth: require('../schemas/auth.schema.json'),
};

const ajv = new Ajv({ allErrors: true, strict: false });
const validators = {
  cart: ajv.compile(schemas.cart),
  product: ajv.compile(schemas.product),
  auth: ajv.compile(schemas.auth),
};

// Returns { valid, errors } — errors is Ajv's detailed list (great for assert messages).
function validate(kind, data) {
  const fn = validators[kind];
  if (!fn) throw new Error(`Unknown schema: ${kind}`);
  const valid = fn(data);
  return { valid, errors: fn.errors || [] };
}

module.exports = { validate };
