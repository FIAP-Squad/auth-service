import { RequiredFieldsValidation, ValidationComposite, type IValidation } from '@/infrastructure'

export const makeRefreshTokenValidation = (): IValidation => {
  const validations: IValidation[] = []
  for (const field of ['refreshToken', 'type']) {
    validations.push(new RequiredFieldsValidation(field))
  }
  return new ValidationComposite(validations)
}
