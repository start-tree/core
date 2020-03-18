import { VacantionEntity } from '../vacantion.entity'

export class FindVacantionDto implements Partial<Pick<VacantionEntity, 'id'>> {
  id?: number
}
