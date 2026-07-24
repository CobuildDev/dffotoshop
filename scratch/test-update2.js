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

  // 2. Try UpdateCustomer with session and fetch cart
  const UPDATE = `
    mutation UpdateCustomer($country: CountriesEnum!) {
      updateCustomer(input: { shipping: { country: $country, state: "LA", city: "Lagos" } }) {
        customer { id }
      }
    }
  `;
  try {
    const data = await graphqlClient.request(UPDATE, { country: "NG" }, { 'woocommerce-session': sessionToken });
    console.log("UpdateCustomer success:", data);
  } catch(e) {
    console.log("UpdateCustomer error:", e.response?.errors?.[0]?.message || e);
  }

  const QUERY2 = `
    query {
      cart {
        availableShippingMethods {
          packageDetails
          rates {
            id
            label
            cost
          }
        }
      }
    }
  `;
  try {
    const data2 = await graphqlClient.request(QUERY2, {}, { 'woocommerce-session': sessionToken });
    console.log("Cart shipping:", JSON.stringify(data2, null, 2));
  } catch(e) {
    console.log("Cart error:", e.response?.errors?.[0]?.message || e);
  }
}

test();
