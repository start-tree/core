import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Context } from '../app'
import { User, UsersService } from './../users'
import { AuthService } from './auth.service'
import { Auth } from './auth.type'
import { LoginInput, RegisterInput } from './inputs'

@Resolver()
export class AuthResolver {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  @Query(() => User)
  @Authorized()
  me(@Ctx() ctx: Context): User {
    return ctx.authUser!
  }

  @Mutation(() => Auth)
  async register(@Arg('data') data: RegisterInput): Promise<Auth> {
    const user = await this.usersService.createUser(data)

    return {
      token: this.authService.createToken(user.id),
      user: user,
    }
  }

  @Mutation(() => Auth, { nullable: true })
  async login(@Arg('data') data: LoginInput): Promise<Auth | null> {
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
