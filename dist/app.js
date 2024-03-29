"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema_1 = require("./graphql/schema");
const models_1 = require("./models");
const extract_jwt_middleware_1 = require("./middlewares/extract-jwt.middleware");
class App {
    constructor() {
        this.express = express();
        this.middleware();
    }
    middleware() {
        this.express.use("/hello", (req, res, next) => {
            res.send({
                hello: "Hello world!"
            });
        });
        this.express.use("/graphql", extract_jwt_middleware_1.extractJwtMiddleware(), (req, res, next) => {
            req["context"]["db"] = models_1.default;
            next();
        }, graphqlHTTP(req => ({
            schema: schema_1.default,
            graphiql: process.env.NODE_ENV === "development",
            context: req["context"]
        })));
    }
}
exports.default = new App().express;
