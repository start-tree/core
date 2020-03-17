import { ObjectType, Field } from 'type-graphql'
import { DeleteResult } from 'typeorm'

@ObjectType()
export class Delete implements Pick<DeleteResult, 'affected'> {
  @Field()
  affected: number
}
