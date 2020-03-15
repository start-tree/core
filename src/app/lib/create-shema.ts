import { buildSchema } from 'type-graphql'
import Container from 'typedi'
import { AuthResolver } from '../../auth'
import { UsersResolver } from '../../users'
import { authChecker } from './auth-checker'

export function createSchema() {
  return buildSchema({
    validate: false,
    resolvers: [UsersResolver, AuthResolver],
    container: Container,
    authChecker,
  })
}
