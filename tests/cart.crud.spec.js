// Cart CRUD — positive paths. Each response is schema-validated (Ajv).
// Note: FakeStoreAPI simulates writes, so we assert on the operation's response,
// not on read-after-write (nothing is actually persisted).

const { test, expect } = require('@playwright/test');
const { endpoints, buildCartPayload } = require('../utils/api');
const { validate } = require('../utils/validate');
const { EXISTING_CART_ID } = require('../utils/testData');

test.describe('Cart CRUD — positive', () => {
  test('POST /carts creates a cart and returns a schema-valid object @positive @schema', async ({ request }) => {
    const payload = buildCartPayload({ userId: 1, productId: 1, quantity: 3 });
    const res = await request.post(endpoints.carts, { data: payload });
    expect(res.ok()).toBeTruthy(); // FakeStoreAPI returns 200 on create

    const body = await res.json();
    expect(typeof body.id).toBe('number'); // a fake id is assigned
    expect(body.products.map((p) => p.productId)).toContain(1);

    const { valid, errors } = validate('cart', body);
    expect(valid, JSON.stringify(errors)).toBe(true);
  });

  test('GET /carts returns a non-empty list of schema-valid carts @positive @schema', async ({ request }) => {
    const res = await request.get(endpoints.carts);
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    for (const cart of body) {
      const { valid, errors } = validate('cart', cart);
      expect(valid, JSON.stringify(errors)).toBe(true);
    }
  });

  test('GET /carts/:id returns the requested cart @positive @schema', async ({ request }) => {
    const res = await request.get(endpoints.cart(EXISTING_CART_ID));
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(body.id).toBe(EXISTING_CART_ID);

    const { valid, errors } = validate('cart', body);
    expect(valid, JSON.stringify(errors)).toBe(true);
  });

  test('PUT /carts/:id updates a cart and echoes the new data @positive @schema', async ({ request }) => {
    const payload = buildCartPayload({ userId: 2, products: [{ productId: 4, quantity: 9 }] });
    const res = await request.put(endpoints.cart(EXISTING_CART_ID), { data: payload });
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(body.products.map((p) => p.productId)).toContain(4);

    const { valid, errors } = validate('cart', body);
    expect(valid, JSON.stringify(errors)).toBe(true);
  });

  test('DELETE /carts/:id returns the deleted cart @positive', async ({ request }) => {
    const res = await request.delete(endpoints.cart(EXISTING_CART_ID));
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    // FakeStoreAPI echoes the deleted cart object.
    expect(body).toBeTruthy();
    expect(typeof body).toBe('object');
  });
});
