import { EmitterGateway, EventMapDAO, type Handler, IdentityGateway, IdentityRequestedHandler } from '@/infrastructure'
import { SignUp } from '@/usecases'

export const identityRequestedHandler = (): Handler => {
  const DAO = new EventMapDAO()
  const gateway = new IdentityGateway()
  const emitter = new EmitterGateway()
  const usecase = new SignUp(DAO, gateway, gateway, gateway, emitter)
  return new IdentityRequestedHandler(usecase)
}
