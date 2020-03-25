import { UpdateVacantionDto } from '../../vacantions'
import { CreateProjectDto } from './create-project.dto'

export class UpdateProjectDto implements CreateProjectDto {
  id: number

  title: string

  description: string

  ownerId: number

  vacantions?: UpdateVacantionDto[]
}
