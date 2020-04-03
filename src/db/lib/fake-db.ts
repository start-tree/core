import Container from 'typedi'
import { CategoriesService } from '../../categories'
import { ProjectsService, ProposalsService } from '../../projects'
import { UsersService } from '../../users'
import { VacantionsService } from '../../vacantions'
import {
  createFakeProjects,
  createFakeVacantions,
  fakeCategories,
  fakeUsers,
  createFakeProposals,
} from '../fake-data'

export const fakeDb = async () => {
  process.env.NODE_ENV !== 'test' && console.log('Start fake db')

  const usersService = Container.get(UsersService)
  const users = await Promise.all(fakeUsers.map((u) => usersService.create(u)))
  const usersIds = users.map((u) => u.id)

  const categoriesService = Container.get(CategoriesService)
  const categories = await Promise.all(fakeCategories.map((c) => categoriesService.create(c)))
  const categoriesIds = categories.map((c) => c.id)

  const projectsService = Container.get(ProjectsService)
  const projectsData = createFakeProjects({ ownerIds: usersIds, categoriesIds })
  const projects = await Promise.all(projectsData.map((p) => projectsService.create(p)))

  const vacantionsService = Container.get(VacantionsService)
  const vacantionsData = createFakeVacantions({ projectsIds: projects.map((p) => p!.id) })
  const vacantions = await Promise.all(vacantionsData.map((v) => vacantionsService.create(v)))
  const vacantionsIds = vacantions.map((v) => v!.id)

  const proposalsService = Container.get(ProposalsService)
  const proposalsData = createFakeProposals({ vacantionsIds, usersIds })
  await Promise.all(proposalsData.map((p) => proposalsService.create(p)))

  process.env.NODE_ENV !== 'test' && console.log('Finish fake db')
}
