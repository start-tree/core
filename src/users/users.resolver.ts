import { Query, Resolver } from 'type-graphql'
import { UserEntity } from './user.entity'

@Resolver()
export class UsersResolver {
  @Query(() => [UserEntity])
  users(): UserEntity[] {
    return [{ id: 1, email: 'vike', name: 'bike', passwordHash: 'dsfds' }]
  }
}
