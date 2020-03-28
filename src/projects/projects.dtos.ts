import { VacationData } from '../vacantions'

export class ProjectData {
  title: string

  description: string

  ownerId: number

  categoriesIds: number[]

  vacantions?: VacationData[]
}

export class FindProjectsData {
  ids?: number[]

  ownerId?: number
}

export class FindProjectData {
  id?: number

  ownerId?: number
}
