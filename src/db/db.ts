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
