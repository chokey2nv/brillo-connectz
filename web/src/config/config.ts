export const appConfig: Readonly<IAppConfig> = {
  localStorageTokenAlias: "brillo_connetz_token",
  endpoint: "http://localhost:8000/graphql",
};
interface IAppConfig {
  localStorageTokenAlias: string;
  endpoint: string;
}
