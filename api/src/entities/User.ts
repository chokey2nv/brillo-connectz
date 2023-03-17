import { Field, ObjectType, InputType, ID } from "type-graphql";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";

import Interest from "./Interests";
import Token from "./Token";

// @ObjectType("User")
// @Entity()
// export default class User {
//   @Field(() => ID)
//   @PrimaryGeneratedColumn()
//   id!: number;

//   @Field(() => String)
//   @Column("varchar", { nullable: false })
//   name!: string;

//   @Field(() => String)
//   @Column("varchar", { nullable: false })
//   email!: string;

//   @Field(() => String)
//   @Column("varchar", { nullable: false })
//   phone!: string;

//   @Column("varchar", { nullable: false })
//   password!: string;

//   @Field(() => Token)
//   @OneToOne(() => Token, (token) => token.user)
//   token: Token | undefined;

//   @Field(() => [Interest])
//   @OneToMany(() => Interest, (interest) => interest.users)
//   interests!: Interest[];
// }

@ObjectType("User")
@Entity()
export default class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column("varchar", { nullable: false })
  name!: string;

  @Field(() => String)
  @Column("varchar", { nullable: false })
  email!: string;

  @Field(() => String)
  @Column("varchar", { nullable: false })
  phone!: string;

  @Column("varchar", { nullable: false })
  password!: string;

  @Field(() => Boolean)
  @Column("boolean")
  emailVerified?: string;

  @Field(() => Boolean, { nullable: true })
  @Column("boolean", { nullable: true })
  phoneVerified?: string;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: false })
  tokenId?: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  interestIds?: string;

  @Field(() => Token, { nullable: true })
  @JoinColumn()
  @OneToOne(() => Token, (token) => token.userId)
  token?: Token;

  @Field(() => [Interest], { nullable: true })
  interests?: Interest[];
}

@InputType("UserInput")
export class UserInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  email!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password!: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @Field(() => [String])
  @IsNotEmpty()
  @IsArray()
  interests: string[] | undefined;
}
