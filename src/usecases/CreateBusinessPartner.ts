import { type ICreateEntityGateway, type IEventMapDAO, type IEmitterGateway } from '@/infrastructure'

export interface ICreateBusinessPartner {
  execute: (params: IdentityProperties) => Promise<void>
}

export type IdentityProperties = {
  type: string
  email: string
  password: string
  customAttributes?: Record<any, any>
}

export class CreateBusinessPartner implements ICreateBusinessPartner {
  constructor (
    private readonly _DAO: IEventMapDAO,
    private readonly _gateway: ICreateEntityGateway,
    private readonly _emitter: IEmitterGateway
  ) { }

  async execute ({ type, email, password, customAttributes }: IdentityProperties): Promise<void> {
    const { userPoolId, queue } = await this._DAO.load(type)
    const { User } = await this._gateway.create({ userPoolId, username: email, email, password, customAttributes })
    // if (User) {
    //   await this._emitter.publish({
    //     queue,
    //     message: {
    //       type,
    //       properties: {
    //         email,
    //         customAttributes
    //       }
    //     }
    //   })
    // }
  }
}
