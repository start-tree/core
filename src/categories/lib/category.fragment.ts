import { createFragment } from '../../app/lib/create-fragment'

export const categoryFragment = createFragment({
  name: 'categoriesFields',
  type: 'Category',
  fields: `
    id
    name
  `,
})
