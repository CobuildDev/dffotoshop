async function run() {
  const addToCartQuery = `mutation AddToCart {
    addToCart(input: { productId: 13, quantity: 1 }) {
      cartItem { key }
    }
  }`;
  let res = await fetch('https://admin.dffotoshop.com.ng/wp/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: addToCartQuery })
  });
  let json = await res.json();
  const sessionToken = res.headers.get('woocommerce-session');
  console.log("Session token:", sessionToken);

  const checkoutQuery = `
      mutation Checkout($billing: CustomerAddressInput, $shipping: CustomerAddressInput, $paymentMethod: String!, $customerNote: String, $shippingMethod: [String]) {
        checkout(input: {
          billing: $billing,
          shipping: $shipping,
          paymentMethod: $paymentMethod,
          customerNote: $customerNote,
          shippingMethod: $shippingMethod
        }) {
          result
          redirect
        }
      }
    `;
  let checkoutRes = await fetch('https://admin.dffotoshop.com.ng/wp/graphql', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'woocommerce-session': `Bearer ${sessionToken}` 
    },
    body: JSON.stringify({ 
      query: checkoutQuery,
      variables: {
        billing: { firstName: "Test", lastName: "User", address1: "123", city: "Test", state: "TS", postcode: "12345", country: "NG", email: "test@test.com", phone: "1234" },
        shipping: { firstName: "Test", lastName: "User", address1: "123", city: "Test", state: "TS", postcode: "12345", country: "NG", email: "test@test.com", phone: "1234" },
        paymentMethod: "paystack",
        customerNote: "",
        shippingMethod: ["flat_rate:1"]
      }
    })
  });
  let checkoutJson = await checkoutRes.json();
  console.log("Checkout:", JSON.stringify(checkoutJson, null, 2));
}
run();
