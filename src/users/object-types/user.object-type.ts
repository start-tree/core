import { ObjectType, ID, Field } from 'type-graphql'

@ObjectType()
export class UserObjectType {
  @Field(() => ID)
  id: string

  @Field()
  email: string

  @Field()
  passwordHash: string
}
