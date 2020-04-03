import { VacationData } from '../../vacantions'

class ProjectVacantionData extends VacationData {
  id?: number
}

export class ProjectData {
  title: string

  description: string

  ownerId: number

  categoriesIds: number[]

  vacantions?: ProjectVacantionData[]
}

export class FindProjectsData {
  ids?: number[]

  ownerId?: number
}

export class FindProjectData {
  id?: number

  ownerId?: number
}
