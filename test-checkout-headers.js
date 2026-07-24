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
  const sessionToken = res.headers.get('woocommerce-session');
  console.log("Session token:", sessionToken);

  const checkoutQuery = `
      mutation Checkout {
        checkout(input: {
          billing: { firstName: "Test", lastName: "User", address1: "123", city: "Test", state: "TS", postcode: "12345", country: NG, email: "test@test.com", phone: "1234" },
          shipping: { firstName: "Test", lastName: "User", address1: "123", city: "Test", state: "TS", postcode: "12345", country: NG, email: "test@test.com", phone: "1234" },
          paymentMethod: "paystack",
          shippingMethod: ["flat_rate:1"]
        }) {
          result
          redirect
        }
      }
    `;
  
  const headersToTest = [
    sessionToken,
    `Bearer ${sessionToken}`,
    `Session ${sessionToken}`
  ];

  for (const h of headersToTest) {
    console.log("Testing header:", h.substring(0, 20) + "...");
    let checkoutRes = await fetch('https://admin.dffotoshop.com.ng/wp/graphql', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'woocommerce-session': h
      },
      body: JSON.stringify({ query: checkoutQuery })
    });
    let checkoutJson = await checkoutRes.json();
    console.log(JSON.stringify(checkoutJson).substring(0, 150));
  }
}
run();
