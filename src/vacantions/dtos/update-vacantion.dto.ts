import { CreateVacantionDto } from './create-vacantion.dto'

export class UpdateVacantionDto implements Omit<CreateVacantionDto, 'projectId'> {
  id?: number

  title: string

  description: string

  projectId?: number
}
