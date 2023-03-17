import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";

@ObjectType("Interest")
@Entity()
export default class Interest {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column("varchar", { nullable: false })
  name!: string;
}
