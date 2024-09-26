import { IdentityRequestedHandler } from '@/infrastructure'
import { type ICreateBusinessPartner } from '@/usecases'

const mockEvent = (): any => ({
  type: 'BusinessPartner',
  email: 'test@example.com',
  password: 'securePassword',
  customAttributes: {
    crm: '12345',
    cpf: '67890'
  }
})

const mockCreateBusinessPartner = (): ICreateBusinessPartner => {
  class CreateBusinessPartnerStub implements ICreateBusinessPartner {
    async execute (params: any): Promise<void> {
      return await Promise.resolve()
    }
  }
  const createBusinessPartnerStub = new CreateBusinessPartnerStub()
  return createBusinessPartnerStub
}

interface SutTypes {
  sut: IdentityRequestedHandler
  createBusinessPartnerStub: ICreateBusinessPartner
}

const makeSut = (): SutTypes => {
  const createBusinessPartnerStub = mockCreateBusinessPartner()
  const sut = new IdentityRequestedHandler(createBusinessPartnerStub)
  return {
    sut,
    createBusinessPartnerStub
  }
}

describe('IdentityRequestedHandler', () => {
  test('Should call ICreateBusinessPartner with correct values', async () => {
    const { sut, createBusinessPartnerStub } = makeSut()
    const createBusinessPartnerSpy = jest.spyOn(createBusinessPartnerStub, 'execute')
    const event = mockEvent()
    await sut.handle(event)
    expect(createBusinessPartnerSpy).toHaveBeenCalledWith(event)
  })

  test('Should throw if ICreateBusinessPartner throws', async () => {
    const { sut, createBusinessPartnerStub } = makeSut()
    jest.spyOn(createBusinessPartnerStub, 'execute').mockReturnValueOnce(Promise.reject(new Error()))
    const event = mockEvent()
    await expect(sut.handle(event)).rejects.toThrow()
  })

  test('Should execute successfully when ICreateBusinessPartner completes without error', async () => {
    const { sut } = makeSut()
    const event = mockEvent()
    await expect(sut.handle(event)).resolves.not.toThrow()
  })
})
