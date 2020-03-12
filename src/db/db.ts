import { createConnection, getConnection } from 'typeorm'
import { UserObjectType } from '../users'
import { RegisterInput } from '../auth/inputs'

let users: UserObjectType[] = [
  {
    id: '1',
    email: 'vikei@email.com',
    passwordHash: 'saldf',
  },
  {
    id: '2',
    email: 'random@email.com',
    passwordHash: 'sldkfjIj32',
  },
]

export const getUsers = () => users

export const addUser = (data: RegisterInput) => {
  const newUserId = Math.max(...users.map((u) => parseInt(u.id, 10))) + 1
  const newUser: UserObjectType = {
    id: newUserId.toString(),
    email: data.email,
    passwordHash: data.password,
  }

  users = users.concat(newUser)

  return newUser
}

export const findUser = (email: string) => {
  return getUsers().find((u) => u.email === email)
}

export const connectPg = async () => {
  return createConnection({
    type: 'postgres',
    url: process.env.PG_URL,
    synchronize: true,
  })
}

export const closePg = async () => {
  return getConnection().close()
}

export const syncPg = async () => {
  return getConnection().synchronize(true)
}
