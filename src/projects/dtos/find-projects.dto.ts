import { ArgsType, Field, Int } from 'type-graphql'
import { ProjectEntity } from '../project.entity'

export class FindProjectsDto implements Partial<Pick<ProjectEntity, 'id' | 'ownerId'>> {
  ids?: number[]

  ownerId?: number
}

@ArgsType()
export class FindProjectsArgs {
  @Field(() => Int, { nullable: true })
  ownerId?: number
}
