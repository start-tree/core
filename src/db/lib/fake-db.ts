import Container from 'typedi'
import { ProjectsService } from '../../projects'
import { UsersService } from '../../users'
import { VacantionsService } from '../../vacantions'
import { createFakeProjects, createFakeVacantions, fakeUsers } from '../fake-data'

export const fakeDb = async () => {
  const usersService = Container.get(UsersService)
  const users = await Promise.all(fakeUsers.map((u) => usersService.createUser(u)))

  const projectsService = Container.get(ProjectsService)
  const projectsData = createFakeProjects({ ownerIds: users.map((u) => u.id) })
  const projects = await Promise.all(projectsData.map((p) => projectsService.createProject(p)))

  const vacantionsService = Container.get(VacantionsService)
  const vacantionsData = createFakeVacantions({ projectsIds: projects.map((p) => p!.id) })
  await Promise.all(vacantionsData.map((v) => vacantionsService.createVacantion(v)))
}
