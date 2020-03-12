import { createApp } from './create-app'
import { connectPg } from './db'

async function init() {
  try {
    await connectPg()
    console.log('Successed connected to postgres')
  } catch (e) {
    console.error(e)
    process.exit(1)
  }

  const { app } = await createApp()
  app.listen(3100, () => {
    console.log(`Server running on port 3100`)
  })
}

init()
