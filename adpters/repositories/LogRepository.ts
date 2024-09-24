import { MongoHelper } from '@/adapters/repositories'
import { type ILogErrorRepository } from '@/core'

export class LogRepository implements ILogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = MongoHelper.getCollection('products_logs')
    const date = new Date()
    process.stdout.write(`
      
      ERROR
      
      ${stack}
      
      DATE
      ${date}

      `)
    await errorCollection.insertOne({
      data: stack,
      date
    })
  }
}
