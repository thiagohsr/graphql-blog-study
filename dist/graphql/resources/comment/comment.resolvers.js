"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils/utils");
const composable_resolver_1 = require("../../composable/composable.resolver");
const auth_resolver_1 = require("../../composable/auth.resolver");
exports.commentResolvers = {
    Comment: {
        user: (parent, { first = 10, offset = 0 }, { db }, info) => {
            return db.User.findById(parent.get("user")).catch(utils_1.handleError);
        },
        post: (parent, { first = 10, offset = 0 }, { db }, info) => {
            return db.Post.findById(parent.get("post")).catch(utils_1.handleError);
        },
    },
    Query: {
        commentsByPost: (parent, { postId, first = 10, offset = 0 }, { db }, info) => {
            postId = parseInt(postId);
            return db.Comments.findAll({
                where: { post: postId }
            }).catch(utils_1.handleError);
        }
    },
    Mutation: {
        createComment: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { input }, { db, authUser }, info) => {
            input.user = authUser.id;
            return db.sequelize.transaction((t) => {
                return db.Comments.create(input, { transaction: t });
            }).catch(utils_1.handleError);
        }),
        updateComment: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { id, input }, { db, authUser }, info) => {
            id = parseInt(id);
            return db.sequelize.transaction((t) => {
                return db.Comments.findById(id).then((comment) => {
                    utils_1.throwError(!comment, `Comment with id ${id} not found!`);
                    utils_1.throwError(comment.get("user") != authUser.id, `Unauthorized! You can only edit comment by yourself!`);
                    input.user = authUser.id;
                    return comment.update(input, { transaction: t });
                }).catch(utils_1.handleError);
            });
        }),
        deleteComment: (parent, { id }, { db, authUser }, info) => {
            id = parseInt(id);
            return db.sequelize.transaction((t) => {
                return db.Comments.findById(id).then((comment) => {
                    utils_1.throwError(!comment, `Comment with id ${id} not found!`);
                    utils_1.throwError(comment.get("user") != authUser.id, `Unauthorized! You can only delete comment by yourself!`);
                    return comment.destroy({ transaction: t }).then(comment => !!comment);
                });
            }).catch(utils_1.handleError);
        }
    }
};
