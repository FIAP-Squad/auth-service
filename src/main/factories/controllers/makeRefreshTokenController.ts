import { EventMapDAO, IdentityGateway, type IController, LogErrorDAO, RefreshTokenController } from '@/infrastructure'
import { LogControllerDecorator } from '@/main/decorators'
import { makeRefreshTokenValidation } from '@/main/factories/validations'
import { RefreshToken } from '@/usecases'

export const makeRefreshTokenController = (): IController => {
  const DAO = new EventMapDAO()
  const logger = new LogErrorDAO()
  const gateway = new IdentityGateway()
  const validation = makeRefreshTokenValidation()
  const usecase = new RefreshToken(DAO, gateway)
  const controller = new RefreshTokenController(validation, usecase)
  return new LogControllerDecorator(controller, logger)
}
