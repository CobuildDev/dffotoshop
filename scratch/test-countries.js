const { GraphQLClient } = require('graphql-request');

async function test() {
  const graphqlClient = new GraphQLClient('https://admin.dffotoshop.com.ng/wp/graphql', {
    headers: { 'cache-control': 'no-store' }
  });
  
  const QUERY = `
    query {
      shippingCountries: allowedCountries
      billingCountries: allowedCountries
    }
  `;
  
  try {
    const data = await graphqlClient.request(QUERY);
    console.log("Countries:", JSON.stringify(data, null, 2));
  } catch(e) {
    console.log("Countries error:", e.response?.errors?.[0]?.message || e);
  }
}

test();
