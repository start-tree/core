import { createApp } from './app'
import { connectPg } from './db'

export const main = async () => {
  try {
    await connectPg({ fakeDb: process.env.FAKE_DB && JSON.parse(process.env.FAKE_DB) })
    console.log('Successed connected to postgres')

    const app = await createApp()
    app.listen(3100, () => {
      console.log(`Server running on port 3100`)
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
