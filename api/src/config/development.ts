import path from "path";
import ConfigInterface from "./ConfigInterface";

const config: ConfigInterface = {
  env: "development",
  secret: "hide_this_secret",
  frontEndLink: "http://localhost:3000",
  emailVerifyPath: "/email/verify",
  resetPasswordPath: "/pass/recovery",
  tokenExpiration: 5 * 1000 * 60,
  email: {
    address: process.env.EMAIL,
    pass: process.env.PASS,
  },
  sms: {
    infobipKey: process.env.INFOBIP_API_KEY,
    infobipBaseUrl: process.env.INFOBIP_BASE_URL,
  },
  database: {
    type: "sqlite" as const,
    cache: false,
    database: ":memory:",
    dropSchema: true,
    entities: ["src/entities/*.ts"],
    logger: "advanced-console" as const,
    synchronize: true,
  },
  graphQLPath: "/graphql",
  resolvers: [path.join(__dirname, "../resolvers/**/*Resolver.ts")],
};

export default config;
