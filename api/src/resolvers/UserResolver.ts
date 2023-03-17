import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { getRepository } from "typeorm";
import { UserInput } from "../entities/User";
import jwt from "jsonwebtoken";
import User from "../entities/User";
import Interest from "../entities/Interests";
import Token from "../entities/Token";
import config from "../config";
import bcrypt from "bcrypt";

@Resolver()
@Service()
export default class UserResolver {
  @Query(() => User, { description: "Get A User by ID", nullable: true })
  async getUser(@Arg("id", () => Int) id: number): Promise<User | undefined> {
    const userRepository = getRepository(User);
    // console.table(await userRepository.find());
    // console.table(await getRepository(Token).find());
    const user = await userRepository.findOne({
      relations: ["token"],
      where: { id },
    });
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
      // interests: createdInterests,
      interests: [],
      interestIds: createdInterests?.map((i) => i.id).join(","),
      // tokenId: token.id,
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
      userId: savedUser.id,
    });
    // save token
    const token = await tokenRepository.save(newUserToken);
    //update token with user id
    userRepository.update(savedUser.id, { tokenId: token.id });
    return { ...savedUser, interests: createdInterests, token };
  }
  @Mutation(() => User, { description: "Login A User" })
  async login(
    @Arg("email", () => String) email: string,
    @Arg("phone", () => String) phone: string,
    @Arg("password", () => String) password: string
  ): Promise<User | undefined> {
    const userRepository = getRepository(User);
    let user: User | undefined;
    if (email) user = await userRepository.findOne({}, { where: { email } });
    else if (phone)
      user = await userRepository.findOne({}, { where: { phone } });
    if (!user) throw new Error("User with this details not found");
    if (!bcrypt.compare(password, user.password))
      throw new Error("Wrong login credential");
    return this.getUser(user.id);
  }
}
