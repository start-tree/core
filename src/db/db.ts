import { Container } from 'typedi'
import { createConnection, getConnection, useContainer } from 'typeorm'
import { UserEntity, UserObjectType } from '../users'

let users: UserObjectType[] = [
  {
    id: 1,
    email: 'vikei@email.com',
    passwordHash: 'saldf',
    name: 'test',
  },
  {
    id: 2,
    email: 'random@email.com',
    passwordHash: 'sldkfjIj32',
    name: 'test',
  },
]

useContainer(Container)

export const connectPg = async (params?: { fakeDb?: boolean }) => {
  return createConnection({
    type: 'postgres',
    url: process.env.PG_URL,
    synchronize: true,
    entities: [UserEntity],
  })
}

export const closePg = async () => {
  return getConnection().close()
}

export const syncPg = async (params?: { fakeDb?: boolean }) => {
  return getConnection().synchronize(true)
}
