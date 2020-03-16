import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { UserEntity } from '../users'

@Entity()
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  ownerId: number

  @ManyToOne(() => UserEntity)
  owner: UserEntity
}
