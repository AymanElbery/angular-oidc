import { Observable } from 'rxjs';
import { AuthStateService } from '../../auth-state/auth-state.service';
import { OpenIdConfiguration } from '../../config/openid-configuration';
import { LoggerService } from '../../logging/logger.service';
import { UserService } from '../../user-data/user.service';
import { CallbackContext } from '../callback-context';
import { FlowsDataService } from '../flows-data.service';
import { ResetAuthDataService } from '../reset-auth-data.service';
import * as i0 from "@angular/core";
export declare class UserCallbackHandlerService {
    private readonly loggerService;
    private readonly authStateService;
    private readonly flowsDataService;
    private readonly userService;
    private readonly resetAuthDataService;
    constructor(loggerService: LoggerService, authStateService: AuthStateService, flowsDataService: FlowsDataService, userService: UserService, resetAuthDataService: ResetAuthDataService);
    callbackUser(callbackContext: CallbackContext, configuration: OpenIdConfiguration, allConfigs: OpenIdConfiguration[]): Observable<CallbackContext>;
    private publishAuthState;
    private publishUnauthenticatedState;
    static ɵfac: i0.ɵɵFactoryDeclaration<UserCallbackHandlerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UserCallbackHandlerService>;
}
