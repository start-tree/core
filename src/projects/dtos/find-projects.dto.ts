import { ArgsType, Field, Int } from 'type-graphql'
import { ProjectEntity } from '../project.entity'

export type FindProjectsData = Partial<Pick<ProjectEntity, 'ownerId'>> & {
  ids?: number[]
}

@ArgsType()
export class FindProjectsArgs {
  @Field(() => Int, { nullable: true })
  ownerId?: number
}

export type FindProjectDto = Partial<Pick<ProjectEntity, 'id' | 'ownerId'>>
