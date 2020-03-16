import Container from 'typedi'
import { createConnection, useContainer } from 'typeorm'
import { dbEntities } from '../db.entities'
import { fakeDb } from './fake-db'
import { syncPg } from './sync-pg'

useContainer(Container)

export const connectPg = async (params: { fakeDb?: boolean } = {}) => {
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.PG_URL,
    synchronize: true,
    entities: dbEntities,
  })

  if (params.fakeDb) {
    await syncPg()
    await fakeDb()
  }

  return connection
}
