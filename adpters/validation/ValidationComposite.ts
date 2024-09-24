import { type IValidation } from '@/core'

export class ValidationComposite implements IValidation {
  constructor (private readonly validations: IValidation[]) { }
  validate (input: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if (error) return error
    }
  }
}
