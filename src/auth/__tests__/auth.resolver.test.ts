import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-testing'
import { Container } from 'typedi'
import { createApp } from '../../create-app'
import { closePg, connectPg, syncPg, fakeUsers } from './../../db'
import { UsersService } from './../../users/users.service'

describe('AuthResolver', () => {
  let server: ApolloServer

  let usersService: UsersService

  beforeAll(async () => {
    await connectPg()
    await syncPg()

    usersService = Container.get(UsersService)
  })

  afterAll(async () => {
    await syncPg()
    await closePg()
  })

  beforeEach(async () => {
    await syncPg({ fakeDb: true })
    ;({ server } = await createApp())
  })

  test('register user', async () => {
    const { mutate } = createTestClient(server)
    const [userData] = fakeUsers

    // TODO: generate from typegraphql-code-generator
    const registerMutation = gql`
      mutation {
        register(data: { name: "${userData.name}-register", email: "${userData.email}-register", password: "${userData.password}" }) {
          token
          user {
            id
            name
            email
            passwordHash
          }
        }
      }
    `

    const result = await mutate({
      mutation: registerMutation,
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data!.register).toBeDefined()
    expect(result.data!.register).toHaveProperty('token')
    expect(result.data!.register).toHaveProperty('user', {
      id: expect.any(String),
      name: `${userData.name}-register`,
      email: `${userData.email}-register`,
      passwordHash: expect.any(String),
    })
  })

  test('login user', async () => {
    const { mutate } = createTestClient(server)

    const [userData] = fakeUsers

    // TODO: generate from typegraphql-code-generator
    const loginMutation = gql`
      mutation {
        login(data: { email: "${userData.email}", password: "${userData.password}" }) {
          token
          user {
            id
            name
            email
            passwordHash
          }
        }
      }
    `

    const result = await mutate({
      mutation: loginMutation,
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data!.login).toBeDefined()
    expect(result.data!.login).toHaveProperty('token')

    const user = await usersService.findUser({ email: userData.email })

    expect(result.data!.login).toHaveProperty('user', {
      id: user!.id.toString(),
      name: user!.name,
      email: user!.email,
      passwordHash: expect.any(String),
    })
  })
})
