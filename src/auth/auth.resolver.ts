import { createToken } from './inputs/lib/token.lib'
import { AuthObjectType } from './object-types/auth.object-type'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { UserObjectType } from './../users/object-types/user.object-type'
import { RegisterInput } from './inputs'
import { addUser } from '../db'

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthObjectType)
  register(@Arg('data') data: RegisterInput): AuthObjectType {
    const user = addUser(data)

    return {
      token: createToken(user.id),
      user: user,
    }
  }
}
