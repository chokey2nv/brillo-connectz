import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { BuildSchemaOptions } from "type-graphql";

export default interface ConfigInterface {
  readonly env: "development" | "test" | "staging" | "production";
  frontEndLink: string;
  emailVerifyPath: string;
  resetPasswordPath: string;
  tokenExpiration: number;
  readonly email: {
    address?: string;
    pass?: string;
  };
  readonly sms: {
    infobipKey?: string;
    infobipBaseUrl?: string;
  };
  readonly database: SqliteConnectionOptions;
  readonly graphQLPath: string;
  readonly resolvers: BuildSchemaOptions["resolvers"];
  readonly secret: string;
}
