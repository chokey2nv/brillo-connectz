import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import User from "./User";

@ObjectType("Token")
@Entity()
export default class Token {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column("varchar", { nullable: false })
  token!: string;

  //USED FOR SERVER DB
  @Field(() => ID)
  @Column("int", { nullable: true })
  userId!: number;

  @Column("int", { nullable: true })
  phoneToken!: number;

  @Column("varchar", { nullable: true })
  emailLink!: String;

  @Field(() => User)
  @JoinColumn()
  @OneToOne(() => User, (user) => user.userToken)
  user!: User;
}
