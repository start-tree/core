import { VacantionEntity } from '../vacantion.entity'

export class CreateVacantionDto implements Omit<VacantionEntity, 'id' | 'project'> {
  title: string

  description: string

  projectId: number
}
