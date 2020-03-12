import { Arg, Mutation, Resolver } from 'type-graphql'
import { UsersService } from './../users'
import { AuthServie } from './auth.service'
import { LoginInput, RegisterInput } from './inputs'
import { AuthObjectType } from './object-types'

@Resolver()
export class AuthResolver {
  constructor(private usersService: UsersService, private authService: AuthServie) {}

  @Mutation(() => AuthObjectType)
  async register(@Arg('data') data: RegisterInput): Promise<AuthObjectType> {
    const user = await this.usersService.createUser(data)

    return {
      token: this.authService.createToken(user.id),
      user: user,
    }
  }

  @Mutation(() => AuthObjectType, { nullable: true })
  async login(@Arg('data') data: LoginInput): Promise<AuthObjectType | null> {
    const user = await this.usersService.findUser({ email: data.email })

    if (!user) {
      return null
    }

    const passwordMatch = await this.usersService.comparePasswords(data.password, user.passwordHash)

    if (!passwordMatch) {
      return null
    }

    return {
      token: this.authService.createToken(user.id),
      user: user,
    }
  }
}
