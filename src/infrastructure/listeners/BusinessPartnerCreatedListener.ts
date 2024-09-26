import { type IListener } from '@/infrastructure'
import { type ICreateBusinessPartner } from '@/usecases'

type BusinessPartnerDTO = { key: string }

export class BusinessPartnerCreatedListener implements IListener {
  constructor (private readonly _usecase: ICreateBusinessPartner<BusinessPartnerDTO>) { }
  async handle (event: BusinessPartnerDTO): Promise<void> {
    await this._usecase.execute(event)
  }
}
