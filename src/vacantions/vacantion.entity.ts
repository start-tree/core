import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ProjectEntity } from '../projects'

@Entity()
export class VacantionEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  projectId: number

  @ManyToOne(() => ProjectEntity)
  project: ProjectEntity
}
