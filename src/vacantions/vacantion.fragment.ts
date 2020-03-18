import { createFragment } from '../app/lib'

export const vacantionFragment = createFragment({
  name: 'vacantionFields',
  type: 'Vacantion',
  fields: `
    id
    title
    description
    projectId
  `,
})
