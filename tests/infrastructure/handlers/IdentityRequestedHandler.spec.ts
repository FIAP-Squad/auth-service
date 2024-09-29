import { IdentityRequestedHandler } from '@/infrastructure'
import { type ISignUp } from '@/usecases'

const mockEvent = (): any => (JSON.stringify({
  type: 'DOCTOR',
  email: 'test@example.com',
  password: 'securePassword',
  customAttributes: {
    crm: '123456MG',
    cpf: '12345678901'
  }
}))

const mockCreateBusinessPartner = (): ISignUp => {
  class CreateBusinessPartnerStub implements ISignUp {
    async execute (params: any): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  const createBusinessPartnerStub = new CreateBusinessPartnerStub()
  return createBusinessPartnerStub
}

interface SutTypes {
  sut: IdentityRequestedHandler
  createBusinessPartnerStub: ISignUp
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
  test('Should call ISignUp with correct values', async () => {
    const { sut, createBusinessPartnerStub } = makeSut()
    const event = mockEvent()
    const spy = jest.spyOn(createBusinessPartnerStub, 'execute')
    await sut.handle(event)
    expect(spy).toHaveBeenCalledWith(event)
  })

  test('Should throw if ISignUp throws', async () => {
    const { sut, createBusinessPartnerStub } = makeSut()
    jest.spyOn(createBusinessPartnerStub, 'execute').mockReturnValueOnce(Promise.reject(new Error()))
    const event = mockEvent()
    await expect(sut.handle(event)).resolves.toBeUndefined()
  })

  test('Should execute successfully when ISignUp completes without error', async () => {
    const { sut } = makeSut()
    const event = mockEvent()
    await expect(sut.handle(event)).resolves.not.toThrow()
  })
})
