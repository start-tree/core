import { Field, ID, Int, ObjectType } from 'type-graphql'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '../users'
import { VacantionEntity } from '../vacantions'

@Entity()
@ObjectType()
export class ProposalEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column()
  @Field()
  description: string

  @Column()
  @Field(() => Int)
  vacantionId: number

  @Column()
  @Field(() => Int)
  userId: number

  @ManyToOne(() => VacantionEntity, { onDelete: 'CASCADE' })
  @Field(() => VacantionEntity)
  vacantion: VacantionEntity

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => UserEntity)
  user: UserEntity
}
