import { createFragment } from '../../app/lib/create-fragment'

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
