import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string
}
