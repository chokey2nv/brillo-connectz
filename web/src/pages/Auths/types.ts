import { IUser } from "graphql.queries/types";

export type IFormLogin = Partial<IUser>;

export interface IFormSignUp extends Partial<Omit<IUser, "interests">> {
  interests: string[];
}
