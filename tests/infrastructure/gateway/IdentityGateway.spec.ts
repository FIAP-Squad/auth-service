import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminDeleteUserCommand,
  InitiateAuthCommand
} from '@aws-sdk/client-cognito-identity-provider'
import { IdentityGateway, identitySingleton } from '@/infrastructure'

jest.mock('@/infrastructure', () => ({
  identitySingleton: {
    send: jest.fn()
  }
}))

describe('IdentityGateway', () => {
  let identityGateway: IdentityGateway

  beforeEach(() => {
    identityGateway = new IdentityGateway()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    test('Should call AdminCreateUserCommand with correct values', async () => {
      const user = {
        userPoolId: 'test-pool-id',
        email: 'test@test.com',
        username: 'testuser',
        password: 'password123',
        customAttributes: {
          role: 'admin'
        }
      }

      await identityGateway.create(user)

      expect(identitySingleton.send).toHaveBeenCalledWith(expect.any(AdminCreateUserCommand))
      const { input } = (identitySingleton.send as jest.Mock).mock.calls[0][0]
      expect(input).toEqual({
        UserPoolId: 'test-pool-id',
        Username: 'testuser',
        TemporaryPassword: 'password123',
        MessageAction: 'SUPPRESS',
        UserAttributes: [
          { Name: 'email_verified', Value: 'true' },
          { Name: 'email', Value: 'test@test.com' },
          { Name: 'custom:role', Value: 'admin' }
        ]
      })
    })
  })

  describe('updatePassword', () => {
    test('Should call AdminSetUserPasswordCommand with correct values', async () => {
      await identityGateway.updatePassword({
        userPoolId: 'test-pool-id',
        username: 'testuser',
        password: 'newPassword123'
      })

      expect(identitySingleton.send).toHaveBeenCalledWith(expect.any(AdminSetUserPasswordCommand))
      const { input } = (identitySingleton.send as jest.Mock).mock.calls[0][0]
      expect(input).toEqual({
        UserPoolId: 'test-pool-id',
        Username: 'testuser',
        Password: 'newPassword123',
        Permanent: true
      })
    })
  })

  describe('delete', () => {
    test('Should call AdminDeleteUserCommand with correct values', async () => {
      await identityGateway.delete({
        username: 'testuser',
        userPoolId: 'test-pool-id'
      })

      expect(identitySingleton.send).toHaveBeenCalledWith(expect.any(AdminDeleteUserCommand))
      const { input } = (identitySingleton.send as jest.Mock).mock.calls[0][0]
      expect(input).toEqual({
        Username: 'testuser',
        UserPoolId: 'test-pool-id'
      })
    })
  })

  describe('refreshToken', () => {
    test('Should call InitiateAuthCommand with correct values', async () => {
      await identityGateway.refreshToken({
        refreshToken: 'refreshToken123',
        clientId: 'test-client-id'
      })

      expect(identitySingleton.send).toHaveBeenCalledWith(expect.any(InitiateAuthCommand))
      const { input } = (identitySingleton.send as jest.Mock).mock.calls[0][0]
      expect(input).toEqual({
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: 'test-client-id',
        AuthParameters: { REFRESH_TOKEN: 'refreshToken123' }
      })
    })
  })

  describe('login', () => {
    test('Should call InitiateAuthCommand with correct values', async () => {
      await identityGateway.login({
        clientId: 'test-client-id',
        username: 'testuser',
        password: 'password123'
      })

      expect(identitySingleton.send).toHaveBeenCalledWith(expect.any(InitiateAuthCommand))
      const { input } = (identitySingleton.send as jest.Mock).mock.calls[0][0]
      expect(input).toEqual({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: 'test-client-id',
        AuthParameters: {
          USERNAME: 'testuser',
          PASSWORD: 'password123'
        }
      })
    })
  })
})
