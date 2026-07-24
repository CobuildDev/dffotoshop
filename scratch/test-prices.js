const { GraphQLClient } = require('graphql-request');
const endpoint = 'https://admin.dffotoshop.com.ng/wp/graphql';
const client = new GraphQLClient(endpoint);
const query = `
  query GetProductPrices {
    products(first: 5) {
      nodes {
        id
        name
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
        }
      }
    }
  }
`;
client.request(query).then(res => console.log(JSON.stringify(res, null, 2))).catch(err => console.error(err.message));
