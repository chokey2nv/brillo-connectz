import { gql } from "@apollo/client";
import {ICallResponse } from "./types";

export const graphVerifyEmailLink = (query?: (keyof ICallResponse)[]) => {
  return gql`
    mutation verifyEmailLink($token: String) {
        token : verifyEmailLink(token: $token) {
            ${query || "data"}
        }
    }`;
};
export const graphVerifyPhoneToken = (query?: (keyof ICallResponse)[]) => {
  return gql`
    mutation verifyPhoneToken($token: String) {
        token : verifyPhoneToken(token: $token) {
            ${query || "data"}
        }
    }`;
};
export const graphSendVerificationEmail = (query?: (keyof ICallResponse)[]) => {
  return gql`
    mutation sendVerificationEmail($email: String) {
        sendEmail : sendVerificationEmail(email: $token) {
            ${query || "data"}
        }
    }`;
};
export const graphSendSMSToken = (query?: (keyof ICallResponse)[]) => {
  return gql`
    mutation sendSMSToken($number: String) {
        sendSMS : sendSMSToken(number: $token) {
            ${query || "data"}
        }
    }`;
};
