import { type EventMapParams, type IEmitterGateway, type IEventMapDAO, type ICreateEntityGateway, type CognitoUser } from '@/infrastructure'
import { type AdminCreateUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider'
import { CreateBusinessPartner } from '@/usecases'

const mockIdentity = (): any => ({
  User: {
    Attributes: 'any_user'
  }
})

const mockEventParams = (): any => ({
  userPoolId: 'any_user_pool_Id',
  queue: 'any_queue'
})

const mockUseCaseParams = (): any => ({
  type: 'DOCTOR',
  email: 'any_email@mail.com',
  password: 'any_password',
  customAttributes: {
    cpf: 'any_cpf',
    crm: 'any_crm'
  }
})

const mockGatewayParams = (): any => ({
  userPoolId: 'any_user_pool_Id',
  username: mockUseCaseParams().email,
  email: mockUseCaseParams().email,
  password: mockUseCaseParams().password,
  customAttributes: mockUseCaseParams().customAttributes
})

const mockQueueEvent = (): any => ({
  queue: mockEventParams().queue,
  message: {
    type: mockUseCaseParams().type,
    properties: {
      email: mockUseCaseParams().email,
      customAttributes: {
        cpf: mockUseCaseParams().customAttributes.cpf,
        crm: mockUseCaseParams().customAttributes.crm
      }
    }
  }
})

const mockDAO = (): IEventMapDAO => {
  class DAOStub implements IEventMapDAO {
    async load (type: string): Promise<EventMapParams> {
      return await Promise.resolve(null)
    }
  }
  return new DAOStub()
}

const mockGateway = (): ICreateEntityGateway => {
  class GatewayStub implements ICreateEntityGateway {
    async create (user: CognitoUser): Promise<AdminCreateUserCommandOutput> {
      return await Promise.resolve(null)
    }
  }
  return new GatewayStub()
}

const mockEmitter = (): IEmitterGateway => {
  class EmitterStub implements IEmitterGateway {
    async publish ({ queue, message }): Promise<void> {
      await Promise.resolve(null)
    }
  }
  return new EmitterStub()
}

type SutTypes = {
  sut: CreateBusinessPartner
  DAOStub: IEventMapDAO
  gatewayStub: ICreateEntityGateway
  emitterStub: IEmitterGateway
}

const mockSut = (): SutTypes => {
  const DAOStub = mockDAO()
  const gatewayStub = mockGateway()
  const emitterStub = mockEmitter()
  const sut = new CreateBusinessPartner(DAOStub, gatewayStub, emitterStub)
  return {
    sut,
    DAOStub,
    gatewayStub,
    emitterStub
  }
}

describe('Create Business Partner', () => {
  test('Show throw if DAO throw ', async () => {
    const { sut, DAOStub } = mockSut()
    jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockUseCaseParams())
    await expect(promise).rejects.toThrow()
  })

  test('Show call DAO with correct values', async () => {
    const { sut, DAOStub, gatewayStub } = mockSut()
    const { type } = mockUseCaseParams()
    const spy = jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.resolve(mockEventParams()))
    jest.spyOn(gatewayStub, 'create').mockReturnValueOnce(Promise.resolve(mockIdentity()))
    await sut.execute(mockUseCaseParams())
    expect(spy).toHaveBeenCalledWith(type)
  })

  test('Show throw if Gateway throw ', async () => {
    const { sut, gatewayStub, DAOStub } = mockSut()
    jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.resolve(mockEventParams()))
    jest.spyOn(gatewayStub, 'create').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockUseCaseParams())
    await expect(promise).rejects.toThrow()
  })

  test('Show call Gateway with correct values', async () => {
    const { sut, gatewayStub, DAOStub } = mockSut()
    jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.resolve(mockEventParams()))
    const spy = jest.spyOn(gatewayStub, 'create').mockReturnValueOnce(Promise.resolve(mockIdentity()))
    await sut.execute(mockUseCaseParams())
    expect(spy).toHaveBeenCalledWith(mockGatewayParams())
  })

  test('Show throw if Emitter throw ', async () => {
    const { sut, gatewayStub, DAOStub, emitterStub } = mockSut()
    jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.resolve(mockEventParams()))
    jest.spyOn(gatewayStub, 'create').mockReturnValueOnce(Promise.resolve(mockIdentity()))
    jest.spyOn(emitterStub, 'publish').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockUseCaseParams())
    await expect(promise).rejects.toThrow()
  })

  test('Show call Emitter with correct values', async () => {
    const { sut, gatewayStub, DAOStub, emitterStub } = mockSut()
    jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.resolve(mockEventParams()))
    jest.spyOn(gatewayStub, 'create').mockReturnValueOnce(Promise.resolve(mockIdentity()))
    const spy = jest.spyOn(emitterStub, 'publish')
    await sut.execute(mockUseCaseParams())
    expect(spy).toHaveBeenCalledWith(mockQueueEvent())
  })
})
