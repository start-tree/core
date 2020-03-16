import Container from 'typedi'
import { UsersService } from '../../users'
import { fakeUsers } from '../fake-data'

export const fakeDb = async () => {
  const usersService = Container.get(UsersService)

  await Promise.all(fakeUsers.map((u) => usersService.createUser(u)))
}
