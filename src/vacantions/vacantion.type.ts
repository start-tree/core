import { ObjectType, Field, ID } from 'type-graphql'
import { VacantionEntity } from './vacantion.entity'
import { Project } from '../projects/project.type'

@ObjectType()
export class Vacantion implements Omit<VacantionEntity, 'project'> {
  @Field(() => ID)
  id: number

  @Field()
  title: string

  @Field()
  description: string

  @Field({ nullable: true })
  projectId?: number

  @Field(() => Project, { nullable: true })
  project?: Project
}
