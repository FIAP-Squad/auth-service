import 'module-alias/register'
import { prismaClient, MongoHelper } from '@/adapters/repositories'
import env from './config/env'

prismaClient.$connect()
  .then(async () => await MongoHelper.connect(env.MONGODB_URL)
    .then(async () => {
      const { setupApp } = await import('./config/app')
      const app = setupApp()
      app.listen(env.PORT, () => process.stdout.write(`Server running at ${env.PORT}`))
    }).catch(console.error)
  ).catch(console.error)
