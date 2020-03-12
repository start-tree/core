import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import Container from 'typedi'
import { AuthService } from '../../auth'
import { UsersService } from '../../users'
import { Context } from '../interfaces'

export async function getContext({ req }: ExpressContext) {
  const ctx: Context = {}

  if (req && req.header('Authorization')) {
    const authService = Container.get(AuthService)
    const payload = authService.verifyToken(req.header('Authorization')!)

    const usersService = Container.get(UsersService)

    ctx.authUser = await usersService.findUser({ id: payload.id })
  }

  return ctx
}
