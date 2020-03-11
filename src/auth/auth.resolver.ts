import { Arg, Mutation, Resolver } from 'type-graphql'
import { addUser } from '../db'
import { RegisterInput } from './inputs'
import { createToken } from './lib/token.lib'
import { AuthObjectType } from './object-types/auth.object-type'

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
