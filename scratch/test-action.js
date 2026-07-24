const { GraphQLClient } = require('graphql-request');

async function test() {
  const graphqlClient = new GraphQLClient('https://admin.dffotoshop.com.ng/wp/graphql');
  
  const ADD_TO_CART = `
    mutation AddToCart($productId: Int!, $quantity: Int!) {
      addToCart(input: { productId: $productId, quantity: $quantity }) {
        cartItem { key }
      }
    }
  `;
  
  let sessionHeader = '';
  const response = await graphqlClient.rawRequest(
    ADD_TO_CART, 
    { productId: 13, quantity: 1 }
  );

  const returnedSession = response.headers.get('woocommerce-session');
  console.log("Got session from rawRequest:", returnedSession);
  
  if (returnedSession) {
    sessionHeader = returnedSession;
  }
  
  const CHECKOUT = `
    mutation Checkout($billing: CustomerAddressInput, $paymentMethod: String!) {
      checkout(input: {
        billing: $billing,
        paymentMethod: $paymentMethod
      }) {
        result
      }
    }
  `;
  
  try {
    const data = await graphqlClient.request(CHECKOUT, {
      billing: { firstName: "Test", lastName: "User", email: "test@test.com", address1: "123", city: "City", state: "TS", postcode: "123", country: "NG" },
      paymentMethod: "paystack"
    }, { 'woocommerce-session': sessionHeader });
    console.log("Checkout data:", data);
  } catch(e) {
    console.log("Checkout error:", e.response?.errors?.[0]?.message);
  }
}

test();
