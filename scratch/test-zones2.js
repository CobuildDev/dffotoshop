const { GraphQLClient } = require('graphql-request');

async function test() {
  const graphqlClient = new GraphQLClient('https://admin.dffotoshop.com.ng/wp/graphql', {
    headers: { 'cache-control': 'no-store' }
  });
  
  const QUERY = `
    query {
      shippingZones {
        nodes {
          id
          name
        }
      }
    }
  `;
  
  try {
    const data = await graphqlClient.request(QUERY);
    console.log("Shipping zones:", JSON.stringify(data, null, 2));
  } catch(e) {
    console.log("Shipping zones error:", e.response?.errors?.[0]?.message || e);
  }
}

test();
