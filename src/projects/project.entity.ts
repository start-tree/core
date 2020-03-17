import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '../users'
import { VacantionEntity } from '../vacantions'

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

  @OneToMany(
    () => VacantionEntity,
    (v) => v.project,
    { onDelete: 'CASCADE' }
  )
  vacantions: VacantionEntity[]
}
