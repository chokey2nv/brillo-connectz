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

export const graphGetUserToken = (
  user?: (keyof IToken)[],
  nestedValues?: NestedUserObject
) => {
  const query = user ? queryStringBuilder(user, nestedValues) : "id";
  return gql`
    query getUserToken($id: Int) {
        token : getUserToken(_id: $id) {
            ${query}
        }
    }`;
};
//d
export const graphGetUser = (
  user?: (keyof IUser)[],
  nestedValues?: NestedUserObject
) => {
  const query = user ? queryStringBuilder(user, nestedValues) : "id";
  return gql`
    query getUser($id: Int) {
        user : getUser(_id: $id) {
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
    mutation updateUser($id: Int, $user: UserInput) {
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
    mutation createUser($user: UserInput) {
        user : createUser(user: $user) {
            ${query}
        }
    }`;
};
export const login = (
  user?: (keyof IUser)[],
  nestedValues?: NestedUserObject
) => {
  const query = user ? queryStringBuilder(user, nestedValues) : "id";
  return gql`
    mutation login($password: String, $phone: String, $email: String) {
        login : login(password: $password, phone: $phone, email: $email) {
            ${query}
        }
    }`;
};
