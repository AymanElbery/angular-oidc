import { AuthStateService } from '../auth-state/auth-state.service';
import { ConfigurationService } from '../config/config.service';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { FlowsDataService } from '../flows/flows-data.service';
import { ResetAuthDataService } from '../flows/reset-auth-data.service';
import { RefreshSessionIframeService } from '../iframe/refresh-session-iframe.service';
import { LoggerService } from '../logging/logger.service';
import { PublicEventsService } from '../public-events/public-events.service';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { UserService } from '../user-data/user.service';
import { FlowHelper } from '../utils/flowHelper/flow-helper.service';
import { IntervalService } from './interval.service';
import { RefreshSessionRefreshTokenService } from './refresh-session-refresh-token.service';
import * as i0 from "@angular/core";
export declare class PeriodicallyTokenCheckService {
    private readonly resetAuthDataService;
    private readonly flowHelper;
    private readonly flowsDataService;
    private readonly loggerService;
    private readonly userService;
    private readonly authStateService;
    private readonly refreshSessionIframeService;
    private readonly refreshSessionRefreshTokenService;
    private intervalService;
    private readonly storagePersistenceService;
    private readonly publicEventsService;
    private readonly configurationService;
    constructor(resetAuthDataService: ResetAuthDataService, flowHelper: FlowHelper, flowsDataService: FlowsDataService, loggerService: LoggerService, userService: UserService, authStateService: AuthStateService, refreshSessionIframeService: RefreshSessionIframeService, refreshSessionRefreshTokenService: RefreshSessionRefreshTokenService, intervalService: IntervalService, storagePersistenceService: StoragePersistenceService, publicEventsService: PublicEventsService, configurationService: ConfigurationService);
    startTokenValidationPeriodically(allConfigs: OpenIdConfiguration[], currentConfig: OpenIdConfiguration): void;
    private getRefreshEvent;
    private getSmallestRefreshTimeFromConfigs;
    private getConfigsWithSilentRenewEnabled;
    private createRefreshEventForConfig;
    private shouldStartPeriodicallyCheckForConfig;
    static ɵfac: i0.ɵɵFactoryDeclaration<PeriodicallyTokenCheckService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PeriodicallyTokenCheckService>;
}
