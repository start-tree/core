import { buildSchema } from 'type-graphql'
import Container from 'typedi'
import { authChecker } from './auth-checker'
import { UsersResolver } from '../../users'
import { AuthResolver } from '../../auth'
import { ProjectsResolver } from '../../projects'

const appResolvers = [UsersResolver, AuthResolver, ProjectsResolver]

export function createSchema() {
  return buildSchema({
    validate: false,
    resolvers: appResolvers,
    container: Container,
    authChecker,
  })
}
