"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAUTH_PAR = exports.AUTH_0 = exports.OIDC_PLAIN = exports.AZURE_AD_REFRESH_TOKENS = exports.IFRAME_SILENT_RENEW = exports.AZURE_AD_SILENT_RENEW = exports.DEFAULT_CONFIG = void 0;
const DEFAULT_CONFIG = `{
              authority: '<authorityUrlOrTenantId>',
              redirectUrl: window.location.origin,
              postLogoutRedirectUri: window.location.origin,
              clientId: 'please-enter-clientId',
              scope: 'please-enter-scopes', // 'openid profile offline_access ' + your scopes
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: true,
              renewTimeBeforeTokenExpiresInSeconds: 30,
          }`;
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
const IFRAME_SILENT_RENEW = `{
            authority: '<authorityUrlOrTenantId>',
            redirectUrl: window.location.origin,
            postLogoutRedirectUri: window.location.origin,
            clientId: 'please-enter-clientId',
            scope: 'please-enter-scopes', // 'openid profile ' + your scopes
            responseType: 'code',
            silentRenew: true,
            silentRenewUrl: window.location.origin + '/silent-renew.html',
            renewTimeBeforeTokenExpiresInSeconds: 10,
        }`;
exports.IFRAME_SILENT_RENEW = IFRAME_SILENT_RENEW;
const AZURE_AD_SILENT_RENEW = `{
            authority: 'https://login.microsoftonline.com/<authorityUrlOrTenantId>/v2.0',
            authWellknownEndpoint: 'https://login.microsoftonline.com/common/v2.0',
            redirectUrl: window.location.origin,
            clientId: 'please-enter-clientId',
            scope: 'please-enter-scopes', // 'openid profile ' + your scopes
            responseType: 'code',
            silentRenew: true,
            maxIdTokenIatOffsetAllowedInSeconds: 600,
            issValidationOff: false,
            autoUserInfo: false,
            silentRenewUrl: window.location.origin + '/silent-renew.html',
            customParamsAuthRequest: {
              prompt: 'select_account', // login, consent
            },
        }`;
exports.AZURE_AD_SILENT_RENEW = AZURE_AD_SILENT_RENEW;
const AZURE_AD_REFRESH_TOKENS = `{
            authority: 'https://login.microsoftonline.com/<authorityUrlOrTenantId>/v2.0',
            authWellknownEndpoint: 'https://login.microsoftonline.com/common/v2.0',
            redirectUrl: window.location.origin,
            clientId: 'please-enter-clientId',
            scope: 'please-enter-scopes', // 'openid profile offline_access ' + your scopes
            responseType: 'code',
            silentRenew: true,
            useRefreshToken: true,
            maxIdTokenIatOffsetAllowedInSeconds: 600,
            issValidationOff: false,
            autoUserInfo: false,
            customParamsAuthRequest: {
              prompt: 'select_account', // login, consent
            },
    }`;
exports.AZURE_AD_REFRESH_TOKENS = AZURE_AD_REFRESH_TOKENS;
const OAUTH_PAR = `{
            authority: '<authorityUrlOrTenantId>',
            redirectUrl: window.location.origin,
            postLogoutRedirectUri: window.location.origin,
            clientId: 'please-enter-clientId',
            usePushedAuthorisationRequests: true,
            scope: 'please-enter-scopes', // 'openid profile offline_access ' + your scopes
            responseType: 'code',
            silentRenew: true,
            useRefreshToken: true,
            ignoreNonceAfterRefresh: true,
            customParamsAuthRequest: {
              prompt: 'consent', // login, consent
            },
    }`;
exports.OAUTH_PAR = OAUTH_PAR;
const AUTH_0 = `{
            authority: '<authorityUrlOrTenantId>',
            redirectUrl: window.location.origin,
            clientId: 'please-enter-auth0-clientId',
            scope: 'openid profile offline_access',
            responseType: 'code',
            silentRenew: true,
            useRefreshToken: true,
        }`;
exports.AUTH_0 = AUTH_0;
const OIDC_PLAIN = `{
            authority: '<authorityUrlOrTenantId>',
            redirectUrl: window.location.origin,
            postLogoutRedirectUri: window.location.origin,
            clientId: 'please-enter-clientId',
            scope: 'please-enter-scopes', // 'openid profile ' + your scopes
            responseType: 'code',
            silentRenew: false,
            renewTimeBeforeTokenExpiresInSeconds: 10,
        }`;
exports.OIDC_PLAIN = OIDC_PLAIN;
//# sourceMappingURL=configs.js.map