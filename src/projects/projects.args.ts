import { Int, ArgsType, Field } from 'type-graphql'

@ArgsType()
export class FindProjectsArgs {
  @Field(() => Int, { nullable: true })
  ownerId?: number
}
