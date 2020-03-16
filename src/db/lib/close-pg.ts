import { getConnection } from 'typeorm'

export const closePg = async () => {
  return getConnection().close()
}
