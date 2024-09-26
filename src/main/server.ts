import 'module-alias/register'
import { noSQLHelper, prismaClient } from '@/infrastructure'
import env from '@/main/config/env'

async function startServer (): Promise<void> {
  await prismaClient.$connect()
  await noSQLHelper.connect(env.MONGODB.URL)
  const { setupApp } = await import('./config/app')
  const app = setupApp()
  app.listen(env.PORT)
}

startServer()
  .then(() => process.stdout.write(`Server running at ${env.PORT}\n`))
  .catch(error => {
    console.error('Error starting the server:', error)
    process.exit(1)
  })
