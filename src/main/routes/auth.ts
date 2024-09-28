import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeSignInController, makeRefreshTokenController } from '@/main/factories/controllers'

export const auth = (router: Router): void => {
  router.post('/auth/sign-in', adaptRoute(makeSignInController()))
  router.post('/auth/refresh-token', adaptRoute(makeRefreshTokenController()))
}
