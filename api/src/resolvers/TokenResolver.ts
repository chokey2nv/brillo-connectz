import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { getRepository } from "typeorm";
import Koa from "koa";

import User from "../entities/User";
import Token from "../entities/Token";
import jwt from "jsonwebtoken";
import { sendSMS } from "../helpers/smsSender";
import config from "../config";
import { sendMail } from "../helpers/mailer";
import CallResponse from "../entities/Response";
@Resolver()
@Service()
export default class TokenResolver {
  @Mutation(() => CallResponse, {
    description: "Verify Recovery Password token",
    nullable: false,
  })
  async verifyRecoveryToken(
    @Arg("token", () => String) token: string
  ): Promise<CallResponse> {
    const tokenRepository = getRepository(Token);
    const foundToken = await tokenRepository.findOne({
      where: { emailLink: token },
    });
    if (!foundToken) throw new Error("Invalid or expired token");
    //expire token once used
    tokenRepository.update(foundToken.id, { emailLink: undefined });
    return {
      data: "Verified",
    };
  }
  @Mutation(() => CallResponse, {
    description: "Send Recovery link to email",
    nullable: false,
  })
  async sendRecoveryLink(
    @Arg("email", () => String) email: string
  ): Promise<CallResponse> {
    const userRepository = getRepository(User);
    const tokenRepository = getRepository(Token);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new Error("This account does not exist!");
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const link = `${config.frontEndLink}${config.resetPasswordPath}/${randomNumber}`;
    sendMail(
      email,
      "BrilloConnectz Recovery",
      `Hi ${user.name}, use this link to reset your password <a href='${link}'>${link}</a>`
    );
    console.log("################# EMAIL RECOVER TOKEN #####################");
    console.log(`################# ${randomNumber} #####################`);
    if (!user.tokenId)
      throw new Error("Problem updating token for verification");
    await tokenRepository.update(user.tokenId, {
      emailLink: randomNumber.toString(),
    });
    setTimeout(() => {
      tokenRepository.update(user.tokenId as number, { emailLink: undefined });
    }, config.tokenExpiration);
    return {
      data: "SENT",
    };
  }
  @Mutation(() => CallResponse, {
    description: "Verify Phone Token",
    nullable: false,
  })
  async verifyPhoneToken(
    @Arg("token", () => String) token: string,
    @Ctx() ctx: Koa.Context
  ): Promise<CallResponse> {
    if (!ctx.user) throw new Error("Unauthorized");
    const user = ctx.user as User;
    const tokenRepository = getRepository(Token);
    const userRepository = getRepository(User);
    const existingToken = await tokenRepository.findOne(
      {},
      { where: { phoneToken: token } }
    );
    const resp: CallResponse = {
      data: token.toString(),
      error: true,
    };
    if (!existingToken) {
      resp.data = "";
      resp.error = true;
      return resp;
    }
    await userRepository.update(user.id, { phoneVerified: true });
    await tokenRepository.update(existingToken.id, { phoneToken: undefined });
    return resp;
  }
  @Mutation(() => CallResponse, {
    description: "Verify Email Link",
    nullable: false,
  })
  async verifyEmailLink(
    @Arg("link", () => String) link: string
  ): Promise<CallResponse> {
    const tokenRepository = getRepository(Token);
    const userRepository = getRepository(User);
    const token = await tokenRepository.findOne(
      {},
      { where: { emailLink: link } }
    );
    const resp: CallResponse = {
      data: link.toString(),
      error: false,
    };
    if (!token) {
      throw new Error("Invalid link with token " + link);
    }
    await userRepository.update(token.userId, { emailVerified: true });
    await tokenRepository.update(token.id, { emailLink: undefined });
    return resp;
  }
  @Mutation(() => CallResponse, {
    description: "Send Email Verification Link",
    nullable: true,
  })
  async sendVerificationEmail(
    @Arg("email", () => String) email: string
  ): Promise<CallResponse> {
    const userRepository = getRepository(User);
    const tokenRepository = getRepository(Token);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new Error("E-mail doesn't exist for any profile");
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const link = new URL(
      `${config.frontEndLink}${config.emailVerifyPath}/${randomNumber}`
    );
    await sendMail(
      email,
      "BrilloConnectz Verification",
      `Hi ${user.name}, use this verification link <a href='${link}'>${link}</a>`
    );
    console.log("################# EMAIL TOKEN #####################");
    console.log(`################# ${randomNumber} #####################`);
    await tokenRepository.update(user.tokenId as number, {
      emailLink: randomNumber.toString(),
    });
    setTimeout(() => {
      tokenRepository.update(user.tokenId as number, { emailLink: undefined });
    }, config.tokenExpiration);
    return {
      data: "SENT",
      error: false,
    };
  }
  @Mutation(() => CallResponse, {
    description: "Send SMS to Phone",
    nullable: true,
  })
  async sendSMSToken(
    @Arg("phone", () => String) phone: number
  ): Promise<CallResponse> {
    const userRepository = getRepository(User);
    const tokenRepository = getRepository(Token);
    const user = await userRepository.findOne({ where: { phone } });
    if (!user) throw new Error("Phone number doesn't exist for any profile");
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    await sendSMS(
      phone.toString(),
      `Brillo-Connectz - verify with this code ${randomNumber}`
    );
    console.log("################# PHONE OTP #####################");
    console.log(`################# ${randomNumber} #####################`);
    await tokenRepository.update(user.tokenId as number, {
      phoneToken: randomNumber,
    });
    setTimeout(() => {
      tokenRepository.update(user.tokenId as number, { phoneToken: undefined });
    }, config.tokenExpiration);
    return { data: "SENT", error: false } as CallResponse;
  }
  @Query(() => Token, { description: "Get User Token", nullable: true })
  async getUserToken(@Arg("id", () => ID) id: number): Promise<Token> {
    const userRepository = getRepository(User);
    const tokenRepository = getRepository(Token);
    const user = await userRepository.findOne(id);
    if (!user) throw new Error("User not found");
    let userToken = await tokenRepository.findOne({ relations: ["user"] });
    if (!userToken) {
      const newUserToken = tokenRepository.create({
        token: jwt.sign(user, config.secret),
        user,
      });
      userToken = await tokenRepository.save(newUserToken);
    }
    return userToken;
  }
}
