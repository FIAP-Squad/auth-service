import { type IHTTPResponse, type IController, type IValidation, type IHTTPRequest, Presenter } from '@/infrastructure'
import { type IRefreshToken } from '@/usecases'

export class RefreshTokenController implements IController {
  constructor (
    private readonly _validation: IValidation,
    private readonly _usecase: IRefreshToken
  ) { }

  async handle ({ body }: IHTTPRequest): Promise<IHTTPResponse> {
    try {
      const error = this._validation.validate(body)
      if (error) return Presenter.badRequest(error)
      const { refreshToken, type } = body
      const token = await this._usecase.execute({ refreshToken, type })
      return Presenter.ok(token)
    } catch (error) {
      if (error?.name === 'NotAuthorizedException') return Presenter.unauthorized()
      return Presenter.serverError(error)
    }
  }
}
