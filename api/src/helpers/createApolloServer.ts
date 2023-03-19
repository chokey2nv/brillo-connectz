import { ApolloServer, Config as ApolloServerConfig } from "apollo-server-koa";

import { createSchema } from "./createSchema";
import { authorize } from "./authentication";

export default function createApolloServer(
  apolloServerConfig?: ApolloServerConfig
) {
  const apolloServer = new ApolloServer({
    debug: true,
    schema: createSchema(),
    context: async ({
      ctx: {
        request: {
          header: { authorization },
        },
      },
    }) => {
      return {
        user: await authorize(authorization),
      };
    },
    ...apolloServerConfig,
  });

  return apolloServer;
}
