"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_schema_1 = require("./resources/comment/comment.schema");
const user_schema_1 = require("./resources/user/user.schema");
const post_schema_1 = require("./resources/post/post.schema");
const token_schema_1 = require("./resources/token/token.schema");
const Mutation = `
  type Mutation {
    ${comment_schema_1.commentMutatios}
    ${post_schema_1.postMutations}
    ${token_schema_1.tokenMutations}
    ${user_schema_1.userMutations}
  }
`;
exports.default = Mutation;
