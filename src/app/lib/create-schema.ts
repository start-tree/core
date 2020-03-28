import { buildSchema } from 'type-graphql'
import Container from 'typedi'
import { authChecker } from './auth-checker'
import { UsersResolver } from '../../users'
import { AuthResolver } from '../../auth'
import { ProjectsResolver } from '../../projects'
import { CategoriesResolver } from '../../categories'

const appResolvers = [UsersResolver, AuthResolver, ProjectsResolver, CategoriesResolver]

export function createSchema() {
  return buildSchema({
    validate: false,
    resolvers: appResolvers,
    container: Container,
    authChecker,
  })
}
