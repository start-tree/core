import { ObjectType, Field, Int } from 'type-graphql'
import { DeleteResult } from 'typeorm'

@ObjectType()
export class Delete implements Pick<DeleteResult, 'affected'> {
  @Field(() => Int, { nullable: true })
  affected?: number
}
