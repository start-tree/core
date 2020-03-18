import { VacantionEntity } from '../vacantion.entity'

export class UpdateVacantionDto implements Partial<Omit<VacantionEntity, 'project'>> {
  id?: number

  title: string

  description: string

  projectId?: number
}
