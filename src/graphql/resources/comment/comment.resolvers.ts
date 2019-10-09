import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { Transaction } from "sequelize";
import { CommentInstance } from "../../../models/CommentModel";
import { handleError } from "../../../utils/utils";

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
    createComment: (parent, {input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comments.create(input, { transaction: t});
      }).catch(handleError);
    },
    updateComment: (parent, {id, input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
      id = parseInt(id);
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comments.findById(id).then((comment: CommentInstance) => {
          if(!id) throw new Error(`Comment with id ${id} not found!`);
          return comment.update(input, {transaction: t});
        }).catch(handleError);
      });
    },
    deleteComment: (parent, {id, input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
      id = parseInt(id);
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comments.findById(id).then((comment: CommentInstance) => {
          if(!id) throw new Error(`Comment with id ${id} not found!`);
          return comment.destroy({transaction: t}).then(comment => !!comment);
        })
      }).catch(handleError);
    }
  }
}