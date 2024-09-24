import { type IValidation } from '@/core'
import { MissingParam } from '@/adapters/errors'

export class RequiredFieldsValidation implements IValidation {
  constructor (private readonly fieldName: string) { }
  validate (input: any): Error {
    if (!input[this.fieldName]) return new MissingParam(this.fieldName)
  }
}
