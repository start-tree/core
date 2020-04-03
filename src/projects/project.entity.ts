import { Field, ID, ObjectType, Int } from 'type-graphql'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { UserEntity } from '../users'
import { VacantionEntity } from '../vacantions'
import { CategoryEntity } from '../categories'

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
  @Field(() => Int)
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

  @ManyToMany(() => CategoryEntity)
  @JoinTable()
  @Field(() => [CategoryEntity])
  categories: CategoryEntity[]
}
