import { Field, ObjectType } from "type-graphql";

@ObjectType("CallResponse")
export default class CallResponse {
  @Field(() => String)
  data!: string;

  @Field(() => Boolean)
  error?: boolean
}
