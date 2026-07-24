const { GraphQLClient } = require('graphql-request');
const endpoint = 'https://admin.dffotoshop.com.ng/wp/graphql';
const client = new GraphQLClient(endpoint);
const mutation1 = `
  mutation AddToCart {
    addToCart(input: { productId: 13, quantity: 1 }) {
      cartItem {
        key
      }
    }
  }
`;
const mutation2 = `
  mutation Checkout {
    checkout(input: {
      billing: { firstName: "Test", lastName: "User", email: "test@test.com", address1: "123 Test St", city: "Test City", state: "TS", postcode: "12345", country: "NG" },
      paymentMethod: "paystack"
    }) {
      result
    }
  }
`;

(async () => {
  const res1 = await client.rawRequest(mutation1);
  const sessionToken = res1.headers.get('woocommerce-session');
  console.log("Got token:", sessionToken);
  
  const headers = { 'woocommerce-session': `Bearer ${sessionToken}` };
  try {
    const res2 = await client.rawRequest(mutation2, {}, { 'woocommerce-session': `Bearer ${sessionToken}` });
    console.log("Checkout res with Bearer:", res2.data);
  } catch (err) {
    console.log("Checkout err with Bearer:", err.response?.errors?.[0]?.message);
    
    try {
      const res3 = await client.rawRequest(mutation2, {}, { 'woocommerce-session': sessionToken });
      console.log("Checkout res without Bearer:", res3.data);
    } catch(err2) {
      console.log("Checkout err without Bearer:", err2.response?.errors?.[0]?.message);
    }
  }
})();
