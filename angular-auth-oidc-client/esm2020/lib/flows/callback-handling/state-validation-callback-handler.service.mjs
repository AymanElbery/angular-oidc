import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../validation/state-validation.service";
import * as i3 from "../../auth-state/auth-state.service";
import * as i4 from "../reset-auth-data.service";
export class StateValidationCallbackHandlerService {
    constructor(loggerService, stateValidationService, authStateService, resetAuthDataService, document) {
        this.loggerService = loggerService;
        this.stateValidationService = stateValidationService;
        this.authStateService = authStateService;
        this.resetAuthDataService = resetAuthDataService;
        this.document = document;
    }
    // STEP 4 All flows
    callbackStateValidation(callbackContext, configuration, allConfigs) {
        return this.stateValidationService.getValidatedStateResult(callbackContext, configuration).pipe(map((validationResult) => {
            callbackContext.validationResult = validationResult;
            if (validationResult.authResponseIsValid) {
                this.authStateService.setAuthorizationData(validationResult.accessToken, callbackContext.authResult, configuration, allConfigs);
                return callbackContext;
            }
            else {
                const errorMessage = `authorizedCallback, token(s) validation failed, resetting. Hash: ${this.document.location.hash}`;
                this.loggerService.logWarning(configuration, errorMessage);
                this.resetAuthDataService.resetAuthorizationData(configuration, allConfigs);
                this.publishUnauthorizedState(callbackContext.validationResult, callbackContext.isRenewProcess);
                throw new Error(errorMessage);
            }
        }));
    }
    publishUnauthorizedState(stateValidationResult, isRenewProcess) {
        this.authStateService.updateAndPublishAuthState({
            isAuthenticated: false,
            validationResult: stateValidationResult.state,
            isRenewProcess,
        });
    }
}
StateValidationCallbackHandlerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: StateValidationCallbackHandlerService, deps: [{ token: i1.LoggerService }, { token: i2.StateValidationService }, { token: i3.AuthStateService }, { token: i4.ResetAuthDataService }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
StateValidationCallbackHandlerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: StateValidationCallbackHandlerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: StateValidationCallbackHandlerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LoggerService }, { type: i2.StateValidationService }, { type: i3.AuthStateService }, { type: i4.ResetAuthDataService }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtdmFsaWRhdGlvbi1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy9zdGF0ZS12YWxpZGF0aW9uLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFbkQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7QUFVckMsTUFBTSxPQUFPLHFDQUFxQztJQUNoRCxZQUNtQixhQUE0QixFQUM1QixzQkFBOEMsRUFDOUMsZ0JBQWtDLEVBQ2xDLG9CQUEwQyxFQUN4QixRQUFrQjtRQUpwQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QiwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBQzlDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUN4QixhQUFRLEdBQVIsUUFBUSxDQUFVO0lBQ3BELENBQUM7SUFFSixtQkFBbUI7SUFDbkIsdUJBQXVCLENBQ3JCLGVBQWdDLEVBQ2hDLGFBQWtDLEVBQ2xDLFVBQWlDO1FBRWpDLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLHVCQUF1QixDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQzdGLEdBQUcsQ0FBQyxDQUFDLGdCQUF1QyxFQUFFLEVBQUU7WUFDOUMsZUFBZSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1lBRXBELElBQUksZ0JBQWdCLENBQUMsbUJBQW1CLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBRWhJLE9BQU8sZUFBZSxDQUFDO2FBQ3hCO2lCQUFNO2dCQUNMLE1BQU0sWUFBWSxHQUFHLG9FQUFvRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFFdkgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsc0JBQXNCLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUM1RSxJQUFJLENBQUMsd0JBQXdCLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFFaEcsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUMvQjtRQUNILENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBRU8sd0JBQXdCLENBQUMscUJBQTRDLEVBQUUsY0FBdUI7UUFDcEcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDO1lBQzlDLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLGdCQUFnQixFQUFFLHFCQUFxQixDQUFDLEtBQUs7WUFDN0MsY0FBYztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7O2tJQTFDVSxxQ0FBcUMseUpBTXRDLFFBQVE7c0lBTlAscUNBQXFDOzJGQUFyQyxxQ0FBcUM7a0JBRGpELFVBQVU7OzBCQU9OLE1BQU07MkJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBBdXRoU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYXV0aC1zdGF0ZS9hdXRoLXN0YXRlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vY29uZmlnL29wZW5pZC1jb25maWd1cmF0aW9uJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdGF0ZVZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICcuLi8uLi92YWxpZGF0aW9uL3N0YXRlLXZhbGlkYXRpb24tcmVzdWx0JztcclxuaW1wb3J0IHsgU3RhdGVWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL3ZhbGlkYXRpb24vc3RhdGUtdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FsbGJhY2tDb250ZXh0IH0gZnJvbSAnLi4vY2FsbGJhY2stY29udGV4dCc7XHJcbmltcG9ydCB7IFJlc2V0QXV0aERhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vcmVzZXQtYXV0aC1kYXRhLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgU3RhdGVWYWxpZGF0aW9uQ2FsbGJhY2tIYW5kbGVyU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHN0YXRlVmFsaWRhdGlvblNlcnZpY2U6IFN0YXRlVmFsaWRhdGlvblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJlc2V0QXV0aERhdGFTZXJ2aWNlOiBSZXNldEF1dGhEYXRhU2VydmljZSxcclxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgcmVhZG9ubHkgZG9jdW1lbnQ6IERvY3VtZW50XHJcbiAgKSB7fVxyXG5cclxuICAvLyBTVEVQIDQgQWxsIGZsb3dzXHJcbiAgY2FsbGJhY2tTdGF0ZVZhbGlkYXRpb24oXHJcbiAgICBjYWxsYmFja0NvbnRleHQ6IENhbGxiYWNrQ29udGV4dCxcclxuICAgIGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24sXHJcbiAgICBhbGxDb25maWdzOiBPcGVuSWRDb25maWd1cmF0aW9uW11cclxuICApOiBPYnNlcnZhYmxlPENhbGxiYWNrQ29udGV4dD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RhdGVWYWxpZGF0aW9uU2VydmljZS5nZXRWYWxpZGF0ZWRTdGF0ZVJlc3VsdChjYWxsYmFja0NvbnRleHQsIGNvbmZpZ3VyYXRpb24pLnBpcGUoXHJcbiAgICAgIG1hcCgodmFsaWRhdGlvblJlc3VsdDogU3RhdGVWYWxpZGF0aW9uUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgY2FsbGJhY2tDb250ZXh0LnZhbGlkYXRpb25SZXN1bHQgPSB2YWxpZGF0aW9uUmVzdWx0O1xyXG5cclxuICAgICAgICBpZiAodmFsaWRhdGlvblJlc3VsdC5hdXRoUmVzcG9uc2VJc1ZhbGlkKSB7XHJcbiAgICAgICAgICB0aGlzLmF1dGhTdGF0ZVNlcnZpY2Uuc2V0QXV0aG9yaXphdGlvbkRhdGEodmFsaWRhdGlvblJlc3VsdC5hY2Nlc3NUb2tlbiwgY2FsbGJhY2tDb250ZXh0LmF1dGhSZXN1bHQsIGNvbmZpZ3VyYXRpb24sIGFsbENvbmZpZ3MpO1xyXG5cclxuICAgICAgICAgIHJldHVybiBjYWxsYmFja0NvbnRleHQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBhdXRob3JpemVkQ2FsbGJhY2ssIHRva2VuKHMpIHZhbGlkYXRpb24gZmFpbGVkLCByZXNldHRpbmcuIEhhc2g6ICR7dGhpcy5kb2N1bWVudC5sb2NhdGlvbi5oYXNofWA7XHJcblxyXG4gICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoY29uZmlndXJhdGlvbiwgZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgIHRoaXMucmVzZXRBdXRoRGF0YVNlcnZpY2UucmVzZXRBdXRob3JpemF0aW9uRGF0YShjb25maWd1cmF0aW9uLCBhbGxDb25maWdzKTtcclxuICAgICAgICAgIHRoaXMucHVibGlzaFVuYXV0aG9yaXplZFN0YXRlKGNhbGxiYWNrQ29udGV4dC52YWxpZGF0aW9uUmVzdWx0LCBjYWxsYmFja0NvbnRleHQuaXNSZW5ld1Byb2Nlc3MpO1xyXG5cclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHB1Ymxpc2hVbmF1dGhvcml6ZWRTdGF0ZShzdGF0ZVZhbGlkYXRpb25SZXN1bHQ6IFN0YXRlVmFsaWRhdGlvblJlc3VsdCwgaXNSZW5ld1Byb2Nlc3M6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuYXV0aFN0YXRlU2VydmljZS51cGRhdGVBbmRQdWJsaXNoQXV0aFN0YXRlKHtcclxuICAgICAgaXNBdXRoZW50aWNhdGVkOiBmYWxzZSxcclxuICAgICAgdmFsaWRhdGlvblJlc3VsdDogc3RhdGVWYWxpZGF0aW9uUmVzdWx0LnN0YXRlLFxyXG4gICAgICBpc1JlbmV3UHJvY2VzcyxcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=