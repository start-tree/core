import { Express } from 'express'
import { createApp, makeQuery } from '../../app'
import { closePg, connectPg, syncPg, fakeCategories } from '../../db'

describe('CategoriesResolver', () => {
  let app: Express

  beforeAll(async () => {
    await connectPg()
    await syncPg()
    app = await createApp()
  })

  beforeEach(async () => {
    await syncPg({ fakeDb: true })
  })

  afterAll(async () => {
    await syncPg()
    await closePg()
  })

  test('query categories', async () => {
    const result = await makeQuery({
      app,
      query: `
      query Categories {
        categories {
          id
          name
        }
      }
    `,
    })

    expect(result.errors).toBeUndefined()
    expect(result.body.categories).toHaveLength(fakeCategories.length)
  })
})
