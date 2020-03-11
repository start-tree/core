import { gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-testing'
import { createApp } from '../../create-app'

describe('AuthResolver', () => {
  const { server } = createApp()
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
})
