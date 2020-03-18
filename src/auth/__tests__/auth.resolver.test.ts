import { Express } from 'express'
import { omit } from 'lodash'
import { Container } from 'typedi'
import { createApp, makeQuery } from '../../app'
import { closePg, connectPg, fakeUsers, syncPg } from '../../db'
import { userFragment, UsersService } from '../../users'
import { AuthService } from '../auth.service'

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

  test('register user', async () => {
    const [userData] = fakeUsers

    const registerMutation = `
      mutation Register ($input: RegisterInput!) {
        register(input: $input) {
          token
          user {
            ...${userFragment.name}
          }
        }
      }

      ${userFragment.fragment}
    `

    const input = {
      name: `${userData.name}-register`,
      email: `${userData.email}-register`,
      password: userData.password,
    }

    const result = await makeQuery({
      app,
      query: registerMutation,
      variables: {
        input,
      },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data.register).toHaveProperty('token')

    expect(result.data.register).toHaveProperty('user', {
      id: expect.any(String),
      ...omit(input, ['password']),
    })
  })

  test('login user', async () => {
    const [userData] = fakeUsers

    const loginMutation = `
      mutation Login ($input: LoginInput!){
        login(input: $input) {
          token
          user {
            ...${userFragment.name}
          }
        }
      }
      ${userFragment.fragment}
    `

    const input = {
      email: userData.email,
      password: userData.password,
    }

    const result = await makeQuery({
      app,
      query: loginMutation,
      variables: {
        input,
      },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data.login).toHaveProperty('token')

    const user = await usersService.findOne({ email: userData.email })

    expect(result.data.login).toHaveProperty('user', {
      id: user!.id.toString(),
      ...omit(user, ['id', 'passwordHash']),
    })
  })

  test('get auth user', async () => {
    const [userData] = fakeUsers

    const user = await usersService.findOne({ email: userData.email })
    const token = authService.createToken(user!.id)

    const meQuery = `
      {
        me {
          ...${userFragment.name}
        }
      }
      ${userFragment.fragment}
    `

    const result = await makeQuery({ app, query: meQuery, token })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    expect(result.data).toHaveProperty('me', {
      id: user!.id.toString(),
      ...omit(user, ['id', 'passwordHash']),
    })
  })
})
