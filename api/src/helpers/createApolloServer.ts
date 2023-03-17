import Koa, { Middleware } from "koa";
import { ApolloServer, Config as ApolloServerConfig } from "apollo-server-koa";

import { createSchema } from "./createSchema";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { Token } from "graphql";
import User from "../entities/User";
import UserResolver from "../resolvers/UserResolver";

export interface MyContext extends Koa.Context {
  userId?: number;
}

export default function createApolloServer(
  apolloServerConfig?: ApolloServerConfig
) {
  const apolloServer = new ApolloServer({
    debug: true,
    schema: createSchema(),
    // context: ({ req }) => ({ userId: req.userId }),
    ...apolloServerConfig,
  });

  return apolloServer;
}

// Custom middleware that sets the userId on the request object
export const authMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  const token = ctx.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decodedToken = jwt.verify(token, config.secret) as User;
      const userId = decodedToken.id;
      const userResolve = new UserResolver();
      const user = await userResolve.getUser(userId);
      if (user) {
        (ctx as MyContext).userId = user.id;
      }
    } catch (err) {
      console.log(err);
    }
  }
  await next();
};
