import * as express from "express";
import  * as graqhqlHTTP from "express-graphql";
import graphqlHTTP = require("express-graphql");
import schema from "./graphql/schema";
import db from "./models";
import { extractJwtMiddleware } from "./middlewares/extract-jwt.middleware";

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
  }

  private middleware(): void {
    this.express.use("/hello", (req:express.Request, res: express.Response, next: express.NextFunction) => {
      res.send({
        hello: "Hello world!"
      })
    });

    this.express.use("/graphql",
      extractJwtMiddleware(),
      (req, res, next) => {
        req["context"]["db"] = db;
        next();
      },
      graphqlHTTP(req => ({
        schema: schema,
        graphiql: process.env.NODE_ENV === "development",
        context: req["context"]
      }))
    );

  }
}

export default new App().express;