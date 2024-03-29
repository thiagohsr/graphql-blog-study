import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { UserInstance } from "../../../models/UserModel";
import { Transaction } from "sequelize";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUser } from "../../../interfaces/AuthUserInterfaces";

export const userResolvers = {
  User: {
    posts: (parent, { first = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      return db.Post.findAll({
        where: { author: parent.get("id") },
        limit: first,
        offset: offset
      }).catch(handleError);
    }
  },
  Query: {
    users: (parent, { first = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      return db.User.findAll({
        limit: first,
        offset: offset
      }).catch(handleError);
    },
    user: compose(...authResolvers)((parent, { id }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      id = parseInt(id)
      return db.User.findById(id).then((user: UserInstance) => {
        if(!user) throw new Error(`User with id ${id} not found!`);
        return user;
      }).catch(handleError);
    }),
    currentUser: compose(...authResolvers)((parent, {input }, { db, authUser }: { db: DbConnection, authUser:AuthUser }, info: GraphQLResolveInfo) => {
      return db.User.findById(authUser.id).then((user: UserInstance) => {
        throwError(!user, `User with id ${authUser.id} not found!`);
        return user;
      }).catch(handleError);
    }),
  },
  Mutation: {
    createUser: (parent, args, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      return db.sequelize.transaction((t: Transaction) => {
        return db.User
          .create(args.input, { transaction: t });
      }).catch(handleError);
    },
    updateUser: compose(...authResolvers)((parent, {input }, { db, authUser }: { db: DbConnection, authUser:AuthUser }, info: GraphQLResolveInfo) => {
      return db.sequelize.transaction((t: Transaction) => {
        return db.User.findById(authUser.id).then((user: UserInstance) => {
          throwError(!user, `User with id ${authUser.id} not found!`);

          return user.update(input, { transaction: t });
        });
      }).catch(handleError);
    }),
    updateUserPassword: compose(...authResolvers)(
      (
        parent,
        { input }, {db, authUser}: {db: DbConnection, authUser: AuthUser},
        info:GraphQLResolveInfo
      ) => {
        return db.sequelize.transaction((t: Transaction) => {
          return db.User
            .findById(authUser.id)
            .then((user:UserInstance) => {
              throwError(!user, `User with id ${authUser.id} not found!`);
              return user.update(input, {transaction: t}).then(user => !!user);
            })
        })
      }
    ),
    deleteUser: compose(...authResolvers)(
      (
        parent,
        args,
        { db, authUser }: { db: DbConnection, authUser: AuthUser },
        info: GraphQLResolveInfo
      ) => {
      return db.sequelize.transaction((t: Transaction) => {
        return db.User.findById(authUser.id).then((user: UserInstance) => {
          throwError(!user, `User with id ${authUser.id} not found!`);
          return user.destroy({ transaction: t }).then(user => !!user);
        })
      }).catch(handleError);
    })
  }
}