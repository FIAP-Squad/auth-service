import { RefreshTokenController, type IValidation, type IHTTPRequest, Presenter, type AuthenticationResult } from '@/infrastructure'
import { type RefreshTokenParams, type IRefreshToken } from '@/usecases'

const mockAuthenticationResul = (): AuthenticationResult => ({
  AccessToken: 'any_token',
  ExpiresIn: 3600,
  IdToken: 'any_id',
  NewDeviceMetadata: 'any_device',
  RefreshToken: 'any_refresh_token'
})

const mockValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const mockRefreshToken = (): IRefreshToken => {
  class RefreshTokenStub implements IRefreshToken {
    async execute (params: RefreshTokenParams): Promise<AuthenticationResult> {
      return await Promise.resolve(null)
    }
  }
  return new RefreshTokenStub()
}

interface SutTypes {
  sut: RefreshTokenController
  validationStub: IValidation
  refreshTokenStub: IRefreshToken
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const refreshTokenStub = mockRefreshToken()
  const sut = new RefreshTokenController(validationStub, refreshTokenStub)
  return {
    sut,
    validationStub,
    refreshTokenStub
  }
}

const mockRequest = (): IHTTPRequest => ({
  body: {
    type: 'type',
    refreshToken: 'any_refresh_token'
  }
})

describe('RefreshTokenController', () => {
  test('Should return server error if RefreshToken throws', async () => {
    const { sut, refreshTokenStub } = makeSut()
    jest.spyOn(refreshTokenStub, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(Presenter.serverError(new Error()))
  })

  test('Should return bad request if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('Validation error'))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(Presenter.badRequest(new Error('Validation error')))
  })

  test('Should return unauthorized if usecase returns not authorized error', async () => {
    const { sut, refreshTokenStub } = makeSut()
    const error = new Error()
    error.name = 'NotAuthorizedException'
    jest.spyOn(refreshTokenStub, 'execute').mockReturnValueOnce(Promise.reject(error))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(Presenter.unauthorized())
  })

  test('Should return 200 if RefreshToken succeeds', async () => {
    const { sut, refreshTokenStub } = makeSut()
    const request = mockRequest()
    jest.spyOn(refreshTokenStub, 'execute').mockReturnValueOnce(Promise.resolve(mockAuthenticationResul()))
    const response = await sut.handle(request)
    expect(response).toEqual(Presenter.ok(mockAuthenticationResul()))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should call RefreshToken with correct values', async () => {
    const { sut, refreshTokenStub } = makeSut()
    const executeSpy = jest.spyOn(refreshTokenStub, 'execute')
    const request = mockRequest()
    await sut.handle(request)
    expect(executeSpy).toHaveBeenCalledWith(request.body)
  })
})
