import { commentMutatios } from "./resources/comment/comment.schema";
import { userMutations } from "./resources/user/user.schema";
import { postMutations } from "./resources/post/post.schema";
import { tokenMutations } from "./resources/token/token.schema";

const Mutation = `
  type Mutation {
    ${commentMutatios}
    ${postMutations}
    ${tokenMutations}
    ${userMutations}
  }
`;

export default Mutation;