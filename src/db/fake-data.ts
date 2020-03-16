import faker from 'faker'
import { times } from 'lodash'
import { CreateUser } from '../users'
import { CreateProject } from './../projects'

export const authUsers = [
  {
    name: 'test-user',
    email: 'test@mail.com',
    password: 'test',
  },
]

export const fakeUsers: CreateUser[] = [
  ...authUsers,
  ...times(10, () => ({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  })),
]

export const fakeProjects: Omit<CreateProject, 'ownerId'>[] = times(30, () => ({
  title: faker.lorem.words(faker.random.number(5)),
  description: faker.lorem.paragraphs(faker.random.number(5)),
}))

export const createFakeProjects = ({ ownerIds }: { ownerIds: number[] }) => {
  return fakeProjects.map((p) => ({
    ...p,
    ownerId: ownerIds[faker.random.number(ownerIds.length - 1)],
  }))
}
