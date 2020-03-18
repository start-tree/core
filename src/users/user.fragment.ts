import { createFragment } from '../app/lib'

export const userFragment = createFragment({
  name: 'userFields',
  type: 'User',
  fields: `
    id
    name
    email
  `,
})
