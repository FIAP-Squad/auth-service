import amqp, { type Channel, type Connection } from 'amqplib'
import env from '@/main/config/env'
import { type IHandler } from '@/infrastructure'

export interface IBrokerAdapter {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  subscribe: (queue: string, handle: IHandler) => Promise<void>
  publish: ({ queue, message }) => Promise<void>
  run: () => Promise<void>
}

export class BrokerClient implements IBrokerAdapter {
  private connection!: Connection
  private channel!: Channel
  private readonly _HOST: string = env.RABBIT_MQ.HOST_NAME
  private readonly _PORT: number = Number.parseInt(env.RABBIT_MQ.PORT)
  private readonly _USERNAME: string = env.RABBIT_MQ.USERNAME
  private readonly _PASSWORD: string = env.RABBIT_MQ.PASSWORD
  private readonly handlers: Map<string, IHandler> = new Map<string, IHandler>()

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
        hostname: this._HOST,
        port: this._PORT,
        username: this._USERNAME,
        password: this._PASSWORD
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

  async subscribe (queue: string, handler: IHandler): Promise<void> {
    await this.executeWithCatch(async () => {
      await this.channel.assertQueue(queue, { durable: true })
      this.handlers.set(queue, handler)
    }, `Failed to subscribe to queue ${queue}`)
  }

  async publish ({ queue, message }): Promise<void> {
    await this.executeWithCatch(async () => {
      await this.channel.assertQueue(queue, { durable: true })
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
      console.log(`Message sent to queue: ${queue}`)
    }, `Failed to publish message to queue ${queue}`)
  }

  async run (): Promise<void> {
    for (const [queue, handler] of this.handlers.entries()) {
      await this.channel.consume(queue, async (message: any) => {
        if (message) {
          const messageContent = message.content.toString()
          console.log(`Message received through queue: ${queue}: ${messageContent}`)
          await handler.handle(messageContent)
          this.channel.ack(message)
        }
      })
    }
  }
}

export const brokerClient = new BrokerClient()
