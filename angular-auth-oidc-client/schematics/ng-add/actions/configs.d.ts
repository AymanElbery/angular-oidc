declare const DEFAULT_CONFIG = "{\n              authority: '<authorityUrlOrTenantId>',\n              redirectUrl: window.location.origin,\n              postLogoutRedirectUri: window.location.origin,\n              clientId: 'please-enter-clientId',\n              scope: 'please-enter-scopes', // 'openid profile offline_access ' + your scopes\n              responseType: 'code',\n              silentRenew: true,\n              useRefreshToken: true,\n              renewTimeBeforeTokenExpiresInSeconds: 30,\n          }";
declare const IFRAME_SILENT_RENEW = "{\n            authority: '<authorityUrlOrTenantId>',\n            redirectUrl: window.location.origin,\n            postLogoutRedirectUri: window.location.origin,\n            clientId: 'please-enter-clientId',\n            scope: 'please-enter-scopes', // 'openid profile ' + your scopes\n            responseType: 'code',\n            silentRenew: true,\n            silentRenewUrl: window.location.origin + '/silent-renew.html',\n            renewTimeBeforeTokenExpiresInSeconds: 10,\n        }";
declare const AZURE_AD_SILENT_RENEW = "{\n            authority: 'https://login.microsoftonline.com/<authorityUrlOrTenantId>/v2.0',\n            authWellknownEndpoint: 'https://login.microsoftonline.com/common/v2.0',\n            redirectUrl: window.location.origin,\n            clientId: 'please-enter-clientId',\n            scope: 'please-enter-scopes', // 'openid profile ' + your scopes\n            responseType: 'code',\n            silentRenew: true,\n            maxIdTokenIatOffsetAllowedInSeconds: 600,\n            issValidationOff: false,\n            autoUserInfo: false,\n            silentRenewUrl: window.location.origin + '/silent-renew.html',\n            customParamsAuthRequest: {\n              prompt: 'select_account', // login, consent\n            },\n        }";
declare const AZURE_AD_REFRESH_TOKENS = "{\n            authority: 'https://login.microsoftonline.com/<authorityUrlOrTenantId>/v2.0',\n            authWellknownEndpoint: 'https://login.microsoftonline.com/common/v2.0',\n            redirectUrl: window.location.origin,\n            clientId: 'please-enter-clientId',\n            scope: 'please-enter-scopes', // 'openid profile offline_access ' + your scopes\n            responseType: 'code',\n            silentRenew: true,\n            useRefreshToken: true,\n            maxIdTokenIatOffsetAllowedInSeconds: 600,\n            issValidationOff: false,\n            autoUserInfo: false,\n            customParamsAuthRequest: {\n              prompt: 'select_account', // login, consent\n            },\n    }";
declare const OAUTH_PAR = "{\n            authority: '<authorityUrlOrTenantId>',\n            redirectUrl: window.location.origin,\n            postLogoutRedirectUri: window.location.origin,\n            clientId: 'please-enter-clientId',\n            usePushedAuthorisationRequests: true,\n            scope: 'please-enter-scopes', // 'openid profile offline_access ' + your scopes\n            responseType: 'code',\n            silentRenew: true,\n            useRefreshToken: true,\n            ignoreNonceAfterRefresh: true,\n            customParamsAuthRequest: {\n              prompt: 'consent', // login, consent\n            },\n    }";
declare const AUTH_0 = "{\n            authority: '<authorityUrlOrTenantId>',\n            redirectUrl: window.location.origin,\n            clientId: 'please-enter-auth0-clientId',\n            scope: 'openid profile offline_access',\n            responseType: 'code',\n            silentRenew: true,\n            useRefreshToken: true,\n        }";
declare const OIDC_PLAIN = "{\n            authority: '<authorityUrlOrTenantId>',\n            redirectUrl: window.location.origin,\n            postLogoutRedirectUri: window.location.origin,\n            clientId: 'please-enter-clientId',\n            scope: 'please-enter-scopes', // 'openid profile ' + your scopes\n            responseType: 'code',\n            silentRenew: false,\n            renewTimeBeforeTokenExpiresInSeconds: 10,\n        }";
export { DEFAULT_CONFIG, AZURE_AD_SILENT_RENEW, IFRAME_SILENT_RENEW, AZURE_AD_REFRESH_TOKENS, OIDC_PLAIN, AUTH_0, OAUTH_PAR };