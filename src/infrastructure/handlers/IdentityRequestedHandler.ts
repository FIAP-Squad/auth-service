import { type ICreateBusinessPartner } from '@/usecases'

export interface IHandler {
  handle: (event: any) => Promise<void>
}

export class IdentityRequestedHandler implements IHandler {
  constructor (private readonly _usecase: ICreateBusinessPartner) { }
  async handle (event: any): Promise<void> {
    await this._usecase.execute(event)
  }
}
