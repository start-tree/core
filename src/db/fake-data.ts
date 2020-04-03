import faker from 'faker'
import { times, uniqWith } from 'lodash'
import { CategoryData } from '../categories'
import { ProjectData, ProposalData } from '../projects'
import { UserData } from '../users'
import { VacationData } from '../vacantions'

export const authUsers: UserData[] = [
  {
    name: 'test',
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

export const fakeProposals: Omit<ProposalData, 'vacantionId' | 'userId'>[] = times(50, () => ({
  description: faker.lorem.paragraph(faker.random.number(5)),
}))

export const createFakeProposals = ({
  vacantionsIds,
  usersIds,
}: {
  vacantionsIds: number[]
  usersIds: number[]
}) => {
  const data = fakeProposals.map((p) => ({
    ...p,
    vacantionId: vacantionsIds[faker.random.number(vacantionsIds.length - 1)],
    userId: usersIds[faker.random.number(usersIds.length - 1)],
  }))

  //remove dupplications
  return uniqWith(data, (f, s) => f.userId === s.userId && f.vacantionId === s.vacantionId)
}
