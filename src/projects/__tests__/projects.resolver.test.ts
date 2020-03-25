import { CreateProjectDto } from './../dtos/create-project.dto'
import { Express } from 'express'
import { merge, omit } from 'lodash'
import Container from 'typedi'
import { createApp, makeQuery } from '../../app'
import { AuthService } from '../../auth'
import {
  closePg,
  connectPg,
  fakeProjects,
  fakeUsers,
  fakeVacantions,
  syncPg,
  fakeCategories,
} from '../../db'
import { UsersService } from '../../users'
import { UpdateVacantionDto } from '../../vacantions'
import { projectFragment } from '../lib/project.fragment'
import { ProjectsService } from './../projects.service'
import { CategoriesService, CreateCategoryDto } from '../../categories'

describe('ProjectsResolver', () => {
  let app: Express

  let usersService: UsersService
  let authService: AuthService
  let projectsService: ProjectsService
  let categoriesService: CategoriesService

  beforeAll(async () => {
    await connectPg()
    await syncPg()
    app = await createApp()
    usersService = Container.get(UsersService)
    authService = Container.get(AuthService)
    projectsService = Container.get(ProjectsService)
    categoriesService = Container.get(CategoriesService)
  })

  beforeEach(async () => {
    await syncPg({ fakeDb: true })
  })

  afterAll(async () => {
    await syncPg()
    await closePg()
  })

  test.only('create project', async () => {
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

    const [categoryData1, categoryData2] = fakeCategories
    const categories = await Promise.all([
      categoriesService.create(categoryData1),
      categoriesService.create(categoryData2),
    ])

    const [projectData] = fakeProjects

    const input: Omit<CreateProjectDto, 'ownerId'> = {
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
      ...omit(input, ['vacantions', 'categoriesIds']),
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
      categories: expect.arrayContaining(categories.map((c) => ({ ...c, id: c.id.toString() }))),
    })

    expect(result.data.createProject.vacantions).toHaveLength(input.vacantions!.length)
  })

  test('get project', async () => {
    const projectQuery = `
      query Project($id: Float!) {
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
      ...omit(project, ['id', 'owner', 'vacantions']),
      owner: {
        id: project!.owner!.id.toString(),
        ...omit(project!.owner, ['id', 'passwordHash']),
      },
      vacantions: project!.vacantions!.map((v) => ({ ...v, id: v.id.toString() })),
    })
  })

  test('update project', async () => {
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
    })

    const updatedProjectData = {
      id: project!.id,
      title: `${project!.title}-updated`,
      description: `${project!.description}-updated`,
    }

    const input = merge(updatedProjectData, {
      vacantions: [
        {
          id: project!.vacantions![0].id,
          ...project!.vacantions![0],
          ...fakeVacantions[2],
        },
        fakeVacantions[3],
      ] as UpdateVacantionDto[],
    })

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
      ...updatedProjectData,
      id: project!.id.toString(),
      ownerId: user!.id,
      owner: {
        id: user!.id.toString(),
        ...omit(user, ['id', 'passwordHash']),
      },
      vacantions: expect.arrayContaining(
        input.vacantions.map((v) =>
          expect.objectContaining({
            ...v,
            id: v.id ? v.id.toString() : expect.any(String),
            projectId: project!.id,
          })
        )
      ),
    })

    expect(result.data.updateProject.vacantions).toHaveLength(input.vacantions.length)
  })

  test('delete project', async () => {
    const deleteProjectMutation = `
      mutation deleteProject($id: Float!) {
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

  test('get projects', async () => {
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
})
