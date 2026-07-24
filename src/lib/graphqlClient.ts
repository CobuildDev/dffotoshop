import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://admin.dffotoshop.com.ng/wp/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
});
