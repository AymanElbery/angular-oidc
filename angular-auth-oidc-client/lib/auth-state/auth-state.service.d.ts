import { Observable } from 'rxjs';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { AuthResult } from '../flows/callback-context';
import { LoggerService } from '../logging/logger.service';
import { PublicEventsService } from '../public-events/public-events.service';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { TokenValidationService } from '../validation/token-validation.service';
import { AuthenticatedResult } from './auth-result';
import { AuthStateResult } from './auth-state';
import * as i0 from "@angular/core";
export declare class AuthStateService {
    private readonly storagePersistenceService;
    private readonly loggerService;
    private readonly publicEventsService;
    private readonly tokenValidationService;
    private readonly authenticatedInternal$;
    get authenticated$(): Observable<AuthenticatedResult>;
    constructor(storagePersistenceService: StoragePersistenceService, loggerService: LoggerService, publicEventsService: PublicEventsService, tokenValidationService: TokenValidationService);
    setAuthenticatedAndFireEvent(allConfigs: OpenIdConfiguration[]): void;
    setUnauthenticatedAndFireEvent(currentConfig: OpenIdConfiguration, allConfigs: OpenIdConfiguration[]): void;
    updateAndPublishAuthState(authenticationResult: AuthStateResult): void;
    setAuthorizationData(accessToken: string, authResult: AuthResult, currentConfig: OpenIdConfiguration, allConfigs: OpenIdConfiguration[]): void;
    getAccessToken(configuration: OpenIdConfiguration): string;
    getIdToken(configuration: OpenIdConfiguration): string;
    getRefreshToken(configuration: OpenIdConfiguration): string;
    getAuthenticationResult(configuration: OpenIdConfiguration): any;
    areAuthStorageTokensValid(configuration: OpenIdConfiguration): boolean;
    hasIdTokenExpiredAndRenewCheckIsEnabled(configuration: OpenIdConfiguration): boolean;
    hasAccessTokenExpiredIfExpiryExists(configuration: OpenIdConfiguration): boolean;
    isAuthenticated(configuration: OpenIdConfiguration): boolean;
    private decodeURIComponentSafely;
    private persistAccessTokenExpirationTime;
    private composeAuthenticatedResult;
    private composeUnAuthenticatedResult;
    private checkAllConfigsIfTheyAreAuthenticated;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthStateService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthStateService>;
}
