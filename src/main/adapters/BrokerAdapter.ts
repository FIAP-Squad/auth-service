import amqp, { type Channel, type Connection } from 'amqplib'
import env from '@/main/config/env'

export type BrokerParams = {
  hostname: string
  port: number
  username: string
  password: string
}

export interface IBrokerAdapter {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  sendToQueue: ({ queue, message }) => Promise<void>
  subscribe: (queue: string, handle: (msg: any) => void) => Promise<void>
}

export class BrokerAdapter {
  private connection!: Connection
  private channel!: Channel
  private readonly hostname: string = String(env.RABBIT_MQ.HOST_NAME)
  private readonly port: number = Number(env.RABBIT_MQ.PORT)
  private readonly username: string = String(env.RABBIT_MQ.USERNAME)
  private readonly password: string = String(env.RABBIT_MQ.PASSWORD)

  private async executeWithCatch<T> (operation: () => Promise<T>, errorMessage: string): Promise<T | undefined> {
    try {
      return await operation()
    } catch (error) {
      console.error(`${errorMessage}:`, error)
      return undefined
    }
  }

  async connect (): Promise<void> {
    await this.executeWithCatch(async () => {
      this.connection = await amqp.connect({
        protocol: 'amqps',
        hostname: this.hostname,
        port: this.port,
        username: this.username,
        password: this.password
      })
      this.channel = await this.connection.createChannel()
    }, 'Failed to connect to Message Queue')
  }

  async disconnect (): Promise<void> {
    await this.executeWithCatch(async () => {
      await this.channel.close()
      await this.connection.close()
    }, 'Failed to disconnect from Message Queue')
  }

  async sendToQueue ({ queue, message }): Promise<void> {
    await this.executeWithCatch(async () => {
      await this.channel.assertQueue(queue, { durable: true })
      await this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true })
    }, 'Failed to send message to queue')
  }

  async subscribe (queue: string, handle: (msg: any) => void): Promise<void> {
    await this.executeWithCatch(async () => {
      await this.channel.assertQueue(queue, { durable: true })
      await this.channel.consume(queue, (message: any) => {
        if (message) {
          const messageContent = message.content.toString()
          console.log(`Mensagem recebida na fila ${queue}: ${messageContent}`)
          handle(messageContent)
          this.channel.ack(message)
        }
      })
    }, `Failed to subscribe to queue ${queue}`)
  }
}

export const adaptBroker = new BrokerAdapter()
