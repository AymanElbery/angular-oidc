import { Observable } from 'rxjs';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { CallbackContext } from '../flows/callback-context';
import { LoggerService } from '../logging/logger.service';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { EqualityService } from '../utils/equality/equality.service';
import { FlowHelper } from '../utils/flowHelper/flow-helper.service';
import { TokenHelperService } from '../utils/tokenHelper/token-helper.service';
import { StateValidationResult } from './state-validation-result';
import { TokenValidationService } from './token-validation.service';
import * as i0 from "@angular/core";
export declare class StateValidationService {
    private readonly storagePersistenceService;
    private readonly tokenValidationService;
    private readonly tokenHelperService;
    private readonly loggerService;
    private readonly equalityService;
    private readonly flowHelper;
    constructor(storagePersistenceService: StoragePersistenceService, tokenValidationService: TokenValidationService, tokenHelperService: TokenHelperService, loggerService: LoggerService, equalityService: EqualityService, flowHelper: FlowHelper);
    getValidatedStateResult(callbackContext: CallbackContext, configuration: OpenIdConfiguration): Observable<StateValidationResult>;
    private validateState;
    private validateDefault;
    private isIdTokenAfterRefreshTokenRequestValid;
    private handleSuccessfulValidation;
    private handleUnsuccessfulValidation;
    static ɵfac: i0.ɵɵFactoryDeclaration<StateValidationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StateValidationService>;
}
