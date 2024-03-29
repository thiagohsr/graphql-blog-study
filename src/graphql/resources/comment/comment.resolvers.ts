import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { AuthUser } from "../../../interfaces/AuthUserInterfaces";
import { Transaction } from "sequelize";
import { CommentInstance } from "../../../models/CommentModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";

export const commentResolvers = {
  Comment: {
    user: (parent, {first = 10, offset = 0}, {db}: {db:DbConnection}, info: GraphQLResolveInfo) => {
      return db.User.findById(parent.get("user")).catch(handleError)
    },
    post: (parent, {first = 10, offset = 0}, {db}: {db:DbConnection}, info: GraphQLResolveInfo) => {
      return db.Post.findById(parent.get("post")).catch(handleError)
    },
    
  },
  Query: {
    commentsByPost: (parent, {postId, first = 10, offset = 0}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
      postId = parseInt(postId);
      return db.Comments.findAll({
        where: {post: postId}
      }).catch(handleError);
    }
  },
  Mutation: {
    createComment: compose(...authResolvers)((parent, {input}, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
      input.user = authUser.id;
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comments.create(input, { transaction: t});
      }).catch(handleError);
    }),
    updateComment: compose(...authResolvers)((parent, {id, input}, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
      id = parseInt(id);
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comments.findById(id).then((comment: CommentInstance) => {
          throwError(!comment, `Comment with id ${id} not found!`);
          throwError(comment.get("user") != authUser.id, `Unauthorized! You can only edit comment by yourself!`);

          input.user = authUser.id;
          return comment.update(input, {transaction: t});
        }).catch(handleError);
      });
    }),
    deleteComment: (parent, {id}, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
      id = parseInt(id);
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comments.findById(id).then((comment: CommentInstance) => {
          throwError(!comment, `Comment with id ${id} not found!`);
          throwError(comment.get("user") != authUser.id, `Unauthorized! You can only delete comment by yourself!`);

          return comment.destroy({transaction: t}).then(comment => !!comment);
        })
      }).catch(handleError);
    }
  }
}