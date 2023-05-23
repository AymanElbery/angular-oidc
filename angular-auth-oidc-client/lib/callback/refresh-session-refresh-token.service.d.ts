import { Observable } from 'rxjs';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { CallbackContext } from '../flows/callback-context';
import { FlowsService } from '../flows/flows.service';
import { ResetAuthDataService } from '../flows/reset-auth-data.service';
import { LoggerService } from '../logging/logger.service';
import { IntervalService } from './interval.service';
import * as i0 from "@angular/core";
export declare class RefreshSessionRefreshTokenService {
    private readonly loggerService;
    private readonly resetAuthDataService;
    private readonly flowsService;
    private readonly intervalService;
    constructor(loggerService: LoggerService, resetAuthDataService: ResetAuthDataService, flowsService: FlowsService, intervalService: IntervalService);
    refreshSessionWithRefreshTokens(config: OpenIdConfiguration, allConfigs: OpenIdConfiguration[], customParamsRefresh?: {
        [key: string]: string | number | boolean;
    }): Observable<CallbackContext>;
    static ɵfac: i0.ɵɵFactoryDeclaration<RefreshSessionRefreshTokenService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RefreshSessionRefreshTokenService>;
}
