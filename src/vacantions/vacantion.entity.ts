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

  @Column({ nullable: true })
  projectId?: number

  @ManyToOne(() => ProjectEntity, { nullable: true, onDelete: 'CASCADE' })
  project?: ProjectEntity
}
