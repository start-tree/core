import { getConnection } from 'typeorm'
import { fakeDb } from './fake-db'

export const syncPg = async (params: { fakeDb?: boolean } = {}) => {
  await getConnection().synchronize(true)

  if (params.fakeDb) {
    await fakeDb()
  }
}
