import faker from 'faker'
import { times } from 'lodash'
import { CreateUserDto } from '../users'
import { CreateProjectDto } from './../projects'
import { CreateVacantionDto } from '../vacantions'

export const authUsers = [
  {
    name: 'test-user',
    email: 'test@mail.com',
    password: 'test',
  },
]

export const fakeUsers: CreateUserDto[] = [
  ...authUsers,
  ...times(10, () => ({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  })),
]

export const fakeProjects: Omit<CreateProjectDto, 'ownerId' | 'vacantions'>[] = times(30, () => ({
  title: faker.lorem.words(faker.random.number(5)),
  description: faker.lorem.paragraphs(faker.random.number(5)),
}))

export const createFakeProjects = ({ ownerIds }: { ownerIds: number[] }) => {
  return fakeProjects.map((p) => ({
    ...p,
    ownerId: ownerIds[faker.random.number(ownerIds.length - 1)],
  }))
}

export const fakeVacantions: Omit<CreateVacantionDto, 'projectId'>[] = times(30, () => ({
  title: faker.lorem.words(faker.random.number(5)),
  description: faker.lorem.paragraphs(faker.random.number(5)),
}))

export const createFakeVacantions = ({ projectsIds }: { projectsIds: number[] }) => {
  return fakeProjects.map((p) => ({
    ...p,
    projectId: projectsIds[faker.random.number(projectsIds.length - 1)],
  }))
}
