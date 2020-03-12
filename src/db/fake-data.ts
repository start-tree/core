import faker from 'faker'
import { times } from 'lodash'
import { CreateUser } from './../users'

export const fakeUsers: CreateUser[] = times(10, () => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}))
