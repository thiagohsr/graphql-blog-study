"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils/utils");
exports.postResolvers = {
    Post: {
        author: (parent, { id }, { db }, info) => {
            return db.User
                .findById(parent.get("author")).catch(utils_1.handleError);
        },
        comments: (parent, { first = 10, offset = 0 }, { db }, info) => {
            return db.Comments.findAll({
                where: { post: parent.get("id") },
                limit: first,
                offset: offset
            }).catch(utils_1.handleError);
        }
    },
    Query: {
        posts: (parent, { first = 10, offset = 0 }, { db }, info) => {
            return db.Post.findAll({
                limit: first,
                offset: offset
            }).catch(utils_1.handleError);
        },
        post: (parent, { id }, { db }, info) => {
            id = parseInt(id);
            return db.Post
                .findById(id)
                .then((post) => {
                if (!post)
                    throw new Error(`Post with id ${id} not found!`);
                return post;
            }).catch(utils_1.handleError);
        }
    },
    Mutation: {
        createPost: (parent, { input }, { db }, info) => {
            return db.sequelize.transaction((t) => {
                return db.Post.create(input, { transaction: t });
            }).catch(utils_1.handleError);
        },
        updatePost: (parent, { id, input }, { db }, info) => {
            id = parseInt(id);
            return db.sequelize.transaction((t) => {
                return db.Post
                    .findById(id)
                    .then((post) => {
                    if (!post)
                        throw new Error(`Post with id ${id} not found!`);
                    return post.update(input, { transaction: t });
                });
            }).catch(utils_1.handleError);
        },
        deletePost: (parent, { id, input }, { db }, info) => {
            id = parseInt(id);
            return db.sequelize.transaction((t) => {
                return db.Post
                    .findById(id)
                    .then((post) => {
                    if (!post)
                        throw new Error(`Post with id ${id} not found!`);
                    return post.destroy({ transaction: t }).then(post => !!post);
                });
            }).catch(utils_1.handleError);
        }
    }
};
