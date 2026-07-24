const { GraphQLClient } = require('graphql-request');

async function test() {
  const graphqlClient = new GraphQLClient('https://admin.dffotoshop.com.ng/wp/graphql');
  
  const QUERY = `
    query {
      __schema {
        queryType {
          fields {
            name
          }
        }
      }
    }
  `;
  
  try {
    const data = await graphqlClient.request(QUERY);
    const fields = data.__schema.queryType.fields.map(f => f.name);
    console.log("Countries related:", fields.filter(f => f.toLowerCase().includes('countr')));
    console.log("Shipping related:", fields.filter(f => f.toLowerCase().includes('ship')));
  } catch(e) {
    console.log("Error:", e);
  }
}

test();
