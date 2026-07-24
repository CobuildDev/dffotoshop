import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://admin.dffotoshop.com.ng/wp/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  // You can add headers here if needed, such as authorization tokens
  // headers: {
  //   authorization: `Bearer ${process.env.WP_GRAPHQL_TOKEN}`,
  // }
});
