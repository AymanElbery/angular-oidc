import { Observable } from 'rxjs';
import { AuthStateService } from '../../auth-state/auth-state.service';
import { OpenIdConfiguration } from '../../config/openid-configuration';
import { LoggerService } from '../../logging/logger.service';
import { StoragePersistenceService } from '../../storage/storage-persistence.service';
import { CallbackContext } from '../callback-context';
import { FlowsDataService } from '../flows-data.service';
import { ResetAuthDataService } from '../reset-auth-data.service';
import { SigninKeyDataService } from '../signin-key-data.service';
import * as i0 from "@angular/core";
export declare class HistoryJwtKeysCallbackHandlerService {
    private readonly loggerService;
    private readonly authStateService;
    private readonly flowsDataService;
    private readonly signInKeyDataService;
    private readonly storagePersistenceService;
    private readonly resetAuthDataService;
    private readonly document;
    constructor(loggerService: LoggerService, authStateService: AuthStateService, flowsDataService: FlowsDataService, signInKeyDataService: SigninKeyDataService, storagePersistenceService: StoragePersistenceService, resetAuthDataService: ResetAuthDataService, document: Document);
    callbackHistoryAndResetJwtKeys(callbackContext: CallbackContext, config: OpenIdConfiguration, allConfigs: OpenIdConfiguration[]): Observable<CallbackContext>;
    private responseHasIdToken;
    private handleResultErrorFromCallback;
    private historyCleanUpTurnedOn;
    private resetBrowserHistory;
    private storeSigningKeys;
    private readSigningKeys;
    static ɵfac: i0.ɵɵFactoryDeclaration<HistoryJwtKeysCallbackHandlerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HistoryJwtKeysCallbackHandlerService>;
}
