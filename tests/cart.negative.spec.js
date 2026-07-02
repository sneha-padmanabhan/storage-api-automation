// Cart CRUD — negative paths.
// FakeStoreAPI doesn't validate input and rarely returns 4xx, so these assert on
// the meaningful contract: the response must NOT be a well-formed cart.

const { test, expect } = require('@playwright/test');
const { endpoints } = require('../utils/api');
const { validate } = require('../utils/validate');
const { NON_EXISTENT_CART_ID } = require('../utils/testData');

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

test.describe('Cart CRUD — negative', () => {
  test('GET a non-existent cart id does not return a valid cart @negative', async ({ request }) => {
    const res = await request.get(endpoints.cart(NON_EXISTENT_CART_ID));
    expect([200, 404]).toContain(res.status());
    const body = await safeJson(res);
    // Whether the API returns null, {} or a 404, it must not be a well-formed cart.
    expect(validate('cart', body).valid).toBe(false);
  });

  test('GET a cart with a non-numeric id does not return a valid cart @negative', async ({ request }) => {
    const res = await request.get(endpoints.cart('not-a-number'));
    const body = await safeJson(res);
    expect(validate('cart', body).valid).toBe(false);
  });

  test('POST with a malformed body is not accepted as a valid cart @negative @schema', async ({ request }) => {
    // products must be an array of {productId, quantity}; send junk instead.
    const res = await request.post(endpoints.carts, { data: { userId: 'abc', products: 'oops' } });

    if (res.status() >= 400) {
      expect(res.status()).toBeGreaterThanOrEqual(400); // API rejected it — ideal
    } else {
      // FakeStoreAPI has no server-side validation, so the echoed body should fail our contract.
      const body = await safeJson(res);
      expect(validate('cart', body).valid).toBe(false);
    }
  });
});
