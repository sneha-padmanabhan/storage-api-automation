// Credentials are FakeStoreAPI's documented sample user; override via env if needed.
const USERS = {
  valid: {
    username: process.env.FAKESTORE_USERNAME || 'mor_2314',
    password: process.env.FAKESTORE_PASSWORD || '83r5^_',
  },
  invalid: { username: 'nope_user', password: 'wrong_pass' },
};

const EXISTING_CART_ID = 1; // carts 1..20 exist on FakeStoreAPI
const NON_EXISTENT_CART_ID = 99999;

// Data-driven scenario runs over these product IDs (all valid on FakeStoreAPI).
const PRODUCT_IDS = [1, 2, 3, 5, 7];

module.exports = { USERS, EXISTING_CART_ID, NON_EXISTENT_CART_ID, PRODUCT_IDS };
