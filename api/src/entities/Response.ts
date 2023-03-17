import { Field, ObjectType } from "type-graphql";

@ObjectType("CallResponse")
export default class CallResponse {
  @Field(() => Boolean)
  data!: boolean;
}
