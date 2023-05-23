import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UriEncoder } from './uri-encoder';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../flows/flows-data.service";
import * as i3 from "../flowHelper/flow-helper.service";
import * as i4 from "../../storage/storage-persistence.service";
import * as i5 from "../../validation/jwt-window-crypto.service";
const CALLBACK_PARAMS_TO_CHECK = ['code', 'state', 'token', 'id_token'];
const AUTH0_ENDPOINT = 'auth0.com';
export class UrlService {
    constructor(loggerService, flowsDataService, flowHelper, storagePersistenceService, jwtWindowCryptoService) {
        this.loggerService = loggerService;
        this.flowsDataService = flowsDataService;
        this.flowHelper = flowHelper;
        this.storagePersistenceService = storagePersistenceService;
        this.jwtWindowCryptoService = jwtWindowCryptoService;
    }
    getUrlParameter(urlToCheck, name) {
        if (!urlToCheck) {
            return '';
        }
        if (!name) {
            return '';
        }
        name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&#]' + name + '=([^&#]*)');
        const results = regex.exec(urlToCheck);
        return results === null ? '' : decodeURIComponent(results[1]);
    }
    isCallbackFromSts(currentUrl) {
        return CALLBACK_PARAMS_TO_CHECK.some((x) => !!this.getUrlParameter(currentUrl, x));
    }
    getRefreshSessionSilentRenewUrl(config, customParams) {
        if (this.flowHelper.isCurrentFlowCodeFlow(config)) {
            return this.createUrlCodeFlowWithSilentRenew(config, customParams);
        }
        return of(this.createUrlImplicitFlowWithSilentRenew(config, customParams) || '');
    }
    getAuthorizeParUrl(requestUri, configuration) {
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints', configuration);
        if (!authWellKnownEndPoints) {
            this.loggerService.logError(configuration, 'authWellKnownEndpoints is undefined');
            return null;
        }
        const authorizationEndpoint = authWellKnownEndPoints.authorizationEndpoint;
        if (!authorizationEndpoint) {
            this.loggerService.logError(configuration, `Can not create an authorize URL when authorizationEndpoint is '${authorizationEndpoint}'`);
            return null;
        }
        const { clientId } = configuration;
        if (!clientId) {
            this.loggerService.logError(configuration, `getAuthorizeParUrl could not add clientId because it was: `, clientId);
            return null;
        }
        const urlParts = authorizationEndpoint.split('?');
        const authorizationUrl = urlParts[0];
        const existingParams = urlParts[1];
        let params = this.createHttpParams(existingParams);
        params = params.set('request_uri', requestUri);
        params = params.append('client_id', clientId);
        return `${authorizationUrl}?${params}`;
    }
    getAuthorizeUrl(config, authOptions) {
        if (this.flowHelper.isCurrentFlowCodeFlow(config)) {
            return this.createUrlCodeFlowAuthorize(config, authOptions);
        }
        return of(this.createUrlImplicitFlowAuthorize(config, authOptions) || '');
    }
    getEndSessionEndpoint(configuration) {
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints', configuration);
        const endSessionEndpoint = authWellKnownEndPoints?.endSessionEndpoint;
        if (!endSessionEndpoint) {
            return {
                url: '',
                existingParams: '',
            };
        }
        const urlParts = endSessionEndpoint.split('?');
        const url = urlParts[0];
        const existingParams = urlParts[1] ?? '';
        return {
            url,
            existingParams,
        };
    }
    getEndSessionUrl(configuration, customParams) {
        const idToken = this.storagePersistenceService.getIdToken(configuration);
        const { customParamsEndSessionRequest } = configuration;
        const mergedParams = { ...customParamsEndSessionRequest, ...customParams };
        return this.createEndSessionUrl(idToken, configuration, mergedParams);
    }
    createRevocationEndpointBodyAccessToken(token, configuration) {
        const clientId = this.getClientId(configuration);
        if (!clientId) {
            return null;
        }
        let params = this.createHttpParams();
        params = params.set('client_id', clientId);
        params = params.set('token', token);
        params = params.set('token_type_hint', 'access_token');
        return params.toString();
    }
    createRevocationEndpointBodyRefreshToken(token, configuration) {
        const clientId = this.getClientId(configuration);
        if (!clientId) {
            return null;
        }
        let params = this.createHttpParams();
        params = params.set('client_id', clientId);
        params = params.set('token', token);
        params = params.set('token_type_hint', 'refresh_token');
        return params.toString();
    }
    getRevocationEndpointUrl(configuration) {
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints', configuration);
        const revocationEndpoint = authWellKnownEndPoints?.revocationEndpoint;
        if (!revocationEndpoint) {
            return null;
        }
        const urlParts = revocationEndpoint.split('?');
        const revocationEndpointUrl = urlParts[0];
        return revocationEndpointUrl;
    }
    createBodyForCodeFlowCodeRequest(code, configuration, customTokenParams) {
        const clientId = this.getClientId(configuration);
        if (!clientId) {
            return null;
        }
        let params = this.createHttpParams();
        params = params.set('grant_type', 'authorization_code');
        params = params.set('client_id', clientId);
        if (!configuration.disablePkce) {
            const codeVerifier = this.flowsDataService.getCodeVerifier(configuration);
            if (!codeVerifier) {
                this.loggerService.logError(configuration, `CodeVerifier is not set `, codeVerifier);
                return null;
            }
            params = params.set('code_verifier', codeVerifier);
        }
        params = params.set('code', code);
        if (customTokenParams) {
            params = this.appendCustomParams({ ...customTokenParams }, params);
        }
        const silentRenewUrl = this.getSilentRenewUrl(configuration);
        if (this.flowsDataService.isSilentRenewRunning(configuration) && silentRenewUrl) {
            params = params.set('redirect_uri', silentRenewUrl);
            return params.toString();
        }
        const redirectUrl = this.getRedirectUrl(configuration);
        if (!redirectUrl) {
            return null;
        }
        params = params.set('redirect_uri', redirectUrl);
        return params.toString();
    }
    createBodyForCodeFlowRefreshTokensRequest(refreshToken, configuration, customParamsRefresh) {
        const clientId = this.getClientId(configuration);
        if (!clientId) {
            return null;
        }
        let params = this.createHttpParams();
        params = params.set('grant_type', 'refresh_token');
        params = params.set('client_id', clientId);
        params = params.set('refresh_token', refreshToken);
        if (customParamsRefresh) {
            params = this.appendCustomParams({ ...customParamsRefresh }, params);
        }
        return params.toString();
    }
    createBodyForParCodeFlowRequest(configuration, customParamsRequest) {
        const redirectUrl = this.getRedirectUrl(configuration);
        if (!redirectUrl) {
            return of(null);
        }
        const state = this.flowsDataService.getExistingOrCreateAuthStateControl(configuration);
        const nonce = this.flowsDataService.createNonce(configuration);
        this.loggerService.logDebug(configuration, 'Authorize created. adding myautostate: ' + state);
        // code_challenge with "S256"
        const codeVerifier = this.flowsDataService.createCodeVerifier(configuration);
        return this.jwtWindowCryptoService.generateCodeChallenge(codeVerifier).pipe(map((codeChallenge) => {
            const { clientId, responseType, scope, hdParam, customParamsAuthRequest } = configuration;
            let params = this.createHttpParams('');
            params = params.set('client_id', clientId);
            params = params.append('redirect_uri', redirectUrl);
            params = params.append('response_type', responseType);
            params = params.append('scope', scope);
            params = params.append('nonce', nonce);
            params = params.append('state', state);
            params = params.append('code_challenge', codeChallenge);
            params = params.append('code_challenge_method', 'S256');
            if (hdParam) {
                params = params.append('hd', hdParam);
            }
            if (customParamsAuthRequest) {
                params = this.appendCustomParams({ ...customParamsAuthRequest }, params);
            }
            if (customParamsRequest) {
                params = this.appendCustomParams({ ...customParamsRequest }, params);
            }
            return params.toString();
        }));
    }
    getPostLogoutRedirectUrl(configuration) {
        const { postLogoutRedirectUri } = configuration;
        if (!postLogoutRedirectUri) {
            this.loggerService.logError(configuration, `could not get postLogoutRedirectUri, was: `, postLogoutRedirectUri);
            return null;
        }
        return postLogoutRedirectUri;
    }
    createEndSessionUrl(idTokenHint, configuration, customParamsEndSession) {
        // Auth0 needs a special logout url
        // See https://auth0.com/docs/api/authentication#logout
        if (this.isAuth0Endpoint(configuration)) {
            return this.composeAuth0Endpoint(configuration);
        }
        const { url, existingParams } = this.getEndSessionEndpoint(configuration);
        if (!url) {
            return null;
        }
        let params = this.createHttpParams(existingParams);
        if (!!idTokenHint) {
            params = params.set('id_token_hint', idTokenHint);
        }
        const postLogoutRedirectUri = this.getPostLogoutRedirectUrl(configuration);
        if (postLogoutRedirectUri) {
            params = params.append('post_logout_redirect_uri', postLogoutRedirectUri);
        }
        if (customParamsEndSession) {
            params = this.appendCustomParams({ ...customParamsEndSession }, params);
        }
        return `${url}?${params}`;
    }
    createAuthorizeUrl(codeChallenge, redirectUrl, nonce, state, configuration, prompt, customRequestParams) {
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints', configuration);
        const authorizationEndpoint = authWellKnownEndPoints?.authorizationEndpoint;
        if (!authorizationEndpoint) {
            this.loggerService.logError(configuration, `Can not create an authorize URL when authorizationEndpoint is '${authorizationEndpoint}'`);
            return null;
        }
        const { clientId, responseType, scope, hdParam, customParamsAuthRequest } = configuration;
        if (!clientId) {
            this.loggerService.logError(configuration, `createAuthorizeUrl could not add clientId because it was: `, clientId);
            return null;
        }
        if (!responseType) {
            this.loggerService.logError(configuration, `createAuthorizeUrl could not add responseType because it was: `, responseType);
            return null;
        }
        if (!scope) {
            this.loggerService.logError(configuration, `createAuthorizeUrl could not add scope because it was: `, scope);
            return null;
        }
        const urlParts = authorizationEndpoint.split('?');
        const authorizationUrl = urlParts[0];
        const existingParams = urlParts[1];
        let params = this.createHttpParams(existingParams);
        params = params.set('client_id', clientId);
        params = params.append('redirect_uri', redirectUrl);
        params = params.append('response_type', responseType);
        params = params.append('scope', scope);
        params = params.append('nonce', nonce);
        params = params.append('state', state);
        if (this.flowHelper.isCurrentFlowCodeFlow(configuration) && codeChallenge !== null) {
            params = params.append('code_challenge', codeChallenge);
            params = params.append('code_challenge_method', 'S256');
        }
        const mergedParams = { ...customParamsAuthRequest, ...customRequestParams };
        if (Object.keys(mergedParams).length > 0) {
            params = this.appendCustomParams({ ...mergedParams }, params);
        }
        if (prompt) {
            params = this.overWriteParam(params, 'prompt', prompt);
        }
        if (hdParam) {
            params = params.append('hd', hdParam);
        }
        return `${authorizationUrl}?${params}`;
    }
    createUrlImplicitFlowWithSilentRenew(configuration, customParams) {
        const state = this.flowsDataService.getExistingOrCreateAuthStateControl(configuration);
        const nonce = this.flowsDataService.createNonce(configuration);
        const silentRenewUrl = this.getSilentRenewUrl(configuration);
        if (!silentRenewUrl) {
            return null;
        }
        this.loggerService.logDebug(configuration, 'RefreshSession created. adding myautostate: ', state);
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints', configuration);
        if (authWellKnownEndPoints) {
            return this.createAuthorizeUrl('', silentRenewUrl, nonce, state, configuration, 'none', customParams);
        }
        this.loggerService.logError(configuration, 'authWellKnownEndpoints is undefined');
        return null;
    }
    createUrlCodeFlowWithSilentRenew(configuration, customParams) {
        const state = this.flowsDataService.getExistingOrCreateAuthStateControl(configuration);
        const nonce = this.flowsDataService.createNonce(configuration);
        this.loggerService.logDebug(configuration, 'RefreshSession created. adding myautostate: ' + state);
        // code_challenge with "S256"
        const codeVerifier = this.flowsDataService.createCodeVerifier(configuration);
        return this.jwtWindowCryptoService.generateCodeChallenge(codeVerifier).pipe(map((codeChallenge) => {
            const silentRenewUrl = this.getSilentRenewUrl(configuration);
            if (!silentRenewUrl) {
                return '';
            }
            const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints', configuration);
            if (authWellKnownEndPoints) {
                return this.createAuthorizeUrl(codeChallenge, silentRenewUrl, nonce, state, configuration, 'none', customParams);
            }
            this.loggerService.logWarning(configuration, 'authWellKnownEndpoints is undefined');
            return null;
        }));
    }
    createUrlImplicitFlowAuthorize(configuration, authOptions) {
        const state = this.flowsDataService.getExistingOrCreateAuthStateControl(configuration);
        const nonce = this.flowsDataService.createNonce(configuration);
        this.loggerService.logDebug(configuration, 'Authorize created. adding myautostate: ' + state);
        const redirectUrl = this.getRedirectUrl(configuration, authOptions);
        if (!redirectUrl) {
            return null;
        }
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints', configuration);
        if (authWellKnownEndPoints) {
            const { customParams } = authOptions || {};
            return this.createAuthorizeUrl('', redirectUrl, nonce, state, configuration, null, customParams);
        }
        this.loggerService.logError(configuration, 'authWellKnownEndpoints is undefined');
        return null;
    }
    createUrlCodeFlowAuthorize(config, authOptions) {
        const state = this.flowsDataService.getExistingOrCreateAuthStateControl(config);
        const nonce = this.flowsDataService.createNonce(config);
        this.loggerService.logDebug(config, 'Authorize created. adding myautostate: ' + state);
        const redirectUrl = this.getRedirectUrl(config, authOptions);
        if (!redirectUrl) {
            return of(null);
        }
        return this.getCodeChallenge(config).pipe(map((codeChallenge) => {
            const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints', config);
            if (authWellKnownEndPoints) {
                const { customParams } = authOptions || {};
                return this.createAuthorizeUrl(codeChallenge, redirectUrl, nonce, state, config, null, customParams);
            }
            this.loggerService.logError(config, 'authWellKnownEndpoints is undefined');
            return '';
        }));
    }
    getCodeChallenge(config) {
        if (config.disablePkce) {
            return of(null);
        }
        // code_challenge with "S256"
        const codeVerifier = this.flowsDataService.createCodeVerifier(config);
        return this.jwtWindowCryptoService.generateCodeChallenge(codeVerifier);
    }
    getRedirectUrl(configuration, authOptions) {
        let { redirectUrl } = configuration;
        if (authOptions?.redirectUrl) {
            // override by redirectUrl from authOptions
            redirectUrl = authOptions.redirectUrl;
        }
        if (!redirectUrl) {
            this.loggerService.logError(configuration, `could not get redirectUrl, was: `, redirectUrl);
            return null;
        }
        return redirectUrl;
    }
    getSilentRenewUrl(configuration) {
        const { silentRenewUrl } = configuration;
        if (!silentRenewUrl) {
            this.loggerService.logError(configuration, `could not get silentRenewUrl, was: `, silentRenewUrl);
            return null;
        }
        return silentRenewUrl;
    }
    getClientId(configuration) {
        const { clientId } = configuration;
        if (!clientId) {
            this.loggerService.logError(configuration, `could not get clientId, was: `, clientId);
            return null;
        }
        return clientId;
    }
    appendCustomParams(customParams, params) {
        for (const [key, value] of Object.entries({ ...customParams })) {
            params = params.append(key, value.toString());
        }
        return params;
    }
    overWriteParam(params, key, value) {
        return params.set(key, value);
    }
    createHttpParams(existingParams) {
        existingParams = existingParams ?? '';
        const params = new HttpParams({
            fromString: existingParams,
            encoder: new UriEncoder(),
        });
        return params;
    }
    isAuth0Endpoint(configuration) {
        const { authority } = configuration;
        if (!authority) {
            return false;
        }
        return authority.endsWith(AUTH0_ENDPOINT);
    }
    composeAuth0Endpoint(configuration) {
        // format: https://YOUR_DOMAIN/v2/logout?client_id=YOUR_CLIENT_ID&returnTo=LOGOUT_URL
        const { authority, clientId } = configuration;
        const postLogoutRedirectUrl = this.getPostLogoutRedirectUrl(configuration);
        return `${authority}/v2/logout?client_id=${clientId}&returnTo=${postLogoutRedirectUrl}`;
    }
}
UrlService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: UrlService, deps: [{ token: i1.LoggerService }, { token: i2.FlowsDataService }, { token: i3.FlowHelper }, { token: i4.StoragePersistenceService }, { token: i5.JwtWindowCryptoService }], target: i0.ɵɵFactoryTarget.Injectable });
UrlService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: UrlService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: UrlService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LoggerService }, { type: i2.FlowsDataService }, { type: i3.FlowHelper }, { type: i4.StoragePersistenceService }, { type: i5.JwtWindowCryptoService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi91dGlscy91cmwvdXJsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFRckMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7OztBQUUzQyxNQUFNLHdCQUF3QixHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEUsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDO0FBR25DLE1BQU0sT0FBTyxVQUFVO0lBQ3JCLFlBQ21CLGFBQTRCLEVBQzVCLGdCQUFrQyxFQUNsQyxVQUFzQixFQUN0Qix5QkFBb0QsRUFDcEQsc0JBQThDO1FBSjlDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0Qiw4QkFBeUIsR0FBekIseUJBQXlCLENBQTJCO1FBQ3BELDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7SUFDOUQsQ0FBQztJQUVKLGVBQWUsQ0FBQyxVQUFrQixFQUFFLElBQVk7UUFDOUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNmLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUVELElBQUksR0FBRyxJQUFJLENBQUMs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QUFWLFVBQVU7MkZBQVYsVUFBVTtrQkFEdEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBQYXJhbXMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBBdXRoT3B0aW9ucyB9IGZyb20gJy4uLy4uL2F1dGgtb3B0aW9ucyc7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi9jb25maWcvb3BlbmlkLWNvbmZpZ3VyYXRpb24nO1xyXG5pbXBvcnQgeyBGbG93c0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vZmxvd3MvZmxvd3MtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc3RvcmFnZS9zdG9yYWdlLXBlcnNpc3RlbmNlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBKd3RXaW5kb3dDcnlwdG9TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdmFsaWRhdGlvbi9qd3Qtd2luZG93LWNyeXB0by5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmxvd0hlbHBlciB9IGZyb20gJy4uL2Zsb3dIZWxwZXIvZmxvdy1oZWxwZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFVyaUVuY29kZXIgfSBmcm9tICcuL3VyaS1lbmNvZGVyJztcclxuXHJcbmNvbnN0IENBTExCQUNLX1BBUkFNU19UT19DSEVDSyA9IFsnY29kZScsICdzdGF0ZScsICd0b2tlbicsICdpZF90b2tlbiddO1xyXG5jb25zdCBBVVRIMF9FTkRQT0lOVCA9ICdhdXRoMC5jb20nO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVXJsU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dIZWxwZXI6IEZsb3dIZWxwZXIsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2U6IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGp3dFdpbmRvd0NyeXB0b1NlcnZpY2U6IEp3dFdpbmRvd0NyeXB0b1NlcnZpY2VcclxuICApIHt9XHJcblxyXG4gIGdldFVybFBhcmFtZXRlcih1cmxUb0NoZWNrOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBpZiAoIXVybFRvQ2hlY2spIHtcclxuICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghbmFtZSkge1xyXG4gICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1tdLywgJ1xcXFxbJykucmVwbGFjZSgvW1xcXV0vLCAnXFxcXF0nKTtcclxuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cCgnW1xcXFw/JiNdJyArIG5hbWUgKyAnPShbXiYjXSopJyk7XHJcbiAgICBjb25zdCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmxUb0NoZWNrKTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0cyA9PT0gbnVsbCA/ICcnIDogZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMV0pO1xyXG4gIH1cclxuXHJcbiAgaXNDYWxsYmFja0Zyb21TdHMoY3VycmVudFVybDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gQ0FMTEJBQ0tfUEFSQU1TX1RPX0NIRUNLLnNvbWUoKHgpID0+ICEhdGhpcy5nZXRVcmxQYXJhbWV0ZXIoY3VycmVudFVybCwgeCkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVmcmVzaFNlc3Npb25TaWxlbnRSZW5ld1VybChcclxuICAgIGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIGN1c3RvbVBhcmFtcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9XHJcbiAgKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcclxuICAgIGlmICh0aGlzLmZsb3dIZWxwZXIuaXNDdXJyZW50Rmxvd0NvZGVGbG93KGNvbmZpZykpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlVXJsQ29kZUZsb3dXaXRoU2lsZW50UmVuZXcoY29uZmlnLCBjdXN0b21QYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvZih0aGlzLmNyZWF0ZVVybEltcGxpY2l0Rmxvd1dpdGhTaWxlbnRSZW5ldyhjb25maWcsIGN1c3RvbVBhcmFtcykgfHwgJycpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXV0aG9yaXplUGFyVXJsKHJlcXVlc3RVcmk6IHN0cmluZywgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbik6IHN0cmluZyB7XHJcbiAgICBjb25zdCBhdXRoV2VsbEtub3duRW5kUG9pbnRzID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnLCBjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICBpZiAoIWF1dGhXZWxsS25vd25FbmRQb2ludHMpIHtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGNvbmZpZ3VyYXRpb24sICdhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXV0aG9yaXphdGlvbkVuZHBvaW50ID0gYXV0aFdlbGxLbm93bkVuZFBvaW50cy5hdXRob3JpemF0aW9uRW5kcG9pbnQ7XHJcblxyXG4gICAgaWYgKCFhdXRob3JpemF0aW9uRW5kcG9pbnQpIHtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKFxyXG4gICAgICAgIGNvbmZpZ3VyYXRpb24sXHJcbiAgICAgICAgYENhbiBub3QgY3JlYXRlIGFuIGF1dGhvcml6ZSBVUkwgd2hlbiBhdXRob3JpemF0aW9uRW5kcG9pbnQgaXMgJyR7YXV0aG9yaXphdGlvbkVuZHBvaW50fSdgXHJcbiAgICAgICk7XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7IGNsaWVudElkIH0gPSBjb25maWd1cmF0aW9uO1xyXG5cclxuICAgIGlmICghY2xpZW50SWQpIHtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGNvbmZpZ3VyYXRpb24sIGBnZXRBdXRob3JpemVQYXJVcmwgY291bGQgbm90IGFkZCBjbGllbnRJZCBiZWNhdXNlIGl0IHdhczogYCwgY2xpZW50SWQpO1xyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdXJsUGFydHMgPSBhdXRob3JpemF0aW9uRW5kcG9pbnQuc3BsaXQoJz8nKTtcclxuICAgIGNvbnN0IGF1dGhvcml6YXRpb25VcmwgPSB1cmxQYXJ0c1swXTtcclxuICAgIGNvbnN0IGV4aXN0aW5nUGFyYW1zID0gdXJsUGFydHNbMV07XHJcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5jcmVhdGVIdHRwUGFyYW1zKGV4aXN0aW5nUGFyYW1zKTtcclxuXHJcbiAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KCdyZXF1ZXN0X3VyaScsIHJlcXVlc3RVcmkpO1xyXG4gICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnY2xpZW50X2lkJywgY2xpZW50SWQpO1xyXG5cclxuICAgIHJldHVybiBgJHthdXRob3JpemF0aW9uVXJsfT8ke3BhcmFtc31gO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXV0aG9yaXplVXJsKGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbiwgYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucyk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICBpZiAodGhpcy5mbG93SGVscGVyLmlzQ3VycmVudEZsb3dDb2RlRmxvdyhjb25maWcpKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVVybENvZGVGbG93QXV0aG9yaXplKGNvbmZpZywgYXV0aE9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvZih0aGlzLmNyZWF0ZVVybEltcGxpY2l0Rmxvd0F1dGhvcml6ZShjb25maWcsIGF1dGhPcHRpb25zKSB8fCAnJyk7XHJcbiAgfVxyXG5cclxuICBnZXRFbmRTZXNzaW9uRW5kcG9pbnQoY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbik6IHsgdXJsOiBzdHJpbmc7IGV4aXN0aW5nUGFyYW1zOiBzdHJpbmcgfSB7XHJcbiAgICBjb25zdCBhdXRoV2VsbEtub3duRW5kUG9pbnRzID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnLCBjb25maWd1cmF0aW9uKTtcclxuICAgIGNvbnN0IGVuZFNlc3Npb25FbmRwb2ludCA9IGF1dGhXZWxsS25vd25FbmRQb2ludHM/LmVuZFNlc3Npb25FbmRwb2ludDtcclxuXHJcbiAgICBpZiAoIWVuZFNlc3Npb25FbmRwb2ludCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHVybDogJycsXHJcbiAgICAgICAgZXhpc3RpbmdQYXJhbXM6ICcnLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHVybFBhcnRzID0gZW5kU2Vzc2lvbkVuZHBvaW50LnNwbGl0KCc/Jyk7XHJcbiAgICBjb25zdCB1cmwgPSB1cmxQYXJ0c1swXTtcclxuICAgIGNvbnN0IGV4aXN0aW5nUGFyYW1zID0gdXJsUGFydHNbMV0gPz8gJyc7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdXJsLFxyXG4gICAgICBleGlzdGluZ1BhcmFtcyxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBnZXRFbmRTZXNzaW9uVXJsKGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24sIGN1c3RvbVBhcmFtcz86IHsgW3A6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfSk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgY29uc3QgaWRUb2tlbiA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5nZXRJZFRva2VuKGNvbmZpZ3VyYXRpb24pO1xyXG4gICAgY29uc3QgeyBjdXN0b21QYXJhbXNFbmRTZXNzaW9uUmVxdWVzdCB9ID0gY29uZmlndXJhdGlvbjtcclxuICAgIGNvbnN0IG1lcmdlZFBhcmFtcyA9IHsgLi4uY3VzdG9tUGFyYW1zRW5kU2Vzc2lvblJlcXVlc3QsIC4uLmN1c3RvbVBhcmFtcyB9O1xyXG5cclxuICAgIHJldHVybiB0aGlzLmNyZWF0ZUVuZFNlc3Npb25VcmwoaWRUb2tlbiwgY29uZmlndXJhdGlvbiwgbWVyZ2VkUGFyYW1zKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVJldm9jYXRpb25FbmRwb2ludEJvZHlBY2Nlc3NUb2tlbih0b2tlbjogYW55LCBjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNsaWVudElkID0gdGhpcy5nZXRDbGllbnRJZChjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICBpZiAoIWNsaWVudElkKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBwYXJhbXMgPSB0aGlzLmNyZWF0ZUh0dHBQYXJhbXMoKTtcclxuXHJcbiAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KCdjbGllbnRfaWQnLCBjbGllbnRJZCk7XHJcbiAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KCd0b2tlbicsIHRva2VuKTtcclxuICAgIHBhcmFtcyA9IHBhcmFtcy5zZXQoJ3Rva2VuX3R5cGVfaGludCcsICdhY2Nlc3NfdG9rZW4nKTtcclxuXHJcbiAgICByZXR1cm4gcGFyYW1zLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVSZXZvY2F0aW9uRW5kcG9pbnRCb2R5UmVmcmVzaFRva2VuKHRva2VuOiBhbnksIGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2xpZW50SWQgPSB0aGlzLmdldENsaWVudElkKGNvbmZpZ3VyYXRpb24pO1xyXG5cclxuICAgIGlmICghY2xpZW50SWQpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHBhcmFtcyA9IHRoaXMuY3JlYXRlSHR0cFBhcmFtcygpO1xyXG5cclxuICAgIHBhcmFtcyA9IHBhcmFtcy5zZXQoJ2NsaWVudF9pZCcsIGNsaWVudElkKTtcclxuICAgIHBhcmFtcyA9IHBhcmFtcy5zZXQoJ3Rva2VuJywgdG9rZW4pO1xyXG4gICAgcGFyYW1zID0gcGFyYW1zLnNldCgndG9rZW5fdHlwZV9oaW50JywgJ3JlZnJlc2hfdG9rZW4nKTtcclxuXHJcbiAgICByZXR1cm4gcGFyYW1zLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICBnZXRSZXZvY2F0aW9uRW5kcG9pbnRVcmwoY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbik6IHN0cmluZyB7XHJcbiAgICBjb25zdCBhdXRoV2VsbEtub3duRW5kUG9pbnRzID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnLCBjb25maWd1cmF0aW9uKTtcclxuICAgIGNvbnN0IHJldm9jYXRpb25FbmRwb2ludCA9IGF1dGhXZWxsS25vd25FbmRQb2ludHM/LnJldm9jYXRpb25FbmRwb2ludDtcclxuXHJcbiAgICBpZiAoIXJldm9jYXRpb25FbmRwb2ludCkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB1cmxQYXJ0cyA9IHJldm9jYXRpb25FbmRwb2ludC5zcGxpdCgnPycpO1xyXG5cclxuICAgIGNvbnN0IHJldm9jYXRpb25FbmRwb2ludFVybCA9IHVybFBhcnRzWzBdO1xyXG5cclxuICAgIHJldHVybiByZXZvY2F0aW9uRW5kcG9pbnRVcmw7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVCb2R5Rm9yQ29kZUZsb3dDb2RlUmVxdWVzdChcclxuICAgIGNvZGU6IHN0cmluZyxcclxuICAgIGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24sXHJcbiAgICBjdXN0b21Ub2tlblBhcmFtcz86IHsgW3A6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfVxyXG4gICk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjbGllbnRJZCA9IHRoaXMuZ2V0Q2xpZW50SWQoY29uZmlndXJhdGlvbik7XHJcblxyXG4gICAgaWYgKCFjbGllbnRJZCkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5jcmVhdGVIdHRwUGFyYW1zKCk7XHJcblxyXG4gICAgcGFyYW1zID0gcGFyYW1zLnNldCgnZ3JhbnRfdHlwZScsICdhdXRob3JpemF0aW9uX2NvZGUnKTtcclxuICAgIHBhcmFtcyA9IHBhcmFtcy5zZXQoJ2NsaWVudF9pZCcsIGNsaWVudElkKTtcclxuXHJcbiAgICBpZiAoIWNvbmZpZ3VyYXRpb24uZGlzYWJsZVBrY2UpIHtcclxuICAgICAgY29uc3QgY29kZVZlcmlmaWVyID0gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmdldENvZGVWZXJpZmllcihjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICAgIGlmICghY29kZVZlcmlmaWVyKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGNvbmZpZ3VyYXRpb24sIGBDb2RlVmVyaWZpZXIgaXMgbm90IHNldCBgLCBjb2RlVmVyaWZpZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcGFyYW1zID0gcGFyYW1zLnNldCgnY29kZV92ZXJpZmllcicsIGNvZGVWZXJpZmllcik7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyYW1zID0gcGFyYW1zLnNldCgnY29kZScsIGNvZGUpO1xyXG5cclxuICAgIGlmIChjdXN0b21Ub2tlblBhcmFtcykge1xyXG4gICAgICBwYXJhbXMgPSB0aGlzLmFwcGVuZEN1c3RvbVBhcmFtcyh7IC4uLmN1c3RvbVRva2VuUGFyYW1zIH0sIHBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2lsZW50UmVuZXdVcmwgPSB0aGlzLmdldFNpbGVudFJlbmV3VXJsKGNvbmZpZ3VyYXRpb24pO1xyXG5cclxuICAgIGlmICh0aGlzLmZsb3dzRGF0YVNlcnZpY2UuaXNTaWxlbnRSZW5ld1J1bm5pbmcoY29uZmlndXJhdGlvbikgJiYgc2lsZW50UmVuZXdVcmwpIHtcclxuICAgICAgcGFyYW1zID0gcGFyYW1zLnNldCgncmVkaXJlY3RfdXJpJywgc2lsZW50UmVuZXdVcmwpO1xyXG5cclxuICAgICAgcmV0dXJuIHBhcmFtcy50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlZGlyZWN0VXJsID0gdGhpcy5nZXRSZWRpcmVjdFVybChjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICBpZiAoIXJlZGlyZWN0VXJsKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcmFtcyA9IHBhcmFtcy5zZXQoJ3JlZGlyZWN0X3VyaScsIHJlZGlyZWN0VXJsKTtcclxuXHJcbiAgICByZXR1cm4gcGFyYW1zLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVCb2R5Rm9yQ29kZUZsb3dSZWZyZXNoVG9rZW5zUmVxdWVzdChcclxuICAgIHJlZnJlc2hUb2tlbjogc3RyaW5nLFxyXG4gICAgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIGN1c3RvbVBhcmFtc1JlZnJlc2g/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfVxyXG4gICk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjbGllbnRJZCA9IHRoaXMuZ2V0Q2xpZW50SWQoY29uZmlndXJhdGlvbik7XHJcblxyXG4gICAgaWYgKCFjbGllbnRJZCkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5jcmVhdGVIdHRwUGFyYW1zKCk7XHJcblxyXG4gICAgcGFyYW1zID0gcGFyYW1zLnNldCgnZ3JhbnRfdHlwZScsICdyZWZyZXNoX3Rva2VuJyk7XHJcbiAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KCdjbGllbnRfaWQnLCBjbGllbnRJZCk7XHJcbiAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KCdyZWZyZXNoX3Rva2VuJywgcmVmcmVzaFRva2VuKTtcclxuXHJcbiAgICBpZiAoY3VzdG9tUGFyYW1zUmVmcmVzaCkge1xyXG4gICAgICBwYXJhbXMgPSB0aGlzLmFwcGVuZEN1c3RvbVBhcmFtcyh7IC4uLmN1c3RvbVBhcmFtc1JlZnJlc2ggfSwgcGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGFyYW1zLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVCb2R5Rm9yUGFyQ29kZUZsb3dSZXF1ZXN0KFxyXG4gICAgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIGN1c3RvbVBhcmFtc1JlcXVlc3Q/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfVxyXG4gICk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICBjb25zdCByZWRpcmVjdFVybCA9IHRoaXMuZ2V0UmVkaXJlY3RVcmwoY29uZmlndXJhdGlvbik7XHJcblxyXG4gICAgaWYgKCFyZWRpcmVjdFVybCkge1xyXG4gICAgICByZXR1cm4gb2YobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuZ2V0RXhpc3RpbmdPckNyZWF0ZUF1dGhTdGF0ZUNvbnRyb2woY29uZmlndXJhdGlvbik7XHJcbiAgICBjb25zdCBub25jZSA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5jcmVhdGVOb25jZShjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlndXJhdGlvbiwgJ0F1dGhvcml6ZSBjcmVhdGVkLiBhZGRpbmcgbXlhdXRvc3RhdGU6ICcgKyBzdGF0ZSk7XHJcblxyXG4gICAgLy8gY29kZV9jaGFsbGVuZ2Ugd2l0aCBcIlMyNTZcIlxyXG4gICAgY29uc3QgY29kZVZlcmlmaWVyID0gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmNyZWF0ZUNvZGVWZXJpZmllcihjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5qd3RXaW5kb3dDcnlwdG9TZXJ2aWNlLmdlbmVyYXRlQ29kZUNoYWxsZW5nZShjb2RlVmVyaWZpZXIpLnBpcGUoXHJcbiAgICAgIG1hcCgoY29kZUNoYWxsZW5nZTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBjbGllbnRJZCwgcmVzcG9uc2VUeXBlLCBzY29wZSwgaGRQYXJhbSwgY3VzdG9tUGFyYW1zQXV0aFJlcXVlc3QgfSA9IGNvbmZpZ3VyYXRpb247XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMuY3JlYXRlSHR0cFBhcmFtcygnJyk7XHJcblxyXG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcy5zZXQoJ2NsaWVudF9pZCcsIGNsaWVudElkKTtcclxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdyZWRpcmVjdF91cmknLCByZWRpcmVjdFVybCk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgncmVzcG9uc2VfdHlwZScsIHJlc3BvbnNlVHlwZSk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnc2NvcGUnLCBzY29wZSk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnbm9uY2UnLCBub25jZSk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnc3RhdGUnLCBzdGF0ZSk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnY29kZV9jaGFsbGVuZ2UnLCBjb2RlQ2hhbGxlbmdlKTtcclxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdjb2RlX2NoYWxsZW5nZV9tZXRob2QnLCAnUzI1NicpO1xyXG5cclxuICAgICAgICBpZiAoaGRQYXJhbSkge1xyXG4gICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnaGQnLCBoZFBhcmFtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjdXN0b21QYXJhbXNBdXRoUmVxdWVzdCkge1xyXG4gICAgICAgICAgcGFyYW1zID0gdGhpcy5hcHBlbmRDdXN0b21QYXJhbXMoeyAuLi5jdXN0b21QYXJhbXNBdXRoUmVxdWVzdCB9LCBwYXJhbXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGN1c3RvbVBhcmFtc1JlcXVlc3QpIHtcclxuICAgICAgICAgIHBhcmFtcyA9IHRoaXMuYXBwZW5kQ3VzdG9tUGFyYW1zKHsgLi4uY3VzdG9tUGFyYW1zUmVxdWVzdCB9LCBwYXJhbXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcmFtcy50b1N0cmluZygpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGdldFBvc3RMb2dvdXRSZWRpcmVjdFVybChjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHsgcG9zdExvZ291dFJlZGlyZWN0VXJpIH0gPSBjb25maWd1cmF0aW9uO1xyXG5cclxuICAgIGlmICghcG9zdExvZ291dFJlZGlyZWN0VXJpKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWd1cmF0aW9uLCBgY291bGQgbm90IGdldCBwb3N0TG9nb3V0UmVkaXJlY3RVcmksIHdhczogYCwgcG9zdExvZ291dFJlZGlyZWN0VXJpKTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwb3N0TG9nb3V0UmVkaXJlY3RVcmk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUVuZFNlc3Npb25VcmwoXHJcbiAgICBpZFRva2VuSGludDogc3RyaW5nLFxyXG4gICAgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIGN1c3RvbVBhcmFtc0VuZFNlc3Npb24/OiB7IFtwOiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH1cclxuICApOiBzdHJpbmcgfCBudWxsIHtcclxuICAgIC8vIEF1dGgwIG5lZWRzIGEgc3BlY2lhbCBsb2dvdXQgdXJsXHJcbiAgICAvLyBTZWUgaHR0cHM6Ly9hdXRoMC5jb20vZG9jcy9hcGkvYXV0aGVudGljYXRpb24jbG9nb3V0XHJcblxyXG4gICAgaWYgKHRoaXMuaXNBdXRoMEVuZHBvaW50KGNvbmZpZ3VyYXRpb24pKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbXBvc2VBdXRoMEVuZHBvaW50KGNvbmZpZ3VyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgdXJsLCBleGlzdGluZ1BhcmFtcyB9ID0gdGhpcy5nZXRFbmRTZXNzaW9uRW5kcG9pbnQoY29uZmlndXJhdGlvbik7XHJcblxyXG4gICAgaWYgKCF1cmwpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHBhcmFtcyA9IHRoaXMuY3JlYXRlSHR0cFBhcmFtcyhleGlzdGluZ1BhcmFtcyk7XHJcblxyXG4gICAgaWYgKCEhaWRUb2tlbkhpbnQpIHtcclxuICAgICAgcGFyYW1zID0gcGFyYW1zLnNldCgnaWRfdG9rZW5faGludCcsIGlkVG9rZW5IaW50KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwb3N0TG9nb3V0UmVkaXJlY3RVcmkgPSB0aGlzLmdldFBvc3RMb2dvdXRSZWRpcmVjdFVybChjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICBpZiAocG9zdExvZ291dFJlZGlyZWN0VXJpKSB7XHJcbiAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3Bvc3RfbG9nb3V0X3JlZGlyZWN0X3VyaScsIHBvc3RMb2dvdXRSZWRpcmVjdFVyaSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGN1c3RvbVBhcmFtc0VuZFNlc3Npb24pIHtcclxuICAgICAgcGFyYW1zID0gdGhpcy5hcHBlbmRDdXN0b21QYXJhbXMoeyAuLi5jdXN0b21QYXJhbXNFbmRTZXNzaW9uIH0sIHBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGAke3VybH0/JHtwYXJhbXN9YDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlQXV0aG9yaXplVXJsKFxyXG4gICAgY29kZUNoYWxsZW5nZTogc3RyaW5nLFxyXG4gICAgcmVkaXJlY3RVcmw6IHN0cmluZyxcclxuICAgIG5vbmNlOiBzdHJpbmcsXHJcbiAgICBzdGF0ZTogc3RyaW5nLFxyXG4gICAgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIHByb21wdD86IHN0cmluZyxcclxuICAgIGN1c3RvbVJlcXVlc3RQYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfVxyXG4gICk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBhdXRoV2VsbEtub3duRW5kUG9pbnRzID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnLCBjb25maWd1cmF0aW9uKTtcclxuICAgIGNvbnN0IGF1dGhvcml6YXRpb25FbmRwb2ludCA9IGF1dGhXZWxsS25vd25FbmRQb2ludHM/LmF1dGhvcml6YXRpb25FbmRwb2ludDtcclxuXHJcbiAgICBpZiAoIWF1dGhvcml6YXRpb25FbmRwb2ludCkge1xyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoXHJcbiAgICAgICAgY29uZmlndXJhdGlvbixcclxuICAgICAgICBgQ2FuIG5vdCBjcmVhdGUgYW4gYXV0aG9yaXplIFVSTCB3aGVuIGF1dGhvcml6YXRpb25FbmRwb2ludCBpcyAnJHthdXRob3JpemF0aW9uRW5kcG9pbnR9J2BcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgY2xpZW50SWQsIHJlc3BvbnNlVHlwZSwgc2NvcGUsIGhkUGFyYW0sIGN1c3RvbVBhcmFtc0F1dGhSZXF1ZXN0IH0gPSBjb25maWd1cmF0aW9uO1xyXG5cclxuICAgIGlmICghY2xpZW50SWQpIHtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGNvbmZpZ3VyYXRpb24sIGBjcmVhdGVBdXRob3JpemVVcmwgY291bGQgbm90IGFkZCBjbGllbnRJZCBiZWNhdXNlIGl0IHdhczogYCwgY2xpZW50SWQpO1xyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFyZXNwb25zZVR5cGUpIHtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGNvbmZpZ3VyYXRpb24sIGBjcmVhdGVBdXRob3JpemVVcmwgY291bGQgbm90IGFkZCByZXNwb25zZVR5cGUgYmVjYXVzZSBpdCB3YXM6IGAsIHJlc3BvbnNlVHlwZSk7XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXNjb3BlKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWd1cmF0aW9uLCBgY3JlYXRlQXV0aG9yaXplVXJsIGNvdWxkIG5vdCBhZGQgc2NvcGUgYmVjYXVzZSBpdCB3YXM6IGAsIHNjb3BlKTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHVybFBhcnRzID0gYXV0aG9yaXphdGlvbkVuZHBvaW50LnNwbGl0KCc/Jyk7XHJcbiAgICBjb25zdCBhdXRob3JpemF0aW9uVXJsID0gdXJsUGFydHNbMF07XHJcbiAgICBjb25zdCBleGlzdGluZ1BhcmFtcyA9IHVybFBhcnRzWzFdO1xyXG4gICAgbGV0IHBhcmFtcyA9IHRoaXMuY3JlYXRlSHR0cFBhcmFtcyhleGlzdGluZ1BhcmFtcyk7XHJcblxyXG4gICAgcGFyYW1zID0gcGFyYW1zLnNldCgnY2xpZW50X2lkJywgY2xpZW50SWQpO1xyXG4gICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgncmVkaXJlY3RfdXJpJywgcmVkaXJlY3RVcmwpO1xyXG4gICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgncmVzcG9uc2VfdHlwZScsIHJlc3BvbnNlVHlwZSk7XHJcbiAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdzY29wZScsIHNjb3BlKTtcclxuICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ25vbmNlJywgbm9uY2UpO1xyXG4gICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnc3RhdGUnLCBzdGF0ZSk7XHJcblxyXG4gICAgaWYgKHRoaXMuZmxvd0hlbHBlci5pc0N1cnJlbnRGbG93Q29kZUZsb3coY29uZmlndXJhdGlvbikgJiYgY29kZUNoYWxsZW5nZSAhPT0gbnVsbCkge1xyXG4gICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdjb2RlX2NoYWxsZW5nZScsIGNvZGVDaGFsbGVuZ2UpO1xyXG4gICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdjb2RlX2NoYWxsZW5nZV9tZXRob2QnLCAnUzI1NicpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1lcmdlZFBhcmFtcyA9IHsgLi4uY3VzdG9tUGFyYW1zQXV0aFJlcXVlc3QsIC4uLmN1c3RvbVJlcXVlc3RQYXJhbXMgfTtcclxuXHJcbiAgICBpZiAoT2JqZWN0LmtleXMobWVyZ2VkUGFyYW1zKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHBhcmFtcyA9IHRoaXMuYXBwZW5kQ3VzdG9tUGFyYW1zKHsgLi4ubWVyZ2VkUGFyYW1zIH0sIHBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHByb21wdCkge1xyXG4gICAgICBwYXJhbXMgPSB0aGlzLm92ZXJXcml0ZVBhcmFtKHBhcmFtcywgJ3Byb21wdCcsIHByb21wdCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGhkUGFyYW0pIHtcclxuICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnaGQnLCBoZFBhcmFtKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYCR7YXV0aG9yaXphdGlvblVybH0/JHtwYXJhbXN9YDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlVXJsSW1wbGljaXRGbG93V2l0aFNpbGVudFJlbmV3KFxyXG4gICAgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIGN1c3RvbVBhcmFtcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9XHJcbiAgKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmdldEV4aXN0aW5nT3JDcmVhdGVBdXRoU3RhdGVDb250cm9sKGNvbmZpZ3VyYXRpb24pO1xyXG4gICAgY29uc3Qgbm9uY2UgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuY3JlYXRlTm9uY2UoY29uZmlndXJhdGlvbik7XHJcbiAgICBjb25zdCBzaWxlbnRSZW5ld1VybCA9IHRoaXMuZ2V0U2lsZW50UmVuZXdVcmwoY29uZmlndXJhdGlvbik7XHJcblxyXG4gICAgaWYgKCFzaWxlbnRSZW5ld1VybCkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlndXJhdGlvbiwgJ1JlZnJlc2hTZXNzaW9uIGNyZWF0ZWQuIGFkZGluZyBteWF1dG9zdGF0ZTogJywgc3RhdGUpO1xyXG5cclxuICAgIGNvbnN0IGF1dGhXZWxsS25vd25FbmRQb2ludHMgPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnYXV0aFdlbGxLbm93bkVuZFBvaW50cycsIGNvbmZpZ3VyYXRpb24pO1xyXG5cclxuICAgIGlmIChhdXRoV2VsbEtub3duRW5kUG9pbnRzKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUF1dGhvcml6ZVVybCgnJywgc2lsZW50UmVuZXdVcmwsIG5vbmNlLCBzdGF0ZSwgY29uZmlndXJhdGlvbiwgJ25vbmUnLCBjdXN0b21QYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWd1cmF0aW9uLCAnYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlVXJsQ29kZUZsb3dXaXRoU2lsZW50UmVuZXcoXHJcbiAgICBjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uLFxyXG4gICAgY3VzdG9tUGFyYW1zPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH1cclxuICApOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xyXG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuZ2V0RXhpc3RpbmdPckNyZWF0ZUF1dGhTdGF0ZUNvbnRyb2woY29uZmlndXJhdGlvbik7XHJcbiAgICBjb25zdCBub25jZSA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5jcmVhdGVOb25jZShjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlndXJhdGlvbiwgJ1JlZnJlc2hTZXNzaW9uIGNyZWF0ZWQuIGFkZGluZyBteWF1dG9zdGF0ZTogJyArIHN0YXRlKTtcclxuXHJcbiAgICAvLyBjb2RlX2NoYWxsZW5nZSB3aXRoIFwiUzI1NlwiXHJcbiAgICBjb25zdCBjb2RlVmVyaWZpZXIgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuY3JlYXRlQ29kZVZlcmlmaWVyKGNvbmZpZ3VyYXRpb24pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmp3dFdpbmRvd0NyeXB0b1NlcnZpY2UuZ2VuZXJhdGVDb2RlQ2hhbGxlbmdlKGNvZGVWZXJpZmllcikucGlwZShcclxuICAgICAgbWFwKChjb2RlQ2hhbGxlbmdlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjb25zdCBzaWxlbnRSZW5ld1VybCA9IHRoaXMuZ2V0U2lsZW50UmVuZXdVcmwoY29uZmlndXJhdGlvbik7XHJcblxyXG4gICAgICAgIGlmICghc2lsZW50UmVuZXdVcmwpIHtcclxuICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGF1dGhXZWxsS25vd25FbmRQb2ludHMgPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnYXV0aFdlbGxLbm93bkVuZFBvaW50cycsIGNvbmZpZ3VyYXRpb24pO1xyXG5cclxuICAgICAgICBpZiAoYXV0aFdlbGxLbm93bkVuZFBvaW50cykge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlQXV0aG9yaXplVXJsKGNvZGVDaGFsbGVuZ2UsIHNpbGVudFJlbmV3VXJsLCBub25jZSwgc3RhdGUsIGNvbmZpZ3VyYXRpb24sICdub25lJywgY3VzdG9tUGFyYW1zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKGNvbmZpZ3VyYXRpb24sICdhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZVVybEltcGxpY2l0Rmxvd0F1dGhvcml6ZShjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uLCBhdXRoT3B0aW9ucz86IEF1dGhPcHRpb25zKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmdldEV4aXN0aW5nT3JDcmVhdGVBdXRoU3RhdGVDb250cm9sKGNvbmZpZ3VyYXRpb24pO1xyXG4gICAgY29uc3Qgbm9uY2UgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuY3JlYXRlTm9uY2UoY29uZmlndXJhdGlvbik7XHJcblxyXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZ3VyYXRpb24sICdBdXRob3JpemUgY3JlYXRlZC4gYWRkaW5nIG15YXV0b3N0YXRlOiAnICsgc3RhdGUpO1xyXG5cclxuICAgIGNvbnN0IHJlZGlyZWN0VXJsID0gdGhpcy5nZXRSZWRpcmVjdFVybChjb25maWd1cmF0aW9uLCBhdXRoT3B0aW9ucyk7XHJcblxyXG4gICAgaWYgKCFyZWRpcmVjdFVybCkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhdXRoV2VsbEtub3duRW5kUG9pbnRzID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnLCBjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICBpZiAoYXV0aFdlbGxLbm93bkVuZFBvaW50cykge1xyXG4gICAgICBjb25zdCB7IGN1c3RvbVBhcmFtcyB9ID0gYXV0aE9wdGlvbnMgfHwge307XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVBdXRob3JpemVVcmwoJycsIHJlZGlyZWN0VXJsLCBub25jZSwgc3RhdGUsIGNvbmZpZ3VyYXRpb24sIG51bGwsIGN1c3RvbVBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGNvbmZpZ3VyYXRpb24sICdhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVVcmxDb2RlRmxvd0F1dGhvcml6ZShjb25maWc6IE9wZW5JZENvbmZpZ3VyYXRpb24sIGF1dGhPcHRpb25zPzogQXV0aE9wdGlvbnMpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xyXG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuZ2V0RXhpc3RpbmdPckNyZWF0ZUF1dGhTdGF0ZUNvbnRyb2woY29uZmlnKTtcclxuICAgIGNvbnN0IG5vbmNlID0gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmNyZWF0ZU5vbmNlKGNvbmZpZyk7XHJcblxyXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZywgJ0F1dGhvcml6ZSBjcmVhdGVkLiBhZGRpbmcgbXlhdXRvc3RhdGU6ICcgKyBzdGF0ZSk7XHJcblxyXG4gICAgY29uc3QgcmVkaXJlY3RVcmwgPSB0aGlzLmdldFJlZGlyZWN0VXJsKGNvbmZpZywgYXV0aE9wdGlvbnMpO1xyXG5cclxuICAgIGlmICghcmVkaXJlY3RVcmwpIHtcclxuICAgICAgcmV0dXJuIG9mKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmdldENvZGVDaGFsbGVuZ2UoY29uZmlnKS5waXBlKFxyXG4gICAgICBtYXAoKGNvZGVDaGFsbGVuZ2U6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGF1dGhXZWxsS25vd25FbmRQb2ludHMgPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnYXV0aFdlbGxLbm93bkVuZFBvaW50cycsIGNvbmZpZyk7XHJcblxyXG4gICAgICAgIGlmIChhdXRoV2VsbEtub3duRW5kUG9pbnRzKSB7XHJcbiAgICAgICAgICBjb25zdCB7IGN1c3RvbVBhcmFtcyB9ID0gYXV0aE9wdGlvbnMgfHwge307XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlQXV0aG9yaXplVXJsKGNvZGVDaGFsbGVuZ2UsIHJlZGlyZWN0VXJsLCBub25jZSwgc3RhdGUsIGNvbmZpZywgbnVsbCwgY3VzdG9tUGFyYW1zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWcsICdhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG5cclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRDb2RlQ2hhbGxlbmdlKGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbik6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICBpZiAoY29uZmlnLmRpc2FibGVQa2NlKSB7XHJcbiAgICAgIHJldHVybiBvZihudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb2RlX2NoYWxsZW5nZSB3aXRoIFwiUzI1NlwiXHJcbiAgICBjb25zdCBjb2RlVmVyaWZpZXIgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuY3JlYXRlQ29kZVZlcmlmaWVyKGNvbmZpZyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuand0V2luZG93Q3J5cHRvU2VydmljZS5nZW5lcmF0ZUNvZGVDaGFsbGVuZ2UoY29kZVZlcmlmaWVyKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UmVkaXJlY3RVcmwoY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbiwgYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucyk6IHN0cmluZyB7XHJcbiAgICBsZXQgeyByZWRpcmVjdFVybCB9ID0gY29uZmlndXJhdGlvbjtcclxuXHJcbiAgICBpZiAoYXV0aE9wdGlvbnM/LnJlZGlyZWN0VXJsKSB7XHJcbiAgICAgIC8vIG92ZXJyaWRlIGJ5IHJlZGlyZWN0VXJsIGZyb20gYXV0aE9wdGlvbnNcclxuICAgICAgcmVkaXJlY3RVcmwgPSBhdXRoT3B0aW9ucy5yZWRpcmVjdFVybDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXJlZGlyZWN0VXJsKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWd1cmF0aW9uLCBgY291bGQgbm90IGdldCByZWRpcmVjdFVybCwgd2FzOiBgLCByZWRpcmVjdFVybCk7XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVkaXJlY3RVcmw7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFNpbGVudFJlbmV3VXJsKGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgeyBzaWxlbnRSZW5ld1VybCB9ID0gY29uZmlndXJhdGlvbjtcclxuXHJcbiAgICBpZiAoIXNpbGVudFJlbmV3VXJsKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWd1cmF0aW9uLCBgY291bGQgbm90IGdldCBzaWxlbnRSZW5ld1VybCwgd2FzOiBgLCBzaWxlbnRSZW5ld1VybCk7XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2lsZW50UmVuZXdVcmw7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldENsaWVudElkKGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgeyBjbGllbnRJZCB9ID0gY29uZmlndXJhdGlvbjtcclxuXHJcbiAgICBpZiAoIWNsaWVudElkKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWd1cmF0aW9uLCBgY291bGQgbm90IGdldCBjbGllbnRJZCwgd2FzOiBgLCBjbGllbnRJZCk7XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2xpZW50SWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFwcGVuZEN1c3RvbVBhcmFtcyhjdXN0b21QYXJhbXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9LCBwYXJhbXM6IEh0dHBQYXJhbXMpOiBIdHRwUGFyYW1zIHtcclxuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHsgLi4uY3VzdG9tUGFyYW1zIH0pKSB7XHJcbiAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoa2V5LCB2YWx1ZS50b1N0cmluZygpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGFyYW1zO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvdmVyV3JpdGVQYXJhbShwYXJhbXM6IEh0dHBQYXJhbXMsIGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbik6IEh0dHBQYXJhbXMge1xyXG4gICAgcmV0dXJuIHBhcmFtcy5zZXQoa2V5LCB2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUh0dHBQYXJhbXMoZXhpc3RpbmdQYXJhbXM/OiBzdHJpbmcpOiBIdHRwUGFyYW1zIHtcclxuICAgIGV4aXN0aW5nUGFyYW1zID0gZXhpc3RpbmdQYXJhbXMgPz8gJyc7XHJcblxyXG4gICAgY29uc3QgcGFyYW1zID0gbmV3IEh0dHBQYXJhbXMoe1xyXG4gICAgICBmcm9tU3RyaW5nOiBleGlzdGluZ1BhcmFtcyxcclxuICAgICAgZW5jb2RlcjogbmV3IFVyaUVuY29kZXIoKSxcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBwYXJhbXM7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzQXV0aDBFbmRwb2ludChjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCB7IGF1dGhvcml0eSB9ID0gY29uZmlndXJhdGlvbjtcclxuXHJcbiAgICBpZiAoIWF1dGhvcml0eSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF1dGhvcml0eS5lbmRzV2l0aChBVVRIMF9FTkRQT0lOVCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbXBvc2VBdXRoMEVuZHBvaW50KGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBzdHJpbmcge1xyXG4gICAgLy8gZm9ybWF0OiBodHRwczovL1lPVVJfRE9NQUlOL3YyL2xvZ291dD9jbGllbnRfaWQ9WU9VUl9DTElFTlRfSUQmcmV0dXJuVG89TE9HT1VUX1VSTFxyXG4gICAgY29uc3QgeyBhdXRob3JpdHksIGNsaWVudElkIH0gPSBjb25maWd1cmF0aW9uO1xyXG4gICAgY29uc3QgcG9zdExvZ291dFJlZGlyZWN0VXJsID0gdGhpcy5nZXRQb3N0TG9nb3V0UmVkaXJlY3RVcmwoY29uZmlndXJhdGlvbik7XHJcblxyXG4gICAgcmV0dXJuIGAke2F1dGhvcml0eX0vdjIvbG9nb3V0P2NsaWVudF9pZD0ke2NsaWVudElkfSZyZXR1cm5Ubz0ke3Bvc3RMb2dvdXRSZWRpcmVjdFVybH1gO1xyXG4gIH1cclxufVxyXG4iXX0=