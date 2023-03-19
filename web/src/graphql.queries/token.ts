import { gql } from "@apollo/client";
import { ICallResponse } from "./types";

export const graphSendRecoveryLink = (query?: (keyof ICallResponse)[]) => {
  return gql`
    mutation sendRecoveryLink($email: String!) {
        result : sendRecoveryLink(email: $email) {
            ${query || "data"}
        }
    }`;
};
export const graphVerifyEmailLink = (query?: (keyof ICallResponse)[]) => {
  return gql`
    mutation verifyEmailLink($link: String!) {
        result : verifyEmailLink(link: $link) {
            ${query || "data"}
        }
    }`;
};
export const graphVerifyRecoveryToken = (query?: (keyof ICallResponse)[]) => {
  return gql`
    mutation verifyRecoveryToken($token: String!) {
        result : verifyRecoveryToken(token: $token) {
            ${query || "data"}
        }
    }`;
};
export const graphVerifyPhoneToken = (query?: (keyof ICallResponse)[]) => {
  return gql`
    mutation verifyPhoneToken($token: String!) {
        result : verifyPhoneToken(token: $token) {
            ${query || "data"}
        }
    }`;
};
export const graphSendVerificationEmail = (query?: (keyof ICallResponse)[]) => {
  return gql`
    mutation sendVerificationEmail($email: String!) {
        result : sendVerificationEmail(email: $email) {
            ${query || "data"}
        }
    }`;
};
export const graphSendSMSToken = (query?: (keyof ICallResponse)[]) => {
  return gql`
    mutation sendSMSToken($phone: String!) {
        result : sendSMSToken(phone: $phone) {
            ${query || "data"}
        }
    }`;
};
