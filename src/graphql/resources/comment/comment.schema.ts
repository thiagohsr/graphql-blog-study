const commentTypes = `
  type Comment {
    id: ID!
    comment: String!
    createdAt: String!
    updatedAt: String!
    user: User!
    post: Post!
  }

  input CommentInput {
    comment: String!
    post: Int!
    user: Int!
  }
`;

const commentQueries = `
  #Get comments by Post ID
  commentsByPost(post: ID!, first: Int, offset: Int): [ Comment! ]!
`;

const commentMutatios =`
  createComment(input: CommentInput!): Comment
  updateComment(id: ID!, input: CommentInput!): Comment
  deleteComment(id: ID!): Boolean
`;

export {
  commentTypes,
  commentQueries,
  commentMutatios
}