import { CreateVacantionDto } from '../../vacantions'
import { ProjectEntity } from '../project.entity'

export class CreateProjectDto implements Omit<ProjectEntity, 'id' | 'owner' | 'vacantions'> {
  title: string

  description: string

  ownerId: number

  vacantions?: Omit<CreateVacantionDto, 'projectId'>[]
}
