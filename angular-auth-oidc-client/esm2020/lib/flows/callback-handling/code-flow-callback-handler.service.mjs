import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError, timer } from 'rxjs';
import { catchError, mergeMap, retryWhen, switchMap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/url/url.service";
import * as i2 from "../../logging/logger.service";
import * as i3 from "../../validation/token-validation.service";
import * as i4 from "../flows-data.service";
import * as i5 from "../../storage/storage-persistence.service";
import * as i6 from "../../api/data.service";
export class CodeFlowCallbackHandlerService {
    constructor(urlService, loggerService, tokenValidationService, flowsDataService, storagePersistenceService, dataService) {
        this.urlService = urlService;
        this.loggerService = loggerService;
        this.tokenValidationService = tokenValidationService;
        this.flowsDataService = flowsDataService;
        this.storagePersistenceService = storagePersistenceService;
        this.dataService = dataService;
    }
    // STEP 1 Code Flow
    codeFlowCallback(urlToCheck, config) {
        const code = this.urlService.getUrlParameter(urlToCheck, 'code');
        const state = this.urlService.getUrlParameter(urlToCheck, 'state');
        const sessionState = this.urlService.getUrlParameter(urlToCheck, 'session_state');
        if (!state) {
            this.loggerService.logDebug(config, 'no state in url');
            return throwError(() => new Error('no state in url'));
        }
        if (!code) {
            this.loggerService.logDebug(config, 'no code in url');
            return throwError(() => new Error('no code in url'));
        }
        this.loggerService.logDebug(config, 'running validation for callback', urlToCheck);
        const initialCallbackContext = {
            code,
            refreshToken: null,
            state,
            sessionState,
            authResult: null,
            isRenewProcess: false,
            jwtKeys: null,
            validationResult: null,
            existingIdToken: null,
        };
        return of(initialCallbackContext);
    }
    // STEP 2 Code Flow //  Code Flow Silent Renew starts here
    codeFlowCodeRequest(callbackContext, config) {
        const authStateControl = this.flowsDataService.getAuthStateControl(config);
        const isStateCorrect = this.tokenValidationService.validateStateFromHashCallback(callbackContext.state, authStateControl, config);
        if (!isStateCorrect) {
            return throwError(() => new Error('codeFlowCodeRequest incorrect state'));
        }
        const authWellknownEndpoints = this.storagePersistenceService.read('authWellKnownEndPoints', config);
        const tokenEndpoint = authWellknownEndpoints?.tokenEndpoint;
        if (!tokenEndpoint) {
            return throwError(() => new Error('Token Endpoint not defined'));
        }
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        headers = headers.set('X-OAUTH-IDENTITY-DOMAIN-NAME', 'StudentServicesDomain');
        const bodyForCodeFlow = this.urlService.createBodyForCodeFlowCodeRequest(callbackContext.code, config, config?.customParamsCodeRequest);
        return this.dataService.post(tokenEndpoint, bodyForCodeFlow, config, headers).pipe(switchMap((response) => {
            let authResult = {
                ...response,
                state: callbackContext.state,
                session_state: callbackContext.sessionState,
            };
            callbackContext.authResult = authResult;
            return of(callbackContext);
        }), retryWhen((error) => this.handleRefreshRetry(error, config)), catchError((error) => {
            const { authority } = config;
            const errorMessage = `OidcService code request ${authority}`;
            this.loggerService.logError(config, errorMessage, error);
            return throwError(() => new Error(errorMessage));
        }));
    }
    handleRefreshRetry(errors, config) {
        return errors.pipe(mergeMap((error) => {
            // retry token refresh if there is no internet connection
            if (error && error instanceof HttpErrorResponse && error.error instanceof ProgressEvent && error.error.type === 'error') {
                const { authority, refreshTokenRetryInSeconds } = config;
                const errorMessage = `OidcService code request ${authority} - no internet connection`;
                this.loggerService.logWarning(config, errorMessage, error);
                return timer(refreshTokenRetryInSeconds * 1000);
            }
            return throwError(() => error);
        }));
    }
}
CodeFlowCallbackHandlerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CodeFlowCallbackHandlerService, deps: [{ token: i1.UrlService }, { token: i2.LoggerService }, { token: i3.TokenValidationService }, { token: i4.FlowsDataService }, { token: i5.StoragePersistenceService }, { token: i6.DataService }], target: i0.ɵɵFactoryTarget.Injectable });
CodeFlowCallbackHandlerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CodeFlowCallbackHandlerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CodeFlowCallbackHandlerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.UrlService }, { type: i2.LoggerService }, { type: i3.TokenValidationService }, { type: i4.FlowsDataService }, { type: i5.StoragePersistenceService }, { type: i6.DataService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS1mbG93LWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL2NvZGUtZmxvdy1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7QUFXNUUsTUFBTSxPQUFPLDhCQUE4QjtJQUN6QyxZQUNtQixVQUFzQixFQUN0QixhQUE0QixFQUM1QixzQkFBOEMsRUFDOUMsZ0JBQWtDLEVBQ2xDLHlCQUFvRCxFQUNwRCxXQUF3QjtRQUx4QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFDOUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyw4QkFBeUIsR0FBekIseUJBQXlCLENBQTJCO1FBQ3BELGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQ3hDLENBQUM7SUFFSixtQkFBbUI7SUFDbkIsZ0JBQWdCLENBQUMsVUFBa0IsRUFBRSxNQUEyQjtRQUM5RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDakUsTUFBTSxLQUFL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Q0FBQzthQUNqRDtZQUVELE9BQU8sVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDOzsySEEzR1UsOEJBQThCOytIQUE5Qiw4QkFBOEI7MkZBQTlCLDhCQUE4QjtrQkFEMUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBFcnJvclJlc3BvbnNlLCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciwgdGltZXIgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgY2F0Y2hFcnJvciwgbWVyZ2VNYXAsIHJldHJ5V2hlbiwgc3dpdGNoTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBEYXRhU2VydmljZSB9IGZyb20gJy4uLy4uL2FwaS9kYXRhLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vY29uZmlnL29wZW5pZC1jb25maWd1cmF0aW9uJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc3RvcmFnZS9zdG9yYWdlLXBlcnNpc3RlbmNlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVcmxTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXJsL3VybC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVG9rZW5WYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL3ZhbGlkYXRpb24vdG9rZW4tdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aFJlc3VsdCwgQ2FsbGJhY2tDb250ZXh0IH0gZnJvbSAnLi4vY2FsbGJhY2stY29udGV4dCc7XHJcbmltcG9ydCB7IEZsb3dzRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9mbG93cy1kYXRhLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29kZUZsb3dDYWxsYmFja0hhbmRsZXJTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgdXJsU2VydmljZTogVXJsU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgdG9rZW5WYWxpZGF0aW9uU2VydmljZTogVG9rZW5WYWxpZGF0aW9uU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmxvd3NEYXRhU2VydmljZTogRmxvd3NEYXRhU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZTogU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlXHJcbiAgKSB7fVxyXG5cclxuICAvLyBTVEVQIDEgQ29kZSBGbG93XHJcbiAgY29kZUZsb3dDYWxsYmFjayh1cmxUb0NoZWNrOiBzdHJpbmcsIGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbik6IE9ic2VydmFibGU8Q2FsbGJhY2tDb250ZXh0PiB7XHJcbiAgICBjb25zdCBjb2RlID0gdGhpcy51cmxTZXJ2aWNlLmdldFVybFBhcmFtZXRlcih1cmxUb0NoZWNrLCAnY29kZScpO1xyXG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLnVybFNlcnZpY2UuZ2V0VXJsUGFyYW1ldGVyKHVybFRvQ2hlY2ssICdzdGF0ZScpO1xyXG4gICAgY29uc3Qgc2Vzc2lvblN0YXRlID0gdGhpcy51cmxTZXJ2aWNlLmdldFVybFBhcmFtZXRlcih1cmxUb0NoZWNrLCAnc2Vzc2lvbl9zdGF0ZScpO1xyXG5cclxuICAgIGlmICghc3RhdGUpIHtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZywgJ25vIHN0YXRlIGluIHVybCcpO1xyXG5cclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKCdubyBzdGF0ZSBpbiB1cmwnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFjb2RlKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWcsICdubyBjb2RlIGluIHVybCcpO1xyXG5cclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKCdubyBjb2RlIGluIHVybCcpKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlnLCAncnVubmluZyB2YWxpZGF0aW9uIGZvciBjYWxsYmFjaycsIHVybFRvQ2hlY2spO1xyXG5cclxuICAgIGNvbnN0IGluaXRpYWxDYWxsYmFja0NvbnRleHQgPSB7XHJcbiAgICAgIGNvZGUsXHJcbiAgICAgIHJlZnJlc2hUb2tlbjogbnVsbCxcclxuICAgICAgc3RhdGUsXHJcbiAgICAgIHNlc3Npb25TdGF0ZSxcclxuICAgICAgYXV0aFJlc3VsdDogbnVsbCxcclxuICAgICAgaXNSZW5ld1Byb2Nlc3M6IGZhbHNlLFxyXG4gICAgICBqd3RLZXlzOiBudWxsLFxyXG4gICAgICB2YWxpZGF0aW9uUmVzdWx0OiBudWxsLFxyXG4gICAgICBleGlzdGluZ0lkVG9rZW46IG51bGwsXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBvZihpbml0aWFsQ2FsbGJhY2tDb250ZXh0KTtcclxuICB9XHJcblxyXG4gIC8vIFNURVAgMiBDb2RlIEZsb3cgLy8gIENvZGUgRmxvdyBTaWxlbnQgUmVuZXcgc3RhcnRzIGhlcmVcclxuICBjb2RlRmxvd0NvZGVSZXF1ZXN0KGNhbGxiYWNrQ29udGV4dDogQ2FsbGJhY2tDb250ZXh0LCBjb25maWc6IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBPYnNlcnZhYmxlPENhbGxiYWNrQ29udGV4dD4ge1xyXG4gICAgY29uc3QgYXV0aFN0YXRlQ29udHJvbCA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5nZXRBdXRoU3RhdGVDb250cm9sKGNvbmZpZyk7XHJcbiAgICBjb25zdCBpc1N0YXRlQ29ycmVjdCA9IHRoaXMudG9rZW5WYWxpZGF0aW9uU2VydmljZS52YWxpZGF0ZVN0YXRlRnJvbUhhc2hDYWxsYmFjayhjYWxsYmFja0NvbnRleHQuc3RhdGUsIGF1dGhTdGF0ZUNvbnRyb2wsIGNvbmZpZyk7XHJcblxyXG4gICAgaWYgKCFpc1N0YXRlQ29ycmVjdCkge1xyXG4gICAgICByZXR1cm4gdGhyb3dFcnJvcigoKSA9PiBuZXcgRXJyb3IoJ2NvZGVGbG93Q29kZVJlcXVlc3QgaW5jb3JyZWN0IHN0YXRlJykpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGF1dGhXZWxsa25vd25FbmRwb2ludHMgPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnYXV0aFdlbGxLbm93bkVuZFBvaW50cycsIGNvbmZpZyk7XHJcbiAgICBjb25zdCB0b2tlbkVuZHBvaW50ID0gYXV0aFdlbGxrbm93bkVuZHBvaW50cz8udG9rZW5FbmRwb2ludDtcclxuXHJcbiAgICBpZiAoIXRva2VuRW5kcG9pbnQpIHtcclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKCdUb2tlbiBFbmRwb2ludCBub3QgZGVmaW5lZCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaGVhZGVyczogSHR0cEhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuXHJcbiAgICBoZWFkZXJzID0gaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuXHJcbiAgICBjb25zdCBib2R5Rm9yQ29kZUZsb3cgPSB0aGlzLnVybFNlcnZpY2UuY3JlYXRlQm9keUZvckNvZGVGbG93Q29kZVJlcXVlc3QoY2FsbGJhY2tDb250ZXh0LmNvZGUsIGNvbmZpZywgY29uZmlnPy5jdXN0b21QYXJhbXNDb2RlUmVxdWVzdCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcnZpY2UucG9zdCh0b2tlbkVuZHBvaW50LCBib2R5Rm9yQ29kZUZsb3csIGNvbmZpZywgaGVhZGVycykucGlwZShcclxuICAgICAgc3dpdGNoTWFwKChyZXNwb25zZTogQXV0aFJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGxldCBhdXRoUmVzdWx0OiBBdXRoUmVzdWx0ID0ge1xyXG4gICAgICAgICAgLi4ucmVzcG9uc2UsXHJcbiAgICAgICAgICBzdGF0ZTogY2FsbGJhY2tDb250ZXh0LnN0YXRlLFxyXG4gICAgICAgICAgc2Vzc2lvbl9zdGF0ZTogY2FsbGJhY2tDb250ZXh0LnNlc3Npb25TdGF0ZSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjYWxsYmFja0NvbnRleHQuYXV0aFJlc3VsdCA9IGF1dGhSZXN1bHQ7XHJcblxyXG4gICAgICAgIHJldHVybiBvZihjYWxsYmFja0NvbnRleHQpO1xyXG4gICAgICB9KSxcclxuICAgICAgcmV0cnlXaGVuKChlcnJvcikgPT4gdGhpcy5oYW5kbGVSZWZyZXNoUmV0cnkoZXJyb3IsIGNvbmZpZykpLFxyXG4gICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXR5IH0gPSBjb25maWc7XHJcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYE9pZGNTZXJ2aWNlIGNvZGUgcmVxdWVzdCAke2F1dGhvcml0eX1gO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoY29uZmlnLCBlcnJvck1lc3NhZ2UsIGVycm9yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKGVycm9yTWVzc2FnZSkpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaGFuZGxlUmVmcmVzaFJldHJ5KGVycm9yczogT2JzZXJ2YWJsZTxhbnk+LCBjb25maWc6IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIGVycm9ycy5waXBlKFxyXG4gICAgICBtZXJnZU1hcCgoZXJyb3IpID0+IHtcclxuICAgICAgICAvLyByZXRyeSB0b2tlbiByZWZyZXNoIGlmIHRoZXJlIGlzIG5vIGludGVybmV0IGNvbm5lY3Rpb25cclxuICAgICAgICBpZiAoZXJyb3IgJiYgZXJyb3IgaW5zdGFuY2VvZiBIdHRwRXJyb3JSZXNwb25zZSAmJiBlcnJvci5lcnJvciBpbnN0YW5jZW9mIFByb2dyZXNzRXZlbnQgJiYgZXJyb3IuZXJyb3IudHlwZSA9PT0gJ2Vycm9yJykge1xyXG4gICAgICAgICAgY29uc3QgeyBhdXRob3JpdHksIHJlZnJlc2hUb2tlblJldHJ5SW5TZWNvbmRzIH0gPSBjb25maWc7XHJcbiAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgT2lkY1NlcnZpY2UgY29kZSByZXF1ZXN0ICR7YXV0aG9yaXR5fSAtIG5vIGludGVybmV0IGNvbm5lY3Rpb25gO1xyXG5cclxuICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKGNvbmZpZywgZXJyb3JNZXNzYWdlLCBlcnJvcik7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHRpbWVyKHJlZnJlc2hUb2tlblJldHJ5SW5TZWNvbmRzICogMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcigoKSA9PiBlcnJvcik7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=