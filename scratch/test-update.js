const { GraphQLClient } = require('graphql-request');

async function test() {
  const graphqlClient = new GraphQLClient('https://admin.dffotoshop.com.ng/wp/graphql', {
    headers: { 'cache-control': 'no-store' }
  });
  
  // 1. Add to cart
  const ADD = `
    mutation AddToCart {
      addToCart(input: { productId: 13, quantity: 1 }) {
        cartItem { key }
      }
    }
  `;
  const res1 = await graphqlClient.rawRequest(ADD);
  const sessionToken = res1.headers.get('woocommerce-session');
  console.log("Session:", sessionToken);

  // 2. Try UpdateCustomer with session
  const UPDATE = `
    mutation UpdateCustomer {
      updateCustomer(input: { shipping: { country: "NG", state: "LA", city: "Lagos" } }) {
        customer { id }
      }
    }
  `;
  try {
    const data = await graphqlClient.request(UPDATE, {}, { 'woocommerce-session': sessionToken });
    console.log("UpdateCustomer success:", data);
  } catch(e) {
    console.log("UpdateCustomer error:", e.response?.errors?.[0]?.message || e);
  }
}

test();
