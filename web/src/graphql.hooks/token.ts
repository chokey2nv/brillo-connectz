import {
  FetchResult,
  MutationFunctionOptions,
  useMutation,
} from "@apollo/client";
import {
  graphSendRecoveryLink,
  graphSendSMSToken,
  graphSendVerificationEmail,
  graphVerifyEmailLink,
  graphVerifyPhoneToken,
  graphVerifyRecoveryToken,
} from "graphql.queries/token";

import { ICallResponse } from "graphql.queries/types";

export interface ITokenGraphQlActions {
  verifyEmailLink: (
    options: MutationFunctionOptions<
      { result: ICallResponse },
      { link: string }
    >
  ) => Promise<FetchResult>;
  verifyPhoneToken: (
    options: MutationFunctionOptions<
      { result: ICallResponse },
      { token: string }
    >
  ) => Promise<FetchResult>;
  verifyRecoveryToken: (
    options: MutationFunctionOptions<
      { result: ICallResponse },
      { token: string }
    >
  ) => Promise<FetchResult>;
  sendRecoveryLink: (
    options: MutationFunctionOptions<
      { result: ICallResponse },
      { email: string }
    >
  ) => Promise<FetchResult>;
  sendVerificationEmail: (
    options: MutationFunctionOptions<
      { result: ICallResponse },
      { email: string }
    >
  ) => Promise<FetchResult>;
  sendSMSToken: (
    options: MutationFunctionOptions<
      { result: ICallResponse },
      { phone: string }
    >
  ) => Promise<FetchResult>;
}
export function useToken(): ITokenGraphQlActions {
  const [verifyEmailLink] = useMutation<
    { result: ICallResponse },
    { link: string }
  >(graphVerifyEmailLink(["data"]));
  const [verifyRecoveryToken] = useMutation<
    { result: ICallResponse },
    { token: string }
  >(graphVerifyRecoveryToken(["data"]));
  const [verifyPhoneToken] = useMutation<
    { result: ICallResponse },
    { token: string }
  >(graphVerifyPhoneToken(["data"]));
  const [sendRecoveryLink] = useMutation<
    { result: ICallResponse },
    { email: string }
  >(graphSendRecoveryLink(["data"]));
  const [sendVerificationEmail] = useMutation<
    { result: ICallResponse },
    { email: string }
  >(graphSendVerificationEmail(["data"]));
  const [sendSMSToken] = useMutation<
    { result: ICallResponse },
    { phone: string }
  >(graphSendSMSToken(["data"]));
  return {
    verifyRecoveryToken,
    verifyEmailLink,
    verifyPhoneToken,
    sendRecoveryLink,
    sendVerificationEmail,
    sendSMSToken,
  };
}
