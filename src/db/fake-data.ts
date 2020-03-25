import faker from 'faker'
import { times } from 'lodash'
import { CreateUserData } from '../users'
import { CreateProjectInput } from './../projects'
import { CreateVacantionData } from '../vacantions'
import { CreateCategoryDto } from '../categories'

export const authUsers: CreateUserData[] = [
  {
    name: 'test-user',
    email: 'test@mail.com',
    password: 'test',
  },
]

export const fakeUsers: CreateUserData[] = [
  ...authUsers,
  ...times(10, () => ({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  })),
]

export const fakeCategories: CreateCategoryDto[] = times(10, () => ({
  name: faker.lorem.words(faker.random.number(3)),
}))

export const fakeProjects: Omit<
  CreateProjectInput,
  'ownerId' | 'vacantions' | 'categoriesIds'
>[] = times(30, () => ({
  title: faker.lorem.words(faker.random.number(5)),
  description: faker.lorem.paragraphs(faker.random.number(5)),
}))

export const createFakeProjects = ({
  ownerIds,
  categoriesIds,
}: {
  ownerIds: number[]
  categoriesIds: number[]
}) => {
  return fakeProjects.map((p) => ({
    ...p,
    ownerId: ownerIds[faker.random.number(ownerIds.length - 1)],
    categoriesIds: categoriesIds.slice(faker.random.number(categoriesIds.length - 1)),
  }))
}

export const fakeVacantions: Omit<CreateVacantionData, 'projectId'>[] = times(30, () => ({
  title: faker.lorem.words(faker.random.number(5)),
  description: faker.lorem.paragraphs(faker.random.number(5)),
}))

export const createFakeVacantions = ({ projectsIds }: { projectsIds: number[] }) => {
  return fakeVacantions.map((p) => ({
    ...p,
    projectId: projectsIds[faker.random.number(projectsIds.length - 1)],
  }))
}
