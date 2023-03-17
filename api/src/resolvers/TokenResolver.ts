import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { getRepository } from "typeorm";

import User from "../entities/User";
import Token from "../entities/Token";
import jwt from "jsonwebtoken";
import { sendSMS } from "../helpers/smsSender";
import config from "../config";
import { MyContext } from "../helpers/createApolloServer";
import { sendMail } from "../helpers/mailer";
import CallResponse from "../entities/Response";
const secret = "hide_this_secret";
@Resolver()
@Service()
export default class TokenResolver {
  @Mutation(() => CallResponse, {
    description: "Verify Phone Token",
    nullable: false,
  })
  async verifyPhoneToken(
    @Arg("token", () => String) token: string
  ): Promise<CallResponse> {
    const tokenRepository = getRepository(Token);
    const existingToken = tokenRepository.findOne(
      {},
      { where: { phoneToken: token } }
    );
    const resp: CallResponse = {
      data: false,
    };
    if (!existingToken) {
      resp.data = true;
      return resp;
    }
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
    const token = tokenRepository.findOne({}, { where: { emailLink: link } });
    const resp: CallResponse = {
      data: false,
    };
    if (!token) {
      resp.data = true;
      return resp;
    }
    return resp;
  }
  @Mutation(() => CallResponse, {
    description: "Send Email Verification Link",
    nullable: true,
  })
  async sendVerificationEmail(
    @Ctx() { userId }: MyContext,
    @Arg("email", () => String) email: string
  ): Promise<CallResponse> {
    const userRepository = getRepository(User);
    const tokenRepository = getRepository(Token);
    const user = await userRepository.findOne({}, { where: { email } });
    if (!user) throw new Error("E-mail doesn't exist for any profile");
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const link = `${config.front_end_link}/email/verify/${randomNumber}`;
    await sendMail(
      email,
      "BrilloConnectz Verification",
      `Hi ${user.name}, use this verification link <a href='${link}'>${link}</a>`
    );
    await tokenRepository.update(user.tokenId as number, { emailLink: link });
    setTimeout(() => {
      tokenRepository.update(user.tokenId as number, { emailLink: undefined });
    }, config.tokenExpiration);
    return {
      data: true,
    };
  }
  @Mutation(() => CallResponse, {
    description: "Send SMS to Phone",
    nullable: true,
  })
  async sendSMSToken(
    @Arg("number", () => String) phone: number
  ): Promise<CallResponse> {
    const userRepository = getRepository(User);
    const tokenRepository = getRepository(Token);
    const user = await userRepository.findOne({}, { where: { phone } });
    if (!user) throw new Error("Phone number doesn't exist for any profile");
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    await sendSMS(
      phone.toString(),
      `BrilloConnectz - verify with this code ${randomNumber}`
    );
    await tokenRepository.update(user.tokenId as number, {
      phoneToken: randomNumber,
    });
    setTimeout(() => {
      tokenRepository.update(user.tokenId as number, { phoneToken: undefined });
    }, config.tokenExpiration);
    return { data: true } as CallResponse;
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
        token: jwt.sign(user, secret),
        user,
      });
      userToken = await tokenRepository.save(newUserToken);
    }
    return userToken;
  }
}
