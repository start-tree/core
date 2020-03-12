import { Container } from 'typedi'
import { createConnection, getConnection, useContainer } from 'typeorm'
import { UserEntity } from '../users'
import { UsersService } from './../users/users.service'
import { fakeUsers } from './fake-data'

useContainer(Container)

export const connectPg = async (params: { fakeDb?: boolean } = {}) => {
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.PG_URL,
    synchronize: true,
    entities: [UserEntity],
  })

  if (params.fakeDb) {
    await syncPg()
    await fakeDb()
  }

  return connection
}

export const closePg = async () => {
  return getConnection().close()
}

export const syncPg = async (params: { fakeDb?: boolean } = {}) => {
  await getConnection().synchronize(true)

  if (params.fakeDb) {
    await fakeDb()
  }
}

export const fakeDb = async () => {
  const usersService = Container.get(UsersService)

  await Promise.all(fakeUsers.map((u) => usersService.createUser(u)))
}
