import { VacantionEntity } from '../vacantion.entity'

export type FindVacantionData = Partial<Pick<VacantionEntity, 'id'>>

export type FindVacantionsData = {
  ids?: number[]
}
