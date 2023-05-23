import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ValidationResult } from '../validation/validation-result';
import * as i0 from "@angular/core";
import * as i1 from "./existing-iframe.service";
import * as i2 from "../flows/flows.service";
import * as i3 from "../flows/reset-auth-data.service";
import * as i4 from "../flows/flows-data.service";
import * as i5 from "../auth-state/auth-state.service";
import * as i6 from "../logging/logger.service";
import * as i7 from "../utils/flowHelper/flow-helper.service";
import * as i8 from "../callback/implicit-flow-callback.service";
import * as i9 from "../callback/interval.service";
const IFRAME_FOR_SILENT_RENEW_IDENTIFIER = 'myiFrameForSilentRenew';
export class SilentRenewService {
    constructor(iFrameService, flowsService, resetAuthDataService, flowsDataService, authStateService, loggerService, flowHelper, implicitFlowCallbackService, intervalService) {
        this.iFrameService = iFrameService;
        this.flowsService = flowsService;
        this.resetAuthDataService = resetAuthDataService;
        this.flowsDataService = flowsDataService;
        this.authStateService = authStateService;
        this.loggerService = loggerService;
        this.flowHelper = flowHelper;
        this.implicitFlowCallbackService = implicitFlowCallbackService;
        this.intervalService = intervalService;
        this.refreshSessionWithIFrameCompletedInternal$ = new Subject();
    }
    get refreshSessionWithIFrameCompleted$() {
        return this.refreshSessionWithIFrameCompletedInternal$.asObservable();
    }
    getOrCreateIframe(config) {
        const existingIframe = this.getExistingIframe();
        if (!existingIframe) {
            return this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_SILENT_RENEW_IDENTIFIER, config);
        }
        return existingIframe;
    }
    isSilentRenewConfigured(configuration) {
        const { useRefreshToken, silentRenew } = configuration;
        return !useRefreshToken && silentRenew;
    }
    codeFlowCallbackSilentRenewIframe(urlParts, config, allConfigs) {
        const params = new HttpParams({
            fromString: urlParts[1],
        });
        const error = params.get('error');
        if (error) {
            this.authStateService.updateAndPublishAuthState({
                isAuthenticated: false,
                validationResult: ValidationResult.LoginRequired,
                isRenewProcess: true,
            });
            this.resetAuthDataService.resetAuthorizationData(config, allConfigs);
            this.flowsDataService.setNonce('', config);
            this.intervalService.stopPeriodicTokenCheck();
            return throwError(() => new Error(error));
        }
        const code = params.get('code');
        const state = params.get('state');
        const sessionState = params.get('session_state');
        const callbackContext = {
            code,
            refreshToken: null,
            state,
            sessionState,
            authResult: null,
            isRenewProcess: true,
            jwtKeys: null,
            validationResult: null,
            existingIdToken: null,
        };
        return this.flowsService.processSilentRenewCodeFlowCallback(callbackContext, config, allConfigs).pipe(catchError(() => {
            this.intervalService.stopPeriodicTokenCheck();
            this.resetAuthDataService.resetAuthorizationData(config, allConfigs);
            return throwError(() => new Error(error));
        }));
    }
    silentRenewEventHandler(e, config, allConfigs) {
        this.loggerService.logDebug(config, 'silentRenewEventHandler');
        if (!e.detail) {
            return;
        }
        let callback$ = of(null);
        const isCodeFlow = this.flowHelper.isCurrentFlowCodeFlow(config);
        if (isCodeFlow) {
            const urlParts = e.detail.toString().split('?');
            callback$ = this.codeFlowCallbackSilentRenewIframe(urlParts, config, allConfigs);
        }
        else {
            callback$ = this.implicitFlowCallbackService.authenticatedImplicitFlowCallback(config, allConfigs, e.detail);
        }
        callback$.subscribe({
            next: (callbackContext) => {
                this.refreshSessionWithIFrameCompletedInternal$.next(callbackContext);
                this.flowsDataService.resetSilentRenewRunning(config);
            },
            error: (err) => {
                this.loggerService.logError(config, 'Error: ' + err);
                this.refreshSessionWithIFrameCompletedInternal$.next(null);
                this.flowsDataService.resetSilentRenewRunning(config);
            },
        });
    }
    getExistingIframe() {
        return this.iFrameService.getExistingIFrame(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
    }
}
SilentRenewService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: SilentRenewService, deps: [{ token: i1.IFrameService }, { token: i2.FlowsService }, { token: i3.ResetAuthDataService }, { token: i4.FlowsDataService }, { token: i5.AuthStateService }, { token: i6.LoggerService }, { token: i7.FlowHelper }, { token: i8.ImplicitFlowCallbackService }, { token: i9.IntervalService }], target: i0.ɵɵFactoryTarget.Injectable });
SilentRenewService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: SilentRenewService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: SilentRenewService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.IFrameService }, { type: i2.FlowsService }, { type: i3.ResetAuthDataService }, { type: i4.FlowsDataService }, { type: i5.AuthStateService }, { type: i6.LoggerService }, { type: i7.FlowHelper }, { type: i8.ImplicitFlowCallbackService }, { type: i9.IntervalService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lsZW50LXJlbmV3LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9pZnJhbWUvc2lsZW50LXJlbmV3LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLEVBQUUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQVU1QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQzs7Ozs7Ozs7Ozs7QUFJbkUsTUFBTSxrQ0FBa0MsR0FBRyx3QkFBd0IsQ0FBQztBQUdwRSxNQUFNLE9BQU8sa0JBQWtCO0lBTzdCLFlBQ21CLGFBQTRCLEVBQzVCLFlBQTBCLEVBQzFCLG9CQUEwQyxFQUMxQyxnQkFBa0MsRUFDbEMsZ0JBQWtDLEVBQ2xDLGFBQTRCLEVBQzVCLFVBQXNCLEVBQ3RCLDJCQUF3RCxFQUN4RCxlQUFnQztRQVJoQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGdDQUEyQixHQUEzQiwyQkFBMkIsQ0FBNkI7UUFDeEQsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBZmxDLCtDQUEwQyxHQUFHLElBQUksT0FBTyxFQUFt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QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNsRixDQUFDOzsrR0FySFUsa0JBQWtCO21IQUFsQixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFEOUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBQYXJhbXMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIFN1YmplY3QsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgY2F0Y2hFcnJvciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQXV0aFN0YXRlU2VydmljZSB9IGZyb20gJy4uL2F1dGgtc3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSW1wbGljaXRGbG93Q2FsbGJhY2tTZXJ2aWNlIH0gZnJvbSAnLi4vY2FsbGJhY2svaW1wbGljaXQtZmxvdy1jYWxsYmFjay5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSW50ZXJ2YWxTZXJ2aWNlIH0gZnJvbSAnLi4vY2FsbGJhY2svaW50ZXJ2YWwuc2VydmljZSc7XHJcbmltcG9ydCB7IENhbGxiYWNrQ29udGV4dCB9IGZyb20gJy4uL2Zsb3dzL2NhbGxiYWNrLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBGbG93c0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZmxvd3MvZmxvd3MtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmxvd3NTZXJ2aWNlIH0gZnJvbSAnLi4vZmxvd3MvZmxvd3Muc2VydmljZSc7XHJcbmltcG9ydCB7IFJlc2V0QXV0aERhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZmxvd3MvcmVzZXQtYXV0aC1kYXRhLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEZsb3dIZWxwZXIgfSBmcm9tICcuLi91dGlscy9mbG93SGVscGVyL2Zsb3ctaGVscGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnLi4vdmFsaWRhdGlvbi92YWxpZGF0aW9uLXJlc3VsdCc7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IElGcmFtZVNlcnZpY2UgfSBmcm9tICcuL2V4aXN0aW5nLWlmcmFtZS5zZXJ2aWNlJztcclxuXHJcbmNvbnN0IElGUkFNRV9GT1JfU0lMRU5UX1JFTkVXX0lERU5USUZJRVIgPSAnbXlpRnJhbWVGb3JTaWxlbnRSZW5ldyc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTaWxlbnRSZW5ld1NlcnZpY2Uge1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgcmVmcmVzaFNlc3Npb25XaXRoSUZyYW1lQ29tcGxldGVkSW50ZXJuYWwkID0gbmV3IFN1YmplY3Q8Q2FsbGJhY2tDb250ZXh0PigpO1xyXG5cclxuICBnZXQgcmVmcmVzaFNlc3Npb25XaXRoSUZyYW1lQ29tcGxldGVkJCgpOiBPYnNlcnZhYmxlPENhbGxiYWNrQ29udGV4dD4ge1xyXG4gICAgcmV0dXJuIHRoaXMucmVmcmVzaFNlc3Npb25XaXRoSUZyYW1lQ29tcGxldGVkSW50ZXJuYWwkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGlGcmFtZVNlcnZpY2U6IElGcmFtZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dzU2VydmljZTogRmxvd3NTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSByZXNldEF1dGhEYXRhU2VydmljZTogUmVzZXRBdXRoRGF0YVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dIZWxwZXI6IEZsb3dIZWxwZXIsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGltcGxpY2l0Rmxvd0NhbGxiYWNrU2VydmljZTogSW1wbGljaXRGbG93Q2FsbGJhY2tTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBpbnRlcnZhbFNlcnZpY2U6IEludGVydmFsU2VydmljZVxyXG4gICkge31cclxuXHJcbiAgZ2V0T3JDcmVhdGVJZnJhbWUoY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uKTogSFRNTElGcmFtZUVsZW1lbnQge1xyXG4gICAgY29uc3QgZXhpc3RpbmdJZnJhbWUgPSB0aGlzLmdldEV4aXN0aW5nSWZyYW1lKCk7XHJcblxyXG4gICAgaWYgKCFleGlzdGluZ0lmcmFtZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pRnJhbWVTZXJ2aWNlLmFkZElGcmFtZVRvV2luZG93Qm9keShJRlJBTUVfRk9SX1NJTEVOVF9SRU5FV19JREVOVElGSUVSLCBjb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBleGlzdGluZ0lmcmFtZTtcclxuICB9XHJcblxyXG4gIGlzU2lsZW50UmVuZXdDb25maWd1cmVkKGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHsgdXNlUmVmcmVzaFRva2VuLCBzaWxlbnRSZW5ldyB9ID0gY29uZmlndXJhdGlvbjtcclxuXHJcbiAgICByZXR1cm4gIXVzZVJlZnJlc2hUb2tlbiAmJiBzaWxlbnRSZW5ldztcclxuICB9XHJcblxyXG4gIGNvZGVGbG93Q2FsbGJhY2tTaWxlbnRSZW5ld0lmcmFtZShcclxuICAgIHVybFBhcnRzOiBzdHJpbmdbXSxcclxuICAgIGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIGFsbENvbmZpZ3M6IE9wZW5JZENvbmZpZ3VyYXRpb25bXVxyXG4gICk6IE9ic2VydmFibGU8Q2FsbGJhY2tDb250ZXh0PiB7XHJcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcyh7XHJcbiAgICAgIGZyb21TdHJpbmc6IHVybFBhcnRzWzFdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZXJyb3IgPSBwYXJhbXMuZ2V0KCdlcnJvcicpO1xyXG5cclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UudXBkYXRlQW5kUHVibGlzaEF1dGhTdGF0ZSh7XHJcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBmYWxzZSxcclxuICAgICAgICB2YWxpZGF0aW9uUmVzdWx0OiBWYWxpZGF0aW9uUmVzdWx0LkxvZ2luUmVxdWlyZWQsXHJcbiAgICAgICAgaXNSZW5ld1Byb2Nlc3M6IHRydWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLnJlc2V0QXV0aERhdGFTZXJ2aWNlLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoY29uZmlnLCBhbGxDb25maWdzKTtcclxuICAgICAgdGhpcy5mbG93c0RhdGFTZXJ2aWNlLnNldE5vbmNlKCcnLCBjb25maWcpO1xyXG4gICAgICB0aGlzLmludGVydmFsU2VydmljZS5zdG9wUGVyaW9kaWNUb2tlbkNoZWNrKCk7XHJcblxyXG4gICAgICByZXR1cm4gdGhyb3dFcnJvcigoKSA9PiBuZXcgRXJyb3IoZXJyb3IpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb2RlID0gcGFyYW1zLmdldCgnY29kZScpO1xyXG4gICAgY29uc3Qgc3RhdGUgPSBwYXJhbXMuZ2V0KCdzdGF0ZScpO1xyXG4gICAgY29uc3Qgc2Vzc2lvblN0YXRlID0gcGFyYW1zLmdldCgnc2Vzc2lvbl9zdGF0ZScpO1xyXG5cclxuICAgIGNvbnN0IGNhbGxiYWNrQ29udGV4dCA9IHtcclxuICAgICAgY29kZSxcclxuICAgICAgcmVmcmVzaFRva2VuOiBudWxsLFxyXG4gICAgICBzdGF0ZSxcclxuICAgICAgc2Vzc2lvblN0YXRlLFxyXG4gICAgICBhdXRoUmVzdWx0OiBudWxsLFxyXG4gICAgICBpc1JlbmV3UHJvY2VzczogdHJ1ZSxcclxuICAgICAgand0S2V5czogbnVsbCxcclxuICAgICAgdmFsaWRhdGlvblJlc3VsdDogbnVsbCxcclxuICAgICAgZXhpc3RpbmdJZFRva2VuOiBudWxsLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5mbG93c1NlcnZpY2UucHJvY2Vzc1NpbGVudFJlbmV3Q29kZUZsb3dDYWxsYmFjayhjYWxsYmFja0NvbnRleHQsIGNvbmZpZywgYWxsQ29uZmlncykucGlwZShcclxuICAgICAgY2F0Y2hFcnJvcigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbnRlcnZhbFNlcnZpY2Uuc3RvcFBlcmlvZGljVG9rZW5DaGVjaygpO1xyXG4gICAgICAgIHRoaXMucmVzZXRBdXRoRGF0YVNlcnZpY2UucmVzZXRBdXRob3JpemF0aW9uRGF0YShjb25maWcsIGFsbENvbmZpZ3MpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcigoKSA9PiBuZXcgRXJyb3IoZXJyb3IpKTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBzaWxlbnRSZW5ld0V2ZW50SGFuZGxlcihlOiBDdXN0b21FdmVudCwgY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uLCBhbGxDb25maWdzOiBPcGVuSWRDb25maWd1cmF0aW9uW10pOiB2b2lkIHtcclxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWcsICdzaWxlbnRSZW5ld0V2ZW50SGFuZGxlcicpO1xyXG4gICAgaWYgKCFlLmRldGFpbCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNhbGxiYWNrJCA9IG9mKG51bGwpIGFzIE9ic2VydmFibGU8Q2FsbGJhY2tDb250ZXh0PjtcclxuICAgIGNvbnN0IGlzQ29kZUZsb3cgPSB0aGlzLmZsb3dIZWxwZXIuaXNDdXJyZW50Rmxvd0NvZGVGbG93KGNvbmZpZyk7XHJcblxyXG4gICAgaWYgKGlzQ29kZUZsb3cpIHtcclxuICAgICAgY29uc3QgdXJsUGFydHMgPSBlLmRldGFpbC50b1N0cmluZygpLnNwbGl0KCc/Jyk7XHJcblxyXG4gICAgICBjYWxsYmFjayQgPSB0aGlzLmNvZGVGbG93Q2FsbGJhY2tTaWxlbnRSZW5ld0lmcmFtZSh1cmxQYXJ0cywgY29uZmlnLCBhbGxDb25maWdzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrJCA9IHRoaXMuaW1wbGljaXRGbG93Q2FsbGJhY2tTZXJ2aWNlLmF1dGhlbnRpY2F0ZWRJbXBsaWNpdEZsb3dDYWxsYmFjayhjb25maWcsIGFsbENvbmZpZ3MsIGUuZGV0YWlsKTtcclxuICAgIH1cclxuXHJcbiAgICBjYWxsYmFjayQuc3Vic2NyaWJlKHtcclxuICAgICAgbmV4dDogKGNhbGxiYWNrQ29udGV4dCkgPT4ge1xyXG4gICAgICAgIHRoaXMucmVmcmVzaFNlc3Npb25XaXRoSUZyYW1lQ29tcGxldGVkSW50ZXJuYWwkLm5leHQoY2FsbGJhY2tDb250ZXh0KTtcclxuICAgICAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2UucmVzZXRTaWxlbnRSZW5ld1J1bm5pbmcoY29uZmlnKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6IChlcnI6IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWcsICdFcnJvcjogJyArIGVycik7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoU2Vzc2lvbldpdGhJRnJhbWVDb21wbGV0ZWRJbnRlcm5hbCQubmV4dChudWxsKTtcclxuICAgICAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2UucmVzZXRTaWxlbnRSZW5ld1J1bm5pbmcoY29uZmlnKTtcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRFeGlzdGluZ0lmcmFtZSgpOiBIVE1MSUZyYW1lRWxlbWVudCB7XHJcbiAgICByZXR1cm4gdGhpcy5pRnJhbWVTZXJ2aWNlLmdldEV4aXN0aW5nSUZyYW1lKElGUkFNRV9GT1JfU0lMRU5UX1JFTkVXX0lERU5USUZJRVIpO1xyXG4gIH1cclxufVxyXG4iXX0=