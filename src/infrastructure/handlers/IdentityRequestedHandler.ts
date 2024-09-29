import { type Handler } from '@/infrastructure'
import { type ISignUp } from '@/usecases'

export class IdentityRequestedHandler implements Handler {
  constructor (private readonly _usecase: ISignUp) { }
  async handle (event: any): Promise<void> {
    try {
      await this._usecase.execute(event)
    } catch (error) {
      process.stdout.write(`Error: ${error.message}, Stack: ${error.stack}`)
    }
  }
}
