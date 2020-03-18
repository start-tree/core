import { UpdateVacantionDto } from '../../vacantions'
import { CreateProjectDto } from './create-project.dto'

export class UpdateProjectDto implements Omit<CreateProjectDto, 'ownerId'> {
  id: number

  title: string

  description: string

  vacantions: UpdateVacantionDto[]
}
