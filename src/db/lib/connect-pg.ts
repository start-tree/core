import Container from 'typedi'
import { createConnection, useContainer } from 'typeorm'
import { ProjectEntity } from '../../projects'
import { UserEntity } from '../../users'
import { fakeDb } from './fake-db'
import { syncPg } from './sync-pg'

useContainer(Container)

export const connectPg = async (params: { fakeDb?: boolean } = {}) => {
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.PG_URL,
    synchronize: true,
    entities: [UserEntity, ProjectEntity],
  })

  if (params.fakeDb) {
    await syncPg()
    await fakeDb()
  }

  return connection
}
