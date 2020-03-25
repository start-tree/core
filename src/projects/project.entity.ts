import { Field, ID, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '../users'
import { VacantionEntity } from '../vacantions'

@Entity()
@ObjectType('Project')
export class ProjectEntity {
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
  @Field()
  ownerId: number

  @ManyToOne(() => UserEntity)
  @Field(() => UserEntity)
  owner: UserEntity

  @OneToMany(
    () => VacantionEntity,
    (v) => v.project
  )
  @Field(() => [VacantionEntity])
  vacantions: VacantionEntity[]
}
