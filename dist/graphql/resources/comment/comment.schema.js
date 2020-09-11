"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
  }
`;
exports.commentTypes = commentTypes;
const commentQueries = `
  #Get comments by Post ID
  commentsByPost(post: ID!, first: Int, offset: Int): [ Comment! ]!
`;
exports.commentQueries = commentQueries;
const commentMutatios = `
  createComment(input: CommentInput!): Comment
  updateComment(id: ID!, input: CommentInput!): Comment
  deleteComment(id: ID!): Boolean
`;
exports.commentMutatios = commentMutatios;
