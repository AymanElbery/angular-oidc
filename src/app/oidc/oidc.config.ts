import { LogLevel } from 'angular-auth-oidc-client';

export const open_id_configs = {
    authority: 'https://iam.seu.edu.sa:443/oauth2',
    authWellknownEndpointUrl: 'https://iam.seu.edu.sa/.well-known/openid-configuration',
    redirectUrl: "http://localhost:4200",
    postLogoutRedirectUri: "http://localhost:4200",
    clientId: 'SSNewClient',
    configId: 'SSNewClient',
    scope: 'SSNewResServer.openid SSNewResServer.Email SSNewResServer.Offline_access SSNewResServer.profile',
    responseType: 'code',
    disableIdTokenValidation: true,
    silentRenew: true,
    useRefreshToken: true,
    autoUserInfo: false,
    usePushedAuthorisationRequests: false,
    renewUserInfoAfterTokenRenew: false,
    logLevel: LogLevel.Debug,
    historyCleanupOff: true,
    triggerAuthorizationResultEvent: true,
    //postLoginRoute: '/home',
    forbiddenRoute: '/forbidden',
    unauthorizedRoute: '/unauthorized',
    customParamsAuthRequest:{
      domain: 'SSNewDomain'
    },
    customParamsCodeRequest:{
      domain: 'SSNewDomain'
    }
}