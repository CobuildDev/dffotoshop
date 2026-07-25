import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://admin.dffotoshop.com.ng/wp/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
});
