const { GraphQLClient } = require('graphql-request');
const endpoint = 'https://admin.dffotoshop.com.ng/wp/graphql';
const client = new GraphQLClient(endpoint);
const query = `
  mutation TryWriteReview {
    writeReview(input: {
      commentOn: 13,
      author: "Test",
      authorEmail: "test@example.com",
      content: "Great product!",
      rating: 5
    }) {
      clientMutationId
    }
  }
`;
client.request(query).then(res => console.log("writeReview works:", res)).catch(err => {
  console.log("writeReview failed:", err.message);
  const commentQuery = `
    mutation TryCreateComment {
      createComment(input: {
        commentOn: 13,
        author: "Test",
        authorEmail: "test@example.com",
        content: "Great product!"
      }) {
        clientMutationId
      }
    }
  `;
  client.request(commentQuery).then(res => console.log("createComment works:", res)).catch(e => console.error("createComment failed:", e.message));
});
