import User from "../entities/User";
import UserResolver from "../resolvers/UserResolver";
import jwt from 'jsonwebtoken';
import config from "../config";

//perform authentication of token
export const authorize = async (
  authorization?: string
): Promise<User | undefined | null> => {
  const token = authorization?.split(" ")[1];
  if (token) {
    try {
      const decodedToken = jwt.verify(token, config.secret) as User;
      const userId = decodedToken.id;
      const userResolve = new UserResolver();
      const user = await userResolve.getUser(userId);
      // console.log(user);
      return user;
    } catch (err) {
      console.log(err);
    }
  }
  return null;
};