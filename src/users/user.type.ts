import { Field, ID, ObjectType } from 'type-graphql'
import { UserEntity } from './user.entity'

@ObjectType()
export class User implements Omit<UserEntity, 'passwordHash'> {
  @Field(() => ID)
  id: number

  @Field()
  name: string

  @Field()
  email: string
}
