async function run() {
  const query = `mutation AddToCart {
    addToCart(input: { productId: 13, quantity: 1 }) {
      cartItem { key }
    }
  }`;
  const res = await fetch('https://admin.dffotoshop.com.ng/wp/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  console.log(Object.fromEntries(res.headers.entries()));
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}
run();
