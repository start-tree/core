import { Query, Resolver } from 'type-graphql'
import { UserObjectType } from './user.object-type'

@Resolver()
export class UsersResolver {
  @Query(() => [UserObjectType])
  users(): UserObjectType[] {
    return [{ id: 1, email: 'vike', passwordHash: 'passs', name: 'bike' }]
  }
}
