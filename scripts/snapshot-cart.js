// Regenerate the committed shape snapshot from the live API:
//   npm run snapshot:cart
// Optionally target a different cart/base URL:
//   SNAPSHOT_CART_ID=2 FAKESTORE_URL=https://fakestoreapi.com npm run snapshot:cart

const fs = require('fs');
const path = require('path');
const { shapeOf } = require('../utils/shape');

const BASE_URL = process.env.FAKESTORE_URL || 'https://fakestoreapi.com';
const CART_ID = process.env.SNAPSHOT_CART_ID || 1;

(async () => {
  const res = await fetch(`${BASE_URL}/carts/${CART_ID}`);
  if (!res.ok) throw new Error(`Failed to fetch cart ${CART_ID}: HTTP ${res.status}`);

  const shape = shapeOf(await res.json());
  const out = path.join(__dirname, '..', 'schemas', 'cart.shape.json');
  fs.writeFileSync(out, JSON.stringify(shape, null, 2) + '\n');

  console.log(`Wrote shape snapshot to ${out}`);
  console.log(JSON.stringify(shape, null, 2));
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
