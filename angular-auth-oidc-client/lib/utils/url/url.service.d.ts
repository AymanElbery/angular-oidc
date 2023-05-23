import { Observable } from 'rxjs';
import { AuthOptions } from '../../auth-options';
import { OpenIdConfiguration } from '../../config/openid-configuration';
import { FlowsDataService } from '../../flows/flows-data.service';
import { LoggerService } from '../../logging/logger.service';
import { StoragePersistenceService } from '../../storage/storage-persistence.service';
import { JwtWindowCryptoService } from '../../validation/jwt-window-crypto.service';
import { FlowHelper } from '../flowHelper/flow-helper.service';
import * as i0 from "@angular/core";
export declare class UrlService {
    private readonly loggerService;
    private readonly flowsDataService;
    private readonly flowHelper;
    private readonly storagePersistenceService;
    private readonly jwtWindowCryptoService;
    constructor(loggerService: LoggerService, flowsDataService: FlowsDataService, flowHelper: FlowHelper, storagePersistenceService: StoragePersistenceService, jwtWindowCryptoService: JwtWindowCryptoService);
    getUrlParameter(urlToCheck: string, name: string): string;
    isCallbackFromSts(currentUrl: string): boolean;
    getRefreshSessionSilentRenewUrl(config: OpenIdConfiguration, customParams?: {
        [key: string]: string | number | boolean;
    }): Observable<string>;
    getAuthorizeParUrl(requestUri: string, configuration: OpenIdConfiguration): string;
    getAuthorizeUrl(config: OpenIdConfiguration, authOptions?: AuthOptions): Observable<string>;
    getEndSessionEndpoint(configuration: OpenIdConfiguration): {
        url: string;
        existingParams: string;
    };
    getEndSessionUrl(configuration: OpenIdConfiguration, customParams?: {
        [p: string]: string | number | boolean;
    }): string | null;
    createRevocationEndpointBodyAccessToken(token: any, configuration: OpenIdConfiguration): string;
    createRevocationEndpointBodyRefreshToken(token: any, configuration: OpenIdConfiguration): string;
    getRevocationEndpointUrl(configuration: OpenIdConfiguration): string;
    createBodyForCodeFlowCodeRequest(code: string, configuration: OpenIdConfiguration, customTokenParams?: {
        [p: string]: string | number | boolean;
    }): string;
    createBodyForCodeFlowRefreshTokensRequest(refreshToken: string, configuration: OpenIdConfiguration, customParamsRefresh?: {
        [key: string]: string | number | boolean;
    }): string;
    createBodyForParCodeFlowRequest(configuration: OpenIdConfiguration, customParamsRequest?: {
        [key: string]: string | number | boolean;
    }): Observable<string>;
    getPostLogoutRedirectUrl(configuration: OpenIdConfiguration): string;
    private createEndSessionUrl;
    private createAuthorizeUrl;
    private createUrlImplicitFlowWithSilentRenew;
    private createUrlCodeFlowWithSilentRenew;
    private createUrlImplicitFlowAuthorize;
    private createUrlCodeFlowAuthorize;
    private getCodeChallenge;
    private getRedirectUrl;
    private getSilentRenewUrl;
    private getClientId;
    private appendCustomParams;
    private overWriteParam;
    private createHttpParams;
    private isAuth0Endpoint;
    private composeAuth0Endpoint;
    static ɵfac: i0.ɵɵFactoryDeclaration<UrlService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UrlService>;
}
