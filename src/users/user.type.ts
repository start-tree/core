import { Field, ID, ObjectType } from 'type-graphql'
import { UserEntity } from './user.entity'

@ObjectType()
export class User implements UserEntity {
  @Field(() => ID)
  id: number

  @Field()
  name: string

  @Field()
  email: string

  @Field()
  passwordHash: string
}
