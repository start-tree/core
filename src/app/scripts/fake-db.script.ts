import { closePg, connectPg } from '../../db'

const init = async () => {
  await connectPg({ fakeDb: true })
  await closePg()
}

init()
