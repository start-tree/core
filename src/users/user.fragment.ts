import { createFragment } from '../app/lib/create-fragment'

export const userFragment = createFragment({
  name: 'userFields',
  type: 'User',
  fields: `
    id
    name
    email
  `,
})
