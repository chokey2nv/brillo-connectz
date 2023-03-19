import { Arg, Ctx, ID, Int, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { getRepository } from "typeorm";
import { UserInput, UserUpdateInput } from "../entities/User";
import jwt from "jsonwebtoken";
import User from "../entities/User";
import Interest from "../entities/Interests";
import Token from "../entities/Token";
import config from "../config";
import bcrypt from "bcrypt";
import Koa from "koa";
@Resolver()
@Service()
export default class UserResolver {
  @Mutation(() => User, {
    description: "Update user info",
    nullable: true,
  })
  async updateUser(
    @Arg("id", () => ID) id: number,
    @Arg("user", () => UserUpdateInput) user: User
  ): Promise<User | undefined> {
    const userRepository = getRepository(User);
    if (user.password)
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
    await userRepository.update(id, user);
    return userRepository.findOne(id);
  }
  @Mutation(() => User, {
    description: "Reset Password",
    nullable: false,
  })
  async resetPassword(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string
  ): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new Error("This account does not exist!");
    await userRepository.update(user.id, {
      password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
    });
    return user;
  }
  @Query(() => User, { description: "Get A User by ID", nullable: true })
  async getProfile(@Ctx() ctx: Koa.Context): Promise<User | undefined> {
    return ctx.user;
  }
  @Query(() => User, { description: "Get A User by ID", nullable: true })
  async getUser(@Arg("id", () => Int) id: number): Promise<User | undefined> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      relations: ["userToken"],
      where: { id },
    });
    // console.log(user);
    if (user?.interestIds) {
      user.interests = await getRepository(Interest).findByIds(
        user?.interestIds?.split(",")
      );
    }
    return user;
  }
  @Mutation(() => User, { description: "Create A User" })
  async createUser(
    @Arg("user", () => UserInput) user: UserInput
  ): Promise<User> {
    const userRepository = getRepository(User);
    const interestRepo = getRepository(Interest);
    const tokenRepository = getRepository(Token);
    const interests = user.interests;
    const createdInterests: Interest[] = [];
    const existEmail = await userRepository.findOne(
      {},
      { where: { email: user.email } }
    );
    if (existEmail) throw new Error("User with email already exists");
    const existPhone = await userRepository.findOne(
      {},
      { where: { phone: user.phone } }
    );
    if (existPhone) throw new Error("User with phone already exists");
    //hash password
    user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync());

    //create interest in table or find id if existing
    if (interests) {
      for (let i = 0; i < interests.length; i++) {
        const interest = interests[i];
        let savedInterest = await interestRepo.findOne(
          {},
          { where: { name: interest } }
        );
        if (!savedInterest) {
          const createdInterest = interestRepo.create({
            name: interest,
          });
          savedInterest = await interestRepo.save(createdInterest);
          createdInterests.push(savedInterest);
        }
      }
    }

    // create user entity
    const createdUser = userRepository.create({
      ...user,
      interests: [],
      interestIds: createdInterests?.map((i) => i.id).join(","),
    });
    //save user
    const savedUser = await userRepository.save(createdUser);
    //create signed token for user session
    const jwtToken = jwt.sign(
      { ...savedUser, interests: JSON.stringify(savedUser.interests) },
      config.secret
    );
    //create token entity
    const newUserToken = tokenRepository.create({
      token: jwtToken,
      user: savedUser,
      userId: savedUser.id,
    });
    // save token
    const userToken = await tokenRepository.save(newUserToken);
    //update token with user id
    userRepository.update(savedUser.id, { userToken, tokenId: userToken.id }); //only for sqlite3
    return { ...savedUser, interests: createdInterests, userToken };
  }
  @Mutation(() => User, { description: "Login A User" })
  async login(
    @Arg("email", () => String, { nullable: true }) email: string,
    @Arg("phone", () => String, { nullable: true }) phone: string,
    @Arg("password", () => String) password: string
  ): Promise<User | undefined> {
    const userRepository = getRepository(User);
    let user: User | undefined;
    console.log(await userRepository.find());
    if (email) user = await userRepository.findOne({ where: { email } });
    else if (phone) user = await userRepository.findOne({ where: { phone } });
    console.log(user);
    if (!user) throw new Error("User with this details not found");
    if (!bcrypt.compareSync(password, user.password))
      throw new Error("Wrong login credential");
    return this.getUser(user.id);
  }
}
