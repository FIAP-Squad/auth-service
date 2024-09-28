import { type AuthenticationResult, type IEventMapDAO, type IRefreshTokenGateway } from '@/infrastructure'

export type RefreshTokenParams = {
  type: string
  refreshToken: string
}

export interface IRefreshToken {
  execute: ({ type, refreshToken }: RefreshTokenParams) => Promise<AuthenticationResult>
}

export class RefreshToken implements IRefreshToken {
  constructor (
    private readonly _DAO: IEventMapDAO,
    private readonly _gateway: IRefreshTokenGateway
  ) { }

  async execute ({ type, refreshToken }: RefreshTokenParams): Promise<AuthenticationResult> {
    const identityProperties = await this._DAO.load(type)
    if (identityProperties?.clientId) {
      const token = await this._gateway.refreshToken({ refreshToken, clientId: identityProperties.clientId })
      return token
    }
    return null
  }
}
