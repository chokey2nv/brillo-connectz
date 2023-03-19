import { gql } from "@apollo/client";
import { IQueryArray, NestedUserObject, IUser, IToken } from "./types";

function queryStringBuilder(
  query: (keyof IUser)[] | IQueryArray,
  nestedValues?: NestedUserObject
) {
  let queryString = "";
  for (let i = 0; i < query.length; i++) {
    const element = query[i];
    if (nestedValues?.[element as keyof NestedUserObject]) {
      queryString += `${element} { ${queryStringBuilder(
        nestedValues[element as keyof NestedUserObject] as IQueryArray,
        nestedValues
      )} }`;
    } else queryString += `${element} `;
  }
  return queryString;
}

export const graphResetPassword = (
  user?: (keyof IUser)[],
  nestedValues?: NestedUserObject
) => {
  const query = user ? queryStringBuilder(user, nestedValues) : "id";
  return gql`
    mutation resetPassword($email: String!, $password: String!) {
        user : resetPassword(email: $email, password: $password) {
            ${query}
        }
    }`;
};
export const graphGetUserToken = (
  user?: (keyof IToken)[],
  nestedValues?: NestedUserObject
) => {
  const query = user ? queryStringBuilder(user, nestedValues) : "id";
  return gql`
    query getUserToken($id: Int) {
        token : getUserToken(id: $id) {
            ${query}
        }
    }`;
};
//d
export const graphGetProfile = (
  user?: (keyof IUser)[],
  nestedValues?: NestedUserObject
) => {
  const query = user ? queryStringBuilder(user, nestedValues) : "id";
  return gql`
    query getProfile {
      user: getProfile {
        ${query}
      }
    }`;
};
export const graphGetUser = (
  user?: (keyof IUser)[],
  nestedValues?: NestedUserObject
) => {
  const query = user ? queryStringBuilder(user, nestedValues) : "id";
  return gql`
    query getUser($id: Int) {
        user : getUser(id: $id) {
            ${query}
        }
    }`;
};
export const graphUpdateUser = (
  user?: (keyof IUser)[],
  nestedValues?: NestedUserObject
) => {
  const query = user ? queryStringBuilder(user, nestedValues) : "id";
  return gql`
    mutation updateUser($id: ID!, $user: UserUpdateInput!) {
        user : updateUser(id: $id, user: $user) {
            ${query}
        }
    }`;
};
export const graphCreateUser = (
  user?: (keyof IUser)[],
  nestedValues?: NestedUserObject
) => {
  const query = user ? queryStringBuilder(user, nestedValues) : "id";
  return gql`
    mutation createUser($user: UserInput!) {
        user : createUser(user: $user) {
            ${query}
        }
    }`;
};
export const graphLogin = (
  user?: (keyof IUser)[],
  nestedValues?: NestedUserObject
) => {
  const query = user ? queryStringBuilder(user, nestedValues) : "id";
  return gql`
    mutation login($password: String!, $phone: String, $email: String) {
        user : login(password: $password, phone: $phone, email: $email) {
            ${query}
        }
    }`;
};
