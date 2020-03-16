import { Express } from 'express'
import Container from 'typedi'
import { createApp, makeQuery } from '../../app'
import { AuthService } from '../../auth'
import { closePg, connectPg, fakeProjects, fakeUsers, syncPg, createFakeProjects } from '../../db'
import { UsersService } from '../../users'
import { ProjectsService } from './../projects.service'

describe('ProjectsResolver', () => {
  let app: Express

  let usersService: UsersService
  let authService: AuthService
  let projectsService: ProjectsService

  beforeAll(async () => {
    await connectPg()
    await syncPg()

    usersService = Container.get(UsersService)
    authService = Container.get(AuthService)
    projectsService = Container.get(ProjectsService)
  })

  afterAll(async () => {
    await syncPg()
    await closePg()
  })

  beforeEach(async () => {
    await syncPg({ fakeDb: true })
    ;({ app } = await createApp())
  })

  test('create project', async () => {
    const createProjectMutation = `
      mutation CreateProject($data: CreateProjectInput!) {
        createProject(data: $data) {
          id
          title
          description
          ownerId
          owner {
            id
            name
            email
          }
        }
      }
    `
    const [userData] = fakeUsers
    const user = await usersService.findUser({ email: userData.email })

    const [projectData] = fakeProjects

    const token = authService.createToken(user!.id)
    const result = await makeQuery({
      app,
      token,
      query: createProjectMutation,
      variables: {
        data: projectData,
      },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data.createProject).toEqual({
      id: expect.any(String),
      title: projectData.title,
      description: projectData.description,
      ownerId: user!.id,
      owner: {
        id: user!.id.toString(),
        name: user!.name,
        email: user!.email,
      },
    })
  })

  test('get project', async () => {
    const projectQuery = `
      query Project($id: String!) {
        project(id: $id) {
          id
          title
          description
          ownerId
          owner {
            id
            name
            email
          }
        }
      }
    `

    const project = await projectsService.findProject({ id: 1 })

    const result = await makeQuery({
      app,
      query: projectQuery,
      variables: {
        id: '1',
      },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data.project).toEqual({
      id: '1',
      title: project!.title,
      description: project!.description,
      ownerId: project!.ownerId,
      owner: {
        id: project!.owner!.id.toString(),
        name: project!.owner!.name,
        email: project!.owner!.email,
      },
    })
  })

  test('update project', async () => {
    const updateProjectMutation = `
      mutation UpdateProject($data: UpdateProjectInput!) {
        updateProject(data: $data) {
          id
          title
          description
          ownerId
          owner {
            id
            name
            email
          }
        }
      }
    `

    const [userData] = fakeUsers
    const user = await usersService.findUser({ email: userData.email })

    const [projectData] = fakeProjects
    const project = await projectsService.createProject({
      title: `${projectData.title}-create`,
      description: `${projectData.description}-create`,
      ownerId: user!.id,
    })
    const newProjectData = {
      id: project!.id,
      title: `${project!.title}-updated`,
      description: `${project!.description}-updated`,
    }

    const token = authService.createToken(user!.id)
    const result = await makeQuery({
      app,
      token,
      query: updateProjectMutation,
      variables: {
        data: newProjectData,
      },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data.updateProject).toEqual({
      id: project!.id.toString(),
      title: newProjectData.title,
      description: newProjectData.description,
      ownerId: user!.id,
      owner: {
        id: user!.id.toString(),
        name: user!.name,
        email: user!.email,
      },
    })
  })

  test('delete project', async () => {
    const deleteProjectMutation = `
      mutation deleteProject($id: String!) {
        deleteProject(id: $id)
      }
    `

    const [userData] = fakeUsers
    const user = await usersService.findUser({ email: userData.email })

    const [projectData] = fakeProjects
    const project = await projectsService.createProject({
      title: `${projectData.title}-create`,
      description: `${projectData.description}-create`,
      ownerId: user!.id,
    })

    const token = authService.createToken(user!.id)
    const result = await makeQuery({
      app,
      token,
      query: deleteProjectMutation,
      variables: {
        id: project!.id.toString(),
      },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data.deleteProject).toEqual(true)
  })
})
