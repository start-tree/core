import { Express } from 'express'
import { omit } from 'lodash'
import Container from 'typedi'
import { createApp, makeQuery } from '../../app'
import { AuthService } from '../../auth'
import { CategoriesService, CategoryEntity } from '../../categories'
import { closePg, connectPg, fakeProjects, fakeUsers, fakeVacantions, syncPg } from '../../db'
import { UsersService, userFragment } from '../../users'
import { CreateProjectInput, UpdateProjectInput } from '../dto'
import { projectFragment } from '../lib/project.fragment'
import { parseProjectInput, ProjectsService } from '../projects.service'
import { VacantionsService, vacantionFragment } from '../../vacantions'

describe('ProjectsResolver', () => {
  let app: Express

  let usersService: UsersService
  let authService: AuthService
  let projectsService: ProjectsService
  let categoriesService: CategoriesService
  let vacantionsService: VacantionsService

  let categories: CategoryEntity[]

  beforeAll(async () => {
    await connectPg()
    await syncPg()
    app = await createApp()

    usersService = Container.get(UsersService)
    authService = Container.get(AuthService)
    projectsService = Container.get(ProjectsService)
    categoriesService = Container.get(CategoriesService)
    vacantionsService = Container.get(VacantionsService)
  })

  beforeEach(async () => {
    await syncPg({ fakeDb: true })

    categories = await categoriesService.find()
  })

  afterAll(async () => {
    await syncPg()
    await closePg()
  })

  test('mutation createProject', async () => {
    const createProjectMutation = `
      mutation CreateProject($input: CreateProjectInput!) {
        createProject(input: $input) {
          ...${projectFragment.name}
        }
      }
      ${projectFragment.fragment}
    `
    const [userData] = fakeUsers
    const user = await usersService.findOne({ email: userData.email })

    const [projectData] = fakeProjects
    const input: Omit<CreateProjectInput, 'ownerId'> = {
      ...projectData,
      vacantions: [fakeVacantions[0], fakeVacantions[1]],
      categoriesIds: [categories[0].id, categories[1].id],
    }

    const token = authService.createToken(user!.id)
    const result = await makeQuery({
      app,
      token,
      query: createProjectMutation,
      variables: {
        input,
      },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data.createProject).toEqual({
      id: expect.any(String),
      ownerId: user!.id,
      ...parseProjectInput(input),
      owner: {
        id: user!.id.toString(),
        ...omit(user, ['id', 'passwordHash']),
      },
      vacantions: expect.arrayContaining(
        input.vacantions!.map((v) =>
          expect.objectContaining({
            id: expect.any(String),
            projectId: expect.any(Number),
            ...v,
          })
        )
      ),
      categories: expect.arrayContaining(
        [categories[0], categories[1]].map((c) => ({ ...c, id: c.id.toString() }))
      ),
    })

    expect(result.data.createProject.vacantions).toHaveLength(input.vacantions!.length)
    expect(result.data.createProject.categories).toHaveLength(input.categoriesIds!.length)
  })

  test('query project', async () => {
    const projectQuery = `
      query Project($id: Int!) {
        project(id: $id) {
          ...${projectFragment.name}
        }
      }
      ${projectFragment.fragment}
    `

    const project = await projectsService.findOne({ id: 1 })

    const result = await makeQuery({
      app,
      query: projectQuery,
      variables: {
        id: 1,
      },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data.project).toEqual({
      id: project!.id.toString(),
      ...omit(project, ['id', 'owner', 'vacantions', 'categories']),
      owner: {
        id: project!.owner!.id.toString(),
        ...omit(project!.owner, ['id', 'passwordHash']),
      },
      vacantions: project!.vacantions!.map((v) => ({ ...v, id: v.id.toString() })),
      categories: project!.categories!.map((c) => ({ ...c, id: c.id.toString() })),
    })
  })

  test('mutation updateProject', async () => {
    const updateProjectMutation = `
      mutation UpdateProject($input: UpdateProjectInput!) {
        updateProject(input: $input) {
          ...${projectFragment.name}
        }
      }
      ${projectFragment.fragment}
    `

    const [userData] = fakeUsers
    const user = await usersService.findOne({ email: userData.email })

    const [projectData] = fakeProjects

    const project = await projectsService.create({
      title: `${projectData.title}-create`,
      description: `${projectData.description}-create`,
      ownerId: user!.id,
      vacantions: [fakeVacantions[0], fakeVacantions[1]],
      categoriesIds: [categories[0].id, categories[1].id],
    })

    const updatedProjectData = {
      id: project!.id,
      title: `${project!.title}-updated`,
      description: `${project!.description}-updated`,
    }

    const input: Omit<UpdateProjectInput, 'ownerId'> = {
      ...updatedProjectData,
      vacantions: [
        {
          ...omit(project!.vacantions![0], ['projectId']),
          ...fakeVacantions[2],
        },
        fakeVacantions[3],
      ],
      categoriesIds: [categories[2].id, categories[3].id],
    }

    const token = authService.createToken(user!.id)
    const result = await makeQuery({
      app,
      token,
      query: updateProjectMutation,
      variables: {
        input,
      },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data.updateProject).toEqual({
      ...parseProjectInput(input),
      id: project!.id.toString(),
      ownerId: user!.id,
      owner: {
        id: user!.id.toString(),
        ...omit(user, ['id', 'passwordHash']),
      },
      vacantions: expect.arrayContaining(
        input.vacantions!.map((v) =>
          expect.objectContaining({
            ...v,
            id: v.id ? v.id.toString() : expect.any(String),
            projectId: project!.id,
          })
        )
      ),
      categories: expect.arrayContaining(
        [categories[2], categories[3]].map((c) =>
          expect.objectContaining({
            ...c,
            id: c.id.toString(),
          })
        )
      ),
    })

    expect(result.data.updateProject.vacantions).toHaveLength(input.vacantions!.length)
    expect(result.data.updateProject.categories).toHaveLength(input.categoriesIds!.length)
  })

  test('mutation deleteProject', async () => {
    const deleteProjectMutation = `
      mutation deleteProject($id: Int!) {
        deleteProject(id: $id) {
          affected
        }
      }
    `

    const [userData] = fakeUsers
    const user = await usersService.findOne({ email: userData.email })

    const [projectData] = fakeProjects
    const project = await projectsService.create({
      title: `${projectData.title}-create`,
      description: `${projectData.description}-create`,
      ownerId: user!.id,
      categoriesIds: [categories[0].id, categories[1].id],
      vacantions: [fakeVacantions[0], fakeVacantions[1]],
    })

    const token = authService.createToken(user!.id)
    const result = await makeQuery({
      app,
      token,
      query: deleteProjectMutation,
      variables: {
        id: project!.id,
      },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data.deleteProject).toEqual({ affected: 1 })
  })

  test('query projects', async () => {
    const getProjectsQuery = `
     {
       projects {
        ...${projectFragment.name}
      }
    }
    ${projectFragment.fragment}
    `

    const result = await makeQuery({
      app,
      query: getProjectsQuery,
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data.projects).toHaveLength(fakeProjects.length)
  })

  test('addProposal mutation', async () => {
    const sendProposalQuery = `
    mutation AddProposal($input: AddProposalInput!) {
      addProposal(input: $input) {
        id
        description
        vacantionId
        userId
        vacantion {
          ...${vacantionFragment.name}
        }
        user {
          ...${userFragment.name}
        }
      }
    }
    ${vacantionFragment.fragment}
    ${userFragment.fragment}
    `

    const vacantion = await vacantionsService.findOne({})
    const input = {
      description: 'I want to be Senior Full Stack Developer',
      vacantionId: vacantion!.id,
    }

    const [userData] = fakeUsers
    const user = await usersService.findOne({ email: userData.email })

    const result = await makeQuery({
      app,
      query: sendProposalQuery,
      variables: {
        input,
      },
      token: authService.createToken(user!.id),
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data.addProposal).toEqual({
      id: expect.any(String),
      description: input.description,
      vacantionId: vacantion!.id,
      userId: user!.id,
      vacantion: expect.objectContaining({
        id: vacantion!.id.toString(),
      }),
      user: expect.objectContaining({
        id: user!.id.toString(),
      }),
    })
  })
})
