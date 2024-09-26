import { adaptBroker } from '@/main/adapters'

export interface IEmitterGateway {
  publish: ({ queue, message }) => Promise<void>
}

export class EmitterGateway implements IEmitterGateway {
  async publish ({ queue, message }): Promise<void> {
    await adaptBroker.sendToQueue({ queue, message })
  }
}
