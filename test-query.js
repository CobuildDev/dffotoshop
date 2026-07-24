const { GraphQLClient } = require('graphql-request');
const endpoint = 'https://admin.dffotoshop.com.ng/wp/graphql';
const client = new GraphQLClient(endpoint);
const query = `
  query GetAllProducts {
    products(first: 20) {
      nodes {
        id
        name
      }
    }
  }
`;
client.request(query).then(console.log).catch(err => console.error(JSON.stringify(err, null, 2)));
