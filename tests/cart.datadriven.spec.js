// Data-driven — the same "create a cart with product X" scenario, run across
// several product IDs. Each iteration is its own test in the report.

const { test, expect } = require('@playwright/test');
const { endpoints, buildCartPayload } = require('../utils/api');
const { validate } = require('../utils/validate');
const { PRODUCT_IDS } = require('../utils/testData');

test.describe('Cart CRUD — data-driven across product IDs', () => {
  for (const productId of PRODUCT_IDS) {
    test(`POST /carts with productId ${productId} echoes it and is schema-valid @positive @datadriven`, async ({ request }) => {
      const payload = buildCartPayload({ userId: 1, productId, quantity: 2 });
      const res = await request.post(endpoints.carts, { data: payload });
      expect(res.ok()).toBeTruthy();

      const body = await res.json();
      expect(body.products.map((p) => p.productId)).toContain(productId);

      const { valid, errors } = validate('cart', body);
      expect(valid, JSON.stringify(errors)).toBe(true);
    });
  }
});
