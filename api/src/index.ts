import Koa from "koa";
import "reflect-metadata";
import bodyParser from "koa-bodyparser";

import config from "./config";
import createApolloServer, {
  authMiddleware,
} from "./helpers/createApolloServer";
import { getConnection } from "./helpers/database";

const PORT = process.env.PORT || 8000;
const app = new Koa();
app.use(bodyParser());
// Add middleware to extract the JWT and add the user object to the request object
app.use(authMiddleware);

const apolloServer = createApolloServer({ introspection: true });

(async () => {
  await getConnection();
  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: config.graphQLPath });
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${PORT}`);
  });
})();
