export class VacationData {
  id?: number

  title: string

  description: string

  projectId?: number
}

export class FindVacantionsData {
  ids?: number[]

  projectId?: number[]
}

export class FindVacantionData {
  id?: number
}
