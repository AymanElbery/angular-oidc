import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ValidationResult } from '../../validation/validation-result';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../auth-state/auth-state.service";
import * as i3 from "../flows-data.service";
import * as i4 from "../signin-key-data.service";
import * as i5 from "../../storage/storage-persistence.service";
import * as i6 from "../reset-auth-data.service";
const JWT_KEYS = 'jwtKeys';
export class HistoryJwtKeysCallbackHandlerService {
    constructor(loggerService, authStateService, flowsDataService, signInKeyDataService, storagePersistenceService, resetAuthDataService, document) {
        this.loggerService = loggerService;
        this.authStateService = authStateService;
        this.flowsDataService = flowsDataService;
        this.signInKeyDataService = signInKeyDataService;
        this.storagePersistenceService = storagePersistenceService;
        this.resetAuthDataService = resetAuthDataService;
        this.document = document;
    }
    // STEP 3 Code Flow, STEP 2 Implicit Flow, STEP 3 Refresh Token
    callbackHistoryAndResetJwtKeys(callbackContext, config, allConfigs) {
        if (!this.responseHasIdToken(callbackContext)) {
            const existingIdToken = this.storagePersistenceService.getIdToken(config);
            callbackContext.authResult = { ...callbackContext.authResult, id_token: existingIdToken };
        }
        this.storagePersistenceService.write('authnResult', callbackContext.authResult, config);
        if (config.allowUnsafeReuseRefreshToken && callbackContext.authResult.refresh_token) {
            this.storagePersistenceService.write('reusable_refresh_token', callbackContext.authResult.refresh_token, config);
        }
        if (this.historyCleanUpTurnedOn(config) && !callbackContext.isRenewProcess) {
            this.resetBrowserHistory();
        }
        else {
            this.loggerService.logDebug(config, 'history clean up inactive');
        }
        if (callbackContext.authResult.error) {
            const errorMessage = `AuthCallback AuthResult came with error: ${callbackContext.authResult.error}`;
            this.loggerService.logDebug(config, errorMessage);
            this.resetAuthDataService.resetAuthorizationData(config, allConfigs);
            this.flowsDataService.setNonce('', config);
            this.handleResultErrorFromCallback(callbackContext.authResult, callbackContext.isRenewProcess);
            return throwError(() => new Error(errorMessage));
        }
        this.loggerService.logDebug(config, `AuthResult '${JSON.stringify(callbackContext.authResult, null, 2)}'.
      AuthCallback created, begin token validation`);
        return this.signInKeyDataService.getSigningKeys(config).pipe(tap((jwtKeys) => this.storeSigningKeys(jwtKeys, config)), catchError((err) => {
            // fallback: try to load jwtKeys from storage
            const storedJwtKeys = this.readSigningKeys(config);
            if (!!storedJwtKeys) {
                this.loggerService.logWarning(config, `Failed to retrieve signing keys, fallback to stored keys`);
                return of(storedJwtKeys);
            }
            return throwError(() => new Error(err));
        }), switchMap((jwtKeys) => {
            if (jwtKeys) {
                callbackContext.jwtKeys = jwtKeys;
                return of(callbackContext);
            }
            const errorMessage = `Failed to retrieve signing key`;
            this.loggerService.logWarning(config, errorMessage);
            return throwError(() => new Error(errorMessage));
        }), catchError((err) => {
            const errorMessage = `Failed to retrieve signing key with error: ${err}`;
            this.loggerService.logWarning(config, errorMessage);
            return throwError(() => new Error(errorMessage));
        }));
    }
    responseHasIdToken(callbackContext) {
        return !!callbackContext?.authResult?.id_token;
    }
    handleResultErrorFromCallback(result, isRenewProcess) {
        let validationResult = ValidationResult.SecureTokenServerError;
        if (result.error === 'login_required') {
            validationResult = ValidationResult.LoginRequired;
        }
        this.authStateService.updateAndPublishAuthState({
            isAuthenticated: false,
            validationResult,
            isRenewProcess,
        });
    }
    historyCleanUpTurnedOn(config) {
        const { historyCleanupOff } = config;
        return !historyCleanupOff;
    }
    resetBrowserHistory() {
        this.document.defaultView.history.replaceState({}, this.document.title, this.document.defaultView.location.origin + this.document.defaultView.location.pathname);
    }
    storeSigningKeys(jwtKeys, config) {
        this.storagePersistenceService.write(JWT_KEYS, jwtKeys, config);
    }
    readSigningKeys(config) {
        return this.storagePersistenceService.read(JWT_KEYS, config);
    }
}
HistoryJwtKeysCallbackHandlerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: HistoryJwtKeysCallbackHandlerService, deps: [{ token: i1.LoggerService }, { token: i2.AuthStateService }, { token: i3.FlowsDataService }, { token: i4.SigninKeyDataService }, { token: i5.StoragePersistenceService }, { token: i6.ResetAuthDataService }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
HistoryJwtKeysCallbackHandlerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: HistoryJwtKeysCallbackHandlerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: HistoryJwtKeysCallbackHandlerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LoggerService }, { type: i2.AuthStateService }, { type: i3.FlowsDataService }, { type: i4.SigninKeyDataService }, { type: i5.StoragePersistenceService }, { type: i6.ResetAuthDataService }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlzdG9yeS1qd3Qta2V5cy1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy9oaXN0b3J5LWp3dC1rZXlzLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFNNUQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7Ozs7Ozs7O0FBTXRFLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQztBQUczQixNQUFNLE9BQU8sb0NBQW9DO0lBQy9DLFlBQ21CLGFBQTRCLEVBQzVCLGdCQUFrQyxFQUNsQyxnQkFBa0MsRUFDbEMsb0JBQTBDLEVBQzFDLHlCQUFvRCxFQUNwRCxvQkFBMEMsRUFDeEIsUUFBa0I7UUFOcEMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtRQUNwRCx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQ3hCLGFBQVEsR0FBUixRQUFRLENBQVU7SUFDcEQsQ0FBQztJQUVKLCtEQUErRDtJQUMvRCw4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QixFQUFFLEdBQUcsTUFBTSxDQUFDO1FBRXJDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztJQUM1QixDQUFDO0lBRU8sbUJBQW1CO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQzVDLEVBQUUsRUFDRixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUN4RixDQUFDO0lBQ0osQ0FBQztJQUVPLGdCQUFnQixDQUFDLE9BQWdCLEVBQUUsTUFBMkI7UUFDcEUsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFTyxlQUFlLENBQUMsTUFBMkI7UUFDakQsT0FBTyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMvRCxDQUFDOztpSUEvSFUsb0NBQW9DLGdPQVFyQyxRQUFRO3FJQVJQLG9DQUFvQzsyRkFBcEMsb0NBQW9DO2tCQURoRCxVQUFVOzswQkFTTixNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBjYXRjaEVycm9yLCBzd2l0Y2hNYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQXV0aFN0YXRlU2VydmljZSB9IGZyb20gJy4uLy4uL2F1dGgtc3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4uLy4uL3N0b3JhZ2Uvc3RvcmFnZS1wZXJzaXN0ZW5jZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSnd0S2V5cyB9IGZyb20gJy4uLy4uL3ZhbGlkYXRpb24vand0a2V5cyc7XHJcbmltcG9ydCB7IFZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICcuLi8uLi92YWxpZGF0aW9uL3ZhbGlkYXRpb24tcmVzdWx0JztcclxuaW1wb3J0IHsgQ2FsbGJhY2tDb250ZXh0IH0gZnJvbSAnLi4vY2FsbGJhY2stY29udGV4dCc7XHJcbmltcG9ydCB7IEZsb3dzRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9mbG93cy1kYXRhLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZXNldEF1dGhEYXRhU2VydmljZSB9IGZyb20gJy4uL3Jlc2V0LWF1dGgtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2lnbmluS2V5RGF0YVNlcnZpY2UgfSBmcm9tICcuLi9zaWduaW4ta2V5LWRhdGEuc2VydmljZSc7XHJcblxyXG5jb25zdCBKV1RfS0VZUyA9ICdqd3RLZXlzJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEhpc3RvcnlKd3RLZXlzQ2FsbGJhY2tIYW5kbGVyU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNpZ25JbktleURhdGFTZXJ2aWNlOiBTaWduaW5LZXlEYXRhU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZTogU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVzZXRBdXRoRGF0YVNlcnZpY2U6IFJlc2V0QXV0aERhdGFTZXJ2aWNlLFxyXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSByZWFkb25seSBkb2N1bWVudDogRG9jdW1lbnRcclxuICApIHt9XHJcblxyXG4gIC8vIFNURVAgMyBDb2RlIEZsb3csIFNURVAgMiBJbXBsaWNpdCBGbG93LCBTVEVQIDMgUmVmcmVzaCBUb2tlblxyXG4gIGNhbGxiYWNrSGlzdG9yeUFuZFJlc2V0Snd0S2V5cyhcclxuICAgIGNhbGxiYWNrQ29udGV4dDogQ2FsbGJhY2tDb250ZXh0LFxyXG4gICAgY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uLFxyXG4gICAgYWxsQ29uZmlnczogT3BlbklkQ29uZmlndXJhdGlvbltdXHJcbiAgKTogT2JzZXJ2YWJsZTxDYWxsYmFja0NvbnRleHQ+IHtcclxuICAgIGlmICghdGhpcy5yZXNwb25zZUhhc0lkVG9rZW4oY2FsbGJhY2tDb250ZXh0KSkge1xyXG4gICAgICBjb25zdCBleGlzdGluZ0lkVG9rZW4gPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UuZ2V0SWRUb2tlbihjb25maWcpO1xyXG5cclxuICAgICAgY2FsbGJhY2tDb250ZXh0LmF1dGhSZXN1bHQgPSB7IC4uLmNhbGxiYWNrQ29udGV4dC5hdXRoUmVzdWx0LCBpZF90b2tlbjogZXhpc3RpbmdJZFRva2VuIH07XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLndyaXRlKCdhdXRoblJlc3VsdCcsIGNhbGxiYWNrQ29udGV4dC5hdXRoUmVzdWx0LCBjb25maWcpO1xyXG5cclxuICAgIGlmIChjb25maWcuYWxsb3dVbnNhZmVSZXVzZVJlZnJlc2hUb2tlbiAmJiBjYWxsYmFja0NvbnRleHQuYXV0aFJlc3VsdC5yZWZyZXNoX3Rva2VuKSB7XHJcbiAgICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgncmV1c2FibGVfcmVmcmVzaF90b2tlbicsIGNhbGxiYWNrQ29udGV4dC5hdXRoUmVzdWx0LnJlZnJlc2hfdG9rZW4sIGNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaGlzdG9yeUNsZWFuVXBUdXJuZWRPbihjb25maWcpICYmICFjYWxsYmFja0NvbnRleHQuaXNSZW5ld1Byb2Nlc3MpIHtcclxuICAgICAgdGhpcy5yZXNldEJyb3dzZXJIaXN0b3J5KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlnLCAnaGlzdG9yeSBjbGVhbiB1cCBpbmFjdGl2ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjYWxsYmFja0NvbnRleHQuYXV0aFJlc3VsdC5lcnJvcikge1xyXG4gICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgQXV0aENhbGxiYWNrIEF1dGhSZXN1bHQgY2FtZSB3aXRoIGVycm9yOiAke2NhbGxiYWNrQ29udGV4dC5hdXRoUmVzdWx0LmVycm9yfWA7XHJcblxyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlnLCBlcnJvck1lc3NhZ2UpO1xyXG4gICAgICB0aGlzLnJlc2V0QXV0aERhdGFTZXJ2aWNlLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoY29uZmlnLCBhbGxDb25maWdzKTtcclxuICAgICAgdGhpcy5mbG93c0RhdGFTZXJ2aWNlLnNldE5vbmNlKCcnLCBjb25maWcpO1xyXG4gICAgICB0aGlzLmhhbmRsZVJlc3VsdEVycm9yRnJvbUNhbGxiYWNrKGNhbGxiYWNrQ29udGV4dC5hdXRoUmVzdWx0LCBjYWxsYmFja0NvbnRleHQuaXNSZW5ld1Byb2Nlc3MpO1xyXG5cclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKGVycm9yTWVzc2FnZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhcclxuICAgICAgY29uZmlnLFxyXG4gICAgICBgQXV0aFJlc3VsdCAnJHtKU09OLnN0cmluZ2lmeShjYWxsYmFja0NvbnRleHQuYXV0aFJlc3VsdCwgbnVsbCwgMil9Jy5cclxuICAgICAgQXV0aENhbGxiYWNrIGNyZWF0ZWQsIGJlZ2luIHRva2VuIHZhbGlkYXRpb25gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnNpZ25JbktleURhdGFTZXJ2aWNlLmdldFNpZ25pbmdLZXlzKGNvbmZpZykucGlwZShcclxuICAgICAgdGFwKChqd3RLZXlzOiBKd3RLZXlzKSA9PiB0aGlzLnN0b3JlU2lnbmluZ0tleXMoand0S2V5cywgY29uZmlnKSksXHJcbiAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4ge1xyXG4gICAgICAgIC8vIGZhbGxiYWNrOiB0cnkgdG8gbG9hZCBqd3RLZXlzIGZyb20gc3RvcmFnZVxyXG4gICAgICAgIGNvbnN0IHN0b3JlZEp3dEtleXMgPSB0aGlzLnJlYWRTaWduaW5nS2V5cyhjb25maWcpO1xyXG5cclxuICAgICAgICBpZiAoISFzdG9yZWRKd3RLZXlzKSB7XHJcbiAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyhjb25maWcsIGBGYWlsZWQgdG8gcmV0cmlldmUgc2lnbmluZyBrZXlzLCBmYWxsYmFjayB0byBzdG9yZWQga2V5c2ApO1xyXG5cclxuICAgICAgICAgIHJldHVybiBvZihzdG9yZWRKd3RLZXlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKCgpID0+IG5ldyBFcnJvcihlcnIpKTtcclxuICAgICAgfSksXHJcbiAgICAgIHN3aXRjaE1hcCgoand0S2V5cykgPT4ge1xyXG4gICAgICAgIGlmIChqd3RLZXlzKSB7XHJcbiAgICAgICAgICBjYWxsYmFja0NvbnRleHQuand0S2V5cyA9IGp3dEtleXM7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIG9mKGNhbGxiYWNrQ29udGV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgRmFpbGVkIHRvIHJldHJpZXZlIHNpZ25pbmcga2V5YDtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoY29uZmlnLCBlcnJvck1lc3NhZ2UpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcigoKSA9PiBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKSk7XHJcbiAgICAgIH0pLFxyXG4gICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcclxuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgRmFpbGVkIHRvIHJldHJpZXZlIHNpZ25pbmcga2V5IHdpdGggZXJyb3I6ICR7ZXJyfWA7XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKGNvbmZpZywgZXJyb3JNZXNzYWdlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKGVycm9yTWVzc2FnZSkpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVzcG9uc2VIYXNJZFRva2VuKGNhbGxiYWNrQ29udGV4dDogQ2FsbGJhY2tDb250ZXh0KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gISFjYWxsYmFja0NvbnRleHQ/LmF1dGhSZXN1bHQ/LmlkX3Rva2VuO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBoYW5kbGVSZXN1bHRFcnJvckZyb21DYWxsYmFjayhyZXN1bHQ6IGFueSwgaXNSZW5ld1Byb2Nlc3M6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIGxldCB2YWxpZGF0aW9uUmVzdWx0ID0gVmFsaWRhdGlvblJlc3VsdC5TZWN1cmVUb2tlblNlcnZlckVycm9yO1xyXG5cclxuICAgIGlmICgocmVzdWx0LmVycm9yIGFzIHN0cmluZykgPT09ICdsb2dpbl9yZXF1aXJlZCcpIHtcclxuICAgICAgdmFsaWRhdGlvblJlc3VsdCA9IFZhbGlkYXRpb25SZXN1bHQuTG9naW5SZXF1aXJlZDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UudXBkYXRlQW5kUHVibGlzaEF1dGhTdGF0ZSh7XHJcbiAgICAgIGlzQXV0aGVudGljYXRlZDogZmFsc2UsXHJcbiAgICAgIHZhbGlkYXRpb25SZXN1bHQsXHJcbiAgICAgIGlzUmVuZXdQcm9jZXNzLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhpc3RvcnlDbGVhblVwVHVybmVkT24oY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCB7IGhpc3RvcnlDbGVhbnVwT2ZmIH0gPSBjb25maWc7XHJcblxyXG4gICAgcmV0dXJuICFoaXN0b3J5Q2xlYW51cE9mZjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVzZXRCcm93c2VySGlzdG9yeSgpOiB2b2lkIHtcclxuICAgIHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcuaGlzdG9yeS5yZXBsYWNlU3RhdGUoXHJcbiAgICAgIHt9LFxyXG4gICAgICB0aGlzLmRvY3VtZW50LnRpdGxlLFxyXG4gICAgICB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3LmxvY2F0aW9uLm9yaWdpbiArIHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcubG9jYXRpb24ucGF0aG5hbWVcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN0b3JlU2lnbmluZ0tleXMoand0S2V5czogSnd0S2V5cywgY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uKTogdm9pZCB7XHJcbiAgICB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2Uud3JpdGUoSldUX0tFWVMsIGp3dEtleXMsIGNvbmZpZyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlYWRTaWduaW5nS2V5cyhjb25maWc6IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBhbnkge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKEpXVF9LRVlTLCBjb25maWcpO1xyXG4gIH1cclxufVxyXG4iXX0=