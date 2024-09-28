import { RefreshToken, type RefreshTokenParams } from '@/usecases'
import { type IEventMapDAO, type IRefreshTokenGateway, type AuthenticationResult } from '@/infrastructure'

const mockAuthenticationResult = (): AuthenticationResult => ({
  AccessToken: 'any_token',
  ExpiresIn: 3600,
  IdToken: 'any_id',
  NewDeviceMetadata: 'any_device',
  RefreshToken: 'any_refresh_token'
})

const mockDAO = (): IEventMapDAO => {
  class EventMapDAOStub implements IEventMapDAO {
    async load (type: string): Promise<any> {
      return await Promise.resolve({ clientId: 'any_client_id' })
    }
  }
  return new EventMapDAOStub()
}

const mockGateway = (): IRefreshTokenGateway => {
  class RefreshTokenGatewayStub implements IRefreshTokenGateway {
    async refreshToken ({ refreshToken, clientId }): Promise<AuthenticationResult> {
      return await Promise.resolve(mockAuthenticationResult())
    }
  }
  return new RefreshTokenGatewayStub()
}

interface SutTypes {
  sut: RefreshToken
  DAOStub: IEventMapDAO
  gatewayStub: IRefreshTokenGateway
}

const makeSut = (): SutTypes => {
  const DAOStub = mockDAO()
  const gatewayStub = mockGateway()
  const sut = new RefreshToken(DAOStub, gatewayStub)
  return {
    sut,
    DAOStub,
    gatewayStub
  }
}

const mockRefreshTokenParams = (): RefreshTokenParams => ({
  refreshToken: 'any_refresh_token',
  type: 'any_type'
})

describe('RefreshToken Use Case', () => {
  test('Should return AuthenticationResult on success', async () => {
    const { sut } = makeSut()
    const params = mockRefreshTokenParams()
    const result = await sut.execute(params)
    expect(result).toEqual(mockAuthenticationResult())
  })

  test('Should call DAO load with correct type', async () => {
    const { sut, DAOStub } = makeSut()
    const loadSpy = jest.spyOn(DAOStub, 'load')
    const params = mockRefreshTokenParams()
    await sut.execute(params)
    expect(loadSpy).toHaveBeenCalledWith('any_type')
  })

  test('Should call Gateway refreshToken with correct values', async () => {
    const { sut, gatewayStub } = makeSut()
    const signinSpy = jest.spyOn(gatewayStub, 'refreshToken')
    const params = mockRefreshTokenParams()
    await sut.execute(params)
    expect(signinSpy).toHaveBeenCalledWith({
      clientId: 'any_client_id',
      refreshToken: 'any_refresh_token'
    })
  })

  test('Should return null if DAO returns null', async () => {
    const { sut, DAOStub } = makeSut()
    jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const params = mockRefreshTokenParams()
    const result = await sut.execute(params)
    expect(result).toBeNull()
  })

  test('Should throw if Gateway throws', async () => {
    const { sut, gatewayStub } = makeSut()
    jest.spyOn(gatewayStub, 'refreshToken').mockImplementationOnce(() => {
      throw new Error()
    })
    const params = mockRefreshTokenParams()
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow()
  })
})
