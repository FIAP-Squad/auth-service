import {
  type IController,
  type IHTTPRequest,
  type IHTTPResponse,
  type ILogErrorRepository
} from '@/core'

export class LogControllerDecorator implements IController {
  constructor (
    private readonly _controller: IController,
    private readonly _repository: ILogErrorRepository
  ) { }

  async handle (request: IHTTPRequest): Promise<IHTTPResponse> {
    const response = await this._controller.handle(request)
    if (response.statusCode === 500) await this._repository.logError(response.body.stack)
    return response
  }
}
