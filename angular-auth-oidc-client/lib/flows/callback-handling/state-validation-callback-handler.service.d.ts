import { Observable } from 'rxjs';
import { AuthStateService } from '../../auth-state/auth-state.service';
import { OpenIdConfiguration } from '../../config/openid-configuration';
import { LoggerService } from '../../logging/logger.service';
import { StateValidationService } from '../../validation/state-validation.service';
import { CallbackContext } from '../callback-context';
import { ResetAuthDataService } from '../reset-auth-data.service';
import * as i0 from "@angular/core";
export declare class StateValidationCallbackHandlerService {
    private readonly loggerService;
    private readonly stateValidationService;
    private readonly authStateService;
    private readonly resetAuthDataService;
    private readonly document;
    constructor(loggerService: LoggerService, stateValidationService: StateValidationService, authStateService: AuthStateService, resetAuthDataService: ResetAuthDataService, document: Document);
    callbackStateValidation(callbackContext: CallbackContext, configuration: OpenIdConfiguration, allConfigs: OpenIdConfiguration[]): Observable<CallbackContext>;
    private publishUnauthorizedState;
    static ɵfac: i0.ɵɵFactoryDeclaration<StateValidationCallbackHandlerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StateValidationCallbackHandlerService>;
}
