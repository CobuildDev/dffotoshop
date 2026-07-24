const { GraphQLClient } = require('graphql-request');
const endpoint = 'https://admin.dffotoshop.com.ng/wp/graphql';
const client = new GraphQLClient(endpoint);
const mutation = `
  mutation AddToCart {
    addToCart(input: { productId: 13, quantity: 1 }) {
      cartItem {
        key
      }
    }
  }
`;
client.rawRequest(mutation).then(res => {
  console.log("Response headers:");
  res.headers.forEach((value, key) => console.log(key, value));
  console.log("Response data:", JSON.stringify(res.data, null, 2));
}).catch(err => {
  console.error("Error headers:", err.response?.headers);
  console.error(err.message);
});
