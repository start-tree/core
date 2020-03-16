import { Express } from 'express'
import { omit } from 'lodash'
import Container from 'typedi'
import { createApp, makeQuery } from '../../app'
import { AuthService } from '../../auth'
import { closePg, connectPg, fakeProjects, fakeUsers, syncPg } from '../../db'
import { UsersService } from '../../users'

describe('AuthResolver', () => {
  let app: Express

  let usersService: UsersService
  let authService: AuthService

  beforeAll(async () => {
    await connectPg()
    await syncPg()

    usersService = Container.get(UsersService)
    authService = Container.get(AuthService)
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
    const [projectData] = fakeProjects
    const [userData] = fakeUsers
    const user = await usersService.findUser({ email: userData.email })
    const token = authService.createToken(user!.id)

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

    const result = await makeQuery({
      app,
      token,
      query: createProjectMutation,
      variables: {
        data: {
          ...projectData,
          ownerId: user!.id,
        },
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
})
