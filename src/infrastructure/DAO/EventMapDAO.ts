import { prismaClient } from '@/infrastructure'

export type EventMapParams = {
  userPoolId: string
  queue: string
}

export interface IEventMapDAO {
  load: (type: string) => Promise<EventMapParams>
}

export class EventMapDAO implements IEventMapDAO {
  async load (type: string): Promise<EventMapParams> {
    return await prismaClient.identityProperties.findFirst({
      where: { businessPartnerType: type },
      select: { userPoolId: true, queue: true }
    })
  }
}
