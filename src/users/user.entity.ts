import { Field, ID, ObjectType } from 'type-graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType('User')
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column()
  @Field()
  name: string

  @Column({ unique: true })
  @Field()
  email: string

  @Column()
  passwordHash: string
}
