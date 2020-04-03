import { Field, ID, ObjectType, Int } from 'type-graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ProjectEntity } from '../projects'

@Entity()
@ObjectType('Vacantion')
export class VacantionEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column()
  @Field()
  title: string

  @Column()
  @Field()
  description: string

  @Column()
  @Field(() => Int)
  projectId: number

  @ManyToOne(() => ProjectEntity, { onDelete: 'CASCADE' })
  @Field(() => ProjectEntity)
  project: ProjectEntity
}
