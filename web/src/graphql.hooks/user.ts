import {
  FetchResult,
  MutationFunctionOptions,
  useLazyQuery,
  useMutation,
} from "@apollo/client";

import { IInterest, IToken, IUser } from "graphql.queries/types";
import {
  graphCreateUser,
  graphGetProfile,
  graphLogin,
  graphResetPassword,
  graphUpdateUser,
} from "graphql.queries/user";
interface IUserReturnData {
  user: (keyof IUser)[];
  userToken: (keyof IToken)[];
  interests: (keyof IInterest)[];
}
const graphReturnedData: IUserReturnData = {
  user: [
    "email",
    "emailVerified",
    "id",
    "interests",
    "name",
    "phone",
    "emailVerified",
    "phoneVerified",
    "userToken",
  ],
  userToken: ["id", "token"],
  interests: ["id", "name"],
};
export interface IUserGraphQlActions {
  getProfile: (
    options: MutationFunctionOptions<{ user: IUser }>
  ) => Promise<FetchResult>;
  resetPassword: (
    options: MutationFunctionOptions<
      { user: IUser },
      { email: string; password: string }
    >
  ) => Promise<FetchResult>;
  createUser: (
    options: MutationFunctionOptions<{ user: IUser }, { user: Partial<IUser> }>
  ) => Promise<FetchResult>;
  updateUser: (
    options: MutationFunctionOptions<
      { user: IUser },
      { id: number; user: Partial<IUser> }
    >
  ) => Promise<FetchResult>;
  login: (
    options: MutationFunctionOptions<
      { user: IUser },
      { password: string; phone: string; email: string }
    >
  ) => Promise<FetchResult>;
}
export function useUser(): IUserGraphQlActions {
  const [getProfile] = useLazyQuery<{ user: IUser }>(
    graphGetProfile(graphReturnedData.user, {
      interests: graphReturnedData.interests,
      userToken: graphReturnedData.userToken,
    }),
    {
      fetchPolicy: "network-only",
    }
  );
  const [resetPassword] = useMutation<
    { user: IUser },
    { email: string; password: string }
  >(
    graphResetPassword(graphReturnedData.user, {
      interests: graphReturnedData.interests,
      userToken: graphReturnedData.userToken,
    })
  );
  const [createUser] = useMutation<{ user: IUser }, { user: Partial<IUser> }>(
    graphCreateUser(graphReturnedData.user, {
      interests: graphReturnedData.interests,
      userToken: graphReturnedData.userToken,
    })
  );
  const [updateUser] = useMutation<
    { user: IUser },
    { id: number; user: Partial<IUser> }
  >(
    graphUpdateUser(graphReturnedData.user, {
      userToken: graphReturnedData.userToken,
      interests: graphReturnedData.interests,
    })
  );
  const [login] = useMutation<
    { user: IUser },
    { password: string; email: string; phone: string }
  >(
    graphLogin(graphReturnedData.user, {
      interests: graphReturnedData.interests,
      userToken: graphReturnedData.userToken,
    })
  );
  return {
    getProfile,
    resetPassword,
    createUser,
    updateUser,
    login,
  };
}
