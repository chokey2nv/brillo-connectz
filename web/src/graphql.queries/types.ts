export interface IUser {
  name: string;
  email: string;
  phone: string;

  id?: number;
  password?: string;
  emailVerified?: string;
  phoneVerified?: string;
  tokenId?: number;
  interestIds?: string;
  token?: IToken;
  interests?: IInterest[];
}

export interface IToken {
  id: number;
  token: string;
  userId?: number;
}

export interface IInterest {
  id: number;
  name: string;
}

export type IQueryArray = (keyof (IToken & IInterest))[];

export interface NestedUserObject {
  token?: (keyof IToken)[];
  interests?: (keyof IInterest)[];
}

export interface ICallResponse {
  data?: boolean;
}
