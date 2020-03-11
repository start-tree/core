import { Arg, Mutation, Resolver } from 'type-graphql'
import { addUser, findUser } from '../db'
import { RegisterInput } from './inputs'
import { createToken } from './lib/token.lib'
import { AuthObjectType } from './object-types'

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

  @Mutation(() => AuthObjectType, { nullable: true })
  login(@Arg('data') data: RegisterInput): AuthObjectType | null {
    const user = findUser(data.email)

    // TODO: handle user not found or password incorrect & test
    if (!user) {
      return null
    }

    return {
      token: createToken(user.id),
      user: user,
    }
  }
}
