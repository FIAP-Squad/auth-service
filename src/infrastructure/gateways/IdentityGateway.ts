import { InitiateAuthCommand, AdminSetUserPasswordCommand, AdminCreateUserCommand, AdminDeleteUserCommand, type AdminCreateUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider'
import { identitySingleton } from '@/infrastructure'

enum AUTH_FLOW {
  REFRESH_TOKEN_AUTH = 'REFRESH_TOKEN_AUTH',
  USER_PASSWORD_AUTH = 'USER_PASSWORD_AUTH'
}

type AuthenticationResult = {
  AccessToken?: string
  ExpiresIn?: number
  IdToken?: string
  NewDeviceMetadata?: any
  RefreshToken?: string
}

type CognitoUser = {
  userPoolId: string
  email: string
  username: string
  password: string
  customAttributes?: Record<any, any>
}

export interface IIdentityGateway {
  create: (user: CognitoUser) => Promise<AdminCreateUserCommandOutput>
  updatePassword: ({ userPoolId, username, password }) => Promise<void>
  refreshToken: ({ refreshToken, clientId }) => Promise<AuthenticationResult>
  login: ({ clientId, username, password }) => Promise<AuthenticationResult>
}

export class IdentityGateway implements IIdentityGateway {
  async delete ({ username, userPoolId }): Promise<void> {
    await identitySingleton.send(new AdminDeleteUserCommand({ Username: username, UserPoolId: userPoolId }))
  }

  async create ({
    userPoolId,
    email,
    username,
    password,
    customAttributes
  }: CognitoUser): Promise<AdminCreateUserCommandOutput> {
    const userAttributes = [
      { Name: 'email_verified', Value: 'true' },
      { Name: 'email', Value: email }
    ]
    Object.entries(customAttributes).forEach(([key, value]) => userAttributes.push({ Name: `custom:${key}`, Value: value }))
    const response = await identitySingleton.send(new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: username,
      TemporaryPassword: password,
      MessageAction: 'SUPPRESS',
      UserAttributes: userAttributes
    }))
    return response
  }

  async updatePassword ({ userPoolId, username, password }): Promise<void> {
    await identitySingleton.send(new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: username,
      Password: password,
      Permanent: true
    }))
  }

  async refreshToken ({ refreshToken, clientId }): Promise<AuthenticationResult> {
    const token = await identitySingleton.send(new InitiateAuthCommand({
      AuthFlow: AUTH_FLOW.REFRESH_TOKEN_AUTH,
      ClientId: clientId,
      AuthParameters: { REFRESH_TOKEN: refreshToken }
    }))
    return token.AuthenticationResult
  }

  async login ({ clientId, username, password }): Promise<AuthenticationResult> {
    const response = await identitySingleton.send(new InitiateAuthCommand({
      AuthFlow: AUTH_FLOW.USER_PASSWORD_AUTH,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    }))
    return response.AuthenticationResult
  }
}
