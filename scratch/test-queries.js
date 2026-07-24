const { GraphQLClient } = require('graphql-request');

async function test() {
  const graphqlClient = new GraphQLClient('https://admin.dffotoshop.com.ng/wp/graphql', {
    headers: { 'cache-control': 'no-store' }
  });
  
  const QUERY = `
    query {
      allowedCountries {
        code
        name
        states {
          code
          name
        }
      }
    }
  `;
  
  try {
    const data = await graphqlClient.request(QUERY);
    console.log("Countries:", JSON.stringify(data, null, 2));
  } catch(e) {
    console.log("Countries error:", e.response?.errors?.[0]?.message || e);
  }

  const QUERY2 = `
    query {
      cart {
        availableShippingMethods {
          rates {
            id
            label
            cost
          }
        }
      }
    }
  `;
  try {
    const data = await graphqlClient.request(QUERY2);
    console.log("Cart shipping:", JSON.stringify(data, null, 2));
  } catch(e) {
    console.log("Cart error:", e.response?.errors?.[0]?.message || e);
  }
}

test();
