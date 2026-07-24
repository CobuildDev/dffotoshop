const { GraphQLClient } = require('graphql-request');

async function test() {
  const graphqlClient = new GraphQLClient('https://admin.dffotoshop.com.ng/wp/graphql', {
    headers: { 'cache-control': 'no-store' }
  });
  
  const QUERY = `
    query {
      __schema {
        mutationType {
          fields {
            name
          }
        }
      }
    }
  `;
  
  try {
    const data = await graphqlClient.request(QUERY);
    const fields = data.__schema.mutationType.fields.map(f => f.name);
    console.log("Customer/Session mutations:", fields.filter(f => f.toLowerCase().includes('customer') || f.toLowerCase().includes('session') || f.toLowerCase().includes('shipping')));
  } catch(e) {
    console.log("Error:", e.response?.errors?.[0]?.message || e);
  }
}

test();
