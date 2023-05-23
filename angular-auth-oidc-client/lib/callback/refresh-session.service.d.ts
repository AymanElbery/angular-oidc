import { Observable } from 'rxjs';
import { AuthStateService } from '../auth-state/auth-state.service';
import { AuthWellKnownService } from '../config/auth-well-known/auth-well-known.service';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { FlowsDataService } from '../flows/flows-data.service';
import { RefreshSessionIframeService } from '../iframe/refresh-session-iframe.service';
import { SilentRenewService } from '../iframe/silent-renew.service';
import { LoggerService } from '../logging/logger.service';
import { LoginResponse } from '../login/login-response';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { UserService } from '../user-data/user.service';
import { FlowHelper } from '../utils/flowHelper/flow-helper.service';
import { RefreshSessionRefreshTokenService } from './refresh-session-refresh-token.service';
import * as i0 from "@angular/core";
export declare const MAX_RETRY_ATTEMPTS = 3;
export declare class RefreshSessionService {
    private readonly flowHelper;
    private readonly flowsDataService;
    private readonly loggerService;
    private readonly silentRenewService;
    private readonly authStateService;
    private readonly authWellKnownService;
    private readonly refreshSessionIframeService;
    private readonly storagePersistenceService;
    private readonly refreshSessionRefreshTokenService;
    private readonly userService;
    constructor(flowHelper: FlowHelper, flowsDataService: FlowsDataService, loggerService: LoggerService, silentRenewService: SilentRenewService, authStateService: AuthStateService, authWellKnownService: AuthWellKnownService, refreshSessionIframeService: RefreshSessionIframeService, storagePersistenceService: StoragePersistenceService, refreshSessionRefreshTokenService: RefreshSessionRefreshTokenService, userService: UserService);
    userForceRefreshSession(config: OpenIdConfiguration, allConfigs: OpenIdConfiguration[], extraCustomParams?: {
        [key: string]: string | number | boolean;
    }): Observable<LoginResponse>;
    forceRefreshSession(config: OpenIdConfiguration, allConfigs: OpenIdConfiguration[], extraCustomParams?: {
        [key: string]: string | number | boolean;
    }): Observable<LoginResponse>;
    private persistCustomParams;
    private startRefreshSession;
    private timeoutRetryStrategy;
    static ɵfac: i0.ɵɵFactoryDeclaration<RefreshSessionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RefreshSessionService>;
}
