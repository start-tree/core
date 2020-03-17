import { Express } from 'express'
import { omit, merge } from 'lodash'
import Container from 'typedi'
import { createApp, makeQuery } from '../../app'
import { AuthService } from '../../auth'
import { closePg, connectPg, fakeProjects, fakeUsers, syncPg, fakeVacantions } from '../../db'
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

  test.only('create project', async () => {
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
          vacantions {
            id
            title
            description
            projectId
          }
        }
      }
    `
    const [userData] = fakeUsers
    const user = await usersService.findUser({ email: userData.email })

    const [projectData] = fakeProjects
    const [vacantionData1, vacantionData2] = fakeVacantions

    const token = authService.createToken(user!.id)
    const result = await makeQuery({
      app,
      token,
      query: createProjectMutation,
      variables: {
        data: merge(projectData, { vacantions: [vacantionData1, vacantionData2] }),
      },
    })

    console.log(result.data.createProject)

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data.createProject).toEqual({
      id: expect.any(String),
      ownerId: user!.id,
      ...omit(projectData, 'vacantions'),
      owner: {
        id: user!.id.toString(),
        ...omit(user, ['id', 'passwordHash']),
      },
      vacantions: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          projectId: expect.any(Number),
          ...vacantionData1,
        }),
        expect.objectContaining({
          id: expect.any(String),
          projectId: expect.any(Number),
          ...vacantionData2,
        }),
      ]),
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
      id: project!.id.toString(),
      ...omit(project, ['id', 'owner']),
      owner: {
        id: project!.owner!.id.toString(),
        ...omit(project!.owner, ['id', 'passwordHash']),
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
      ...omit(newProjectData, ['id', 'owner', 'ownerId']),
      ownerId: user!.id,
      owner: {
        id: user!.id.toString(),
        ...omit(user, ['id', 'passwordHash']),
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

  test('get projects', async () => {
    const getProjectsQuery = `
     {
       projects {
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

    const result = await makeQuery({
      app,
      query: getProjectsQuery,
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data.projects).toHaveLength(fakeProjects.length)
  })
})
