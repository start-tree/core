import Container from 'typedi'
import { ProjectsService } from '../../projects'
import { UsersService } from '../../users'
import { createFakeProjects, fakeUsers } from '../fake-data'

export const fakeDb = async () => {
  const usersService = Container.get(UsersService)
  const users = await Promise.all(fakeUsers.map((u) => usersService.createUser(u)))

  const projectsService = Container.get(ProjectsService)
  const projectsData = createFakeProjects({ ownerIds: users.map((u) => u.id) })
  await Promise.all(projectsData.map((p) => projectsService.createProject(p)))
}
