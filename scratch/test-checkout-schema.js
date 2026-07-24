const { GraphQLClient } = require('graphql-request');
const endpoint = 'https://admin.dffotoshop.com.ng/wp/graphql';
const client = new GraphQLClient(endpoint);
const query = `
  query GetCheckoutSchema {
    __type(name: "CheckoutInput") {
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
`;
client.request(query).then(res => console.log(JSON.stringify(res, null, 2))).catch(err => console.error(err.message));
