import { gql, ApolloServer } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-testing'
import { createApp } from '../../create-app'

describe('AuthResolver', () => {
  let server: ApolloServer

  beforeEach(async () => {
    ;({ server } = await createApp())
  })

  test('register user', async () => {
    const { mutate } = createTestClient(server)

    // TODO: generate from typegraphql-code-generator
    const registerMutation = gql`
      mutation {
        register(data: { email: "test@email.com", password: "pass" }) {
          token
          user {
            id
            email
            passwordHash
          }
        }
      }
    `

    const result = await mutate({
      mutation: registerMutation,
    })

    expect(result.data).toBeDefined()
    expect(result.data!.register).toBeDefined()
    expect(result.data!.register).toHaveProperty('token')
    expect(result.data!.register).toHaveProperty('user', {
      id: expect.any(String),
      email: 'test@email.com',
      passwordHash: expect.any(String),
    })
  })

  test('login user', async () => {
    const { mutate } = createTestClient(server)

    // TODO: generate from typegraphql-code-generator
    const loginMutation = gql`
      mutation {
        login(data: { email: "random@email.com", password: "sldkfjIj32" }) {
          token
          user {
            id
            email
            passwordHash
          }
        }
      }
    `

    const result = await mutate({
      mutation: loginMutation,
    })

    expect(result.data).toBeDefined()
    expect(result.data!.login).toBeDefined()
    expect(result.data!.login).toHaveProperty('token')
    expect(result.data!.login).toHaveProperty('user', {
      id: expect.any(String),
      email: 'random@email.com',
      passwordHash: expect.any(String),
    })
  })
})
