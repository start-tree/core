import { Field, ID, ObjectType } from 'type-graphql'
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

  @Column({ nullable: true })
  @Field({ nullable: true })
  projectId?: number

  @ManyToOne(() => ProjectEntity, { nullable: true, onDelete: 'CASCADE' })
  @Field(() => ProjectEntity, { nullable: true })
  project?: ProjectEntity
}
