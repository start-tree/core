import faker from 'faker'
import { times } from 'lodash'
import { CategoryData } from '../categories'
import { ProjectData } from '../projects'
import { UserData } from '../users'
import { VacationData } from '../vacantions'

export const authUsers: UserData[] = [
  {
    name: 'test-user',
    email: 'test@mail.com',
    password: 'test',
  },
]

export const fakeUsers: UserData[] = [
  ...authUsers,
  ...times(10, () => ({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  })),
]

export const fakeCategories: CategoryData[] = times(10, () => ({
  name: faker.lorem.words(faker.random.number(3)),
}))

export const fakeProjects: Omit<ProjectData, 'ownerId' | 'vacantions' | 'categoriesIds'>[] = times(
  30,
  () => ({
    title: faker.lorem.words(faker.random.number(5)),
    description: faker.lorem.paragraphs(faker.random.number(5)),
  })
)

export const createFakeProjects = ({
  ownerIds,
  categoriesIds,
}: {
  ownerIds: number[]
  categoriesIds: number[]
}): ProjectData[] => {
  return fakeProjects.map((p) => ({
    ...p,
    ownerId: ownerIds[faker.random.number(ownerIds.length - 1)],
    categoriesIds: categoriesIds.slice(faker.random.number(categoriesIds.length - 1)),
    vacantions: [],
  }))
}

export const fakeVacantions: VacationData[] = times(30, () => ({
  title: faker.lorem.words(faker.random.number(5)),
  description: faker.lorem.paragraphs(faker.random.number(5)),
}))

export const createFakeVacantions = ({ projectsIds }: { projectsIds: number[] }) => {
  return fakeVacantions.map((p) => ({
    ...p,
    projectId: projectsIds[faker.random.number(projectsIds.length - 1)],
  }))
}
