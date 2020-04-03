import path from 'path'
import { emitSchemaDefinitionFile } from 'type-graphql'
import { createSchema } from '../lib/create-schema'

async function init() {
  emitSchemaDefinitionFile(path.resolve(__dirname, '../../schema.gql'), await createSchema())
}

init()
