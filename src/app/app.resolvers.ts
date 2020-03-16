import { AuthResolver } from '../auth'
import { ProjectsResolver } from '../projects'
import { UsersResolver } from '../users'

export const appResolvers = [UsersResolver, AuthResolver, ProjectsResolver]
