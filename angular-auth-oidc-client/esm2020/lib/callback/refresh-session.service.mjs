import { Injectable } from '@angular/core';
import { forkJoin, of, throwError, TimeoutError, timer } from 'rxjs';
import { map, mergeMap, retryWhen, switchMap, take, timeout } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../utils/flowHelper/flow-helper.service";
import * as i2 from "../flows/flows-data.service";
import * as i3 from "../logging/logger.service";
import * as i4 from "../iframe/silent-renew.service";
import * as i5 from "../auth-state/auth-state.service";
import * as i6 from "../config/auth-well-known/auth-well-known.service";
import * as i7 from "../iframe/refresh-session-iframe.service";
import * as i8 from "../storage/storage-persistence.service";
import * as i9 from "./refresh-session-refresh-token.service";
import * as i10 from "../user-data/user.service";
export const MAX_RETRY_ATTEMPTS = 3;
export class RefreshSessionService {
    constructor(flowHelper, flowsDataService, loggerService, silentRenewService, authStateService, authWellKnownService, refreshSessionIframeService, storagePersistenceService, refreshSessionRefreshTokenService, userService) {
        this.flowHelper = flowHelper;
        this.flowsDataService = flowsDataService;
        this.loggerService = loggerService;
        this.silentRenewService = silentRenewService;
        this.authStateService = authStateService;
        this.authWellKnownService = authWellKnownService;
        this.refreshSessionIframeService = refreshSessionIframeService;
        this.storagePersistenceService = storagePersistenceService;
        this.refreshSessionRefreshTokenService = refreshSessionRefreshTokenService;
        this.userService = userService;
    }
    userForceRefreshSession(config, allConfigs, extraCustomParams) {
        this.persistCustomParams(extraCustomParams, config);
        return this.forceRefreshSession(config, allConfigs, extraCustomParams);
    }
    forceRefreshSession(config, allConfigs, extraCustomParams) {
        const { customParamsRefreshTokenRequest, configId } = config;
        const mergedParams = { ...customParamsRefreshTokenRequest, ...extraCustomParams };
        if (this.flowHelper.isCurrentFlowCodeFlowWithRefreshTokens(config)) {
            return this.startRefreshSession(config, allConfigs, mergedParams).pipe(map(() => {
                const isAuthenticated = this.authStateService.areAuthStorageTokensValid(config);
                if (isAuthenticated) {
                    return {
                        idToken: this.authStateService.getIdToken(config),
                        accessToken: this.authStateService.getAccessToken(config),
                        userData: this.userService.getUserDataFromStore(config),
                        isAuthenticated,
                        configId,
                    };
                }
                return null;
            }));
        }
        const { silentRenewTimeoutInSeconds } = config;
        const timeOutTime = silentRenewTimeoutInSeconds * 1000;
        return forkJoin([
            this.startRefreshSession(config, allConfigs, extraCustomParams),
            this.silentRenewService.refreshSessionWithIFrameCompleted$.pipe(take(1)),
        ]).pipe(timeout(timeOutTime), retryWhen(this.timeoutRetryStrategy.bind(this)), map(([_, callbackContext]) => {
            const isAuthenticated = this.authStateService.areAuthStorageTokensValid(config);
            if (isAuthenticated) {
                return {
                    idToken: callbackContext?.authResult?.id_token,
                    accessToken: callbackContext?.authResult?.access_token,
                    userData: this.userService.getUserDataFromStore(config),
                    isAuthenticated,
                    configId,
                };
            }
            return null;
        }));
    }
    persistCustomParams(extraCustomParams, config) {
        const { useRefreshToken } = config;
        if (extraCustomParams) {
            if (useRefreshToken) {
                this.storagePersistenceService.write('storageCustomParamsRefresh', extraCustomParams, config);
            }
            else {
                this.storagePersistenceService.write('storageCustomParamsAuthRequest', extraCustomParams, config);
            }
        }
    }
    startRefreshSession(config, allConfigs, extraCustomParams) {
        const isSilentRenewRunning = this.flowsDataService.isSilentRenewRunning(config);
        this.loggerService.logDebug(config, `Checking: silentRenewRunning: ${isSilentRenewRunning}`);
        const shouldBeExecuted = !isSilentRenewRunning;
        if (!shouldBeExecuted) {
            return of(null);
        }
        return this.authWellKnownService.queryAndStoreAuthWellKnownEndPoints(config).pipe(switchMap(() => {
            this.flowsDataService.setSilentRenewRunning(config);
            if (this.flowHelper.isCurrentFlowCodeFlowWithRefreshTokens(config)) {
                // Refresh Session using Refresh tokens
                return this.refreshSessionRefreshTokenService.refreshSessionWithRefreshTokens(config, allConfigs, extraCustomParams);
            }
            return this.refreshSessionIframeService.refreshSessionWithIframe(config, allConfigs, extraCustomParams);
        }));
    }
    timeoutRetryStrategy(errorAttempts, config) {
        return errorAttempts.pipe(mergeMap((error, index) => {
            const scalingDuration = 1000;
            const currentAttempt = index + 1;
            if (!(error instanceof TimeoutError) || currentAttempt > MAX_RETRY_ATTEMPTS) {
                return throwError(() => new Error(error));
            }
            this.loggerService.logDebug(config, `forceRefreshSession timeout. Attempt #${currentAttempt}`);
            this.flowsDataService.resetSilentRenewRunning(config);
            return timer(currentAttempt * scalingDuration);
        }));
    }
}
RefreshSessionService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RefreshSessionService, deps: [{ token: i1.FlowHelper }, { token: i2.FlowsDataService }, { token: i3.LoggerService }, { token: i4.SilentRenewService }, { token: i5.AuthStateService }, { token: i6.AuthWellKnownService }, { token: i7.RefreshSessionIframeService }, { token: i8.StoragePersistenceService }, { token: i9.RefreshSessionRefreshTokenService }, { token: i10.UserService }], target: i0.ɵɵFactoryTarget.Injectable });
RefreshSessionService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RefreshSessionService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RefreshSessionService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.FlowHelper }, { type: i2.FlowsDataService }, { type: i3.LoggerService }, { type: i4.SilentRenewService }, { type: i5.AuthStateService }, { type: i6.AuthWellKnownService }, { type: i7.RefreshSessionIframeService }, { type: i8.StoragePersistenceService }, { type: i9.RefreshSessionRefreshTokenService }, { type: i10.UserService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcmVzaC1zZXNzaW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9jYWxsYmFjay9yZWZyZXNoLXNlc3Npb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxRQUFRLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7Ozs7QUFlcEYsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO0FBRXBDLE1BQU0sT0FBTyxxQkFBcUI7SUFDaEMsWUFDbUIsVUFBc0IsRUFDdEIsZ0JBQWtDLEVBQ2xDLGFBQTRCLEVBQzVCLGtCQUFzQyxFQUN0QyxnQkFBa0MsRUFDbEMsb0JBQTBDLEVBQzFDLDJCQUF3RCxFQUN4RCx5QkFBb0QsRUFDcEQsaUNBQW9FLEVBQ3BFLFdBQXdCO1FBVHhCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxnQ0FBMkIsR0FBM0IsMkJBQTJCLENBQTZCO1FBQ3hELDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBMkI7UUFDcEQsc0NBQWlDLEdBQWpDLGlDQUFpQyxDQUFtQztRQUNw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b0JBQW9CLENBQUMsYUFBOEIsRUFBRSxNQUEyQjtRQUN0RixPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQ3ZCLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN4QixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFDN0IsTUFBTSxjQUFjLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUVqQyxJQUFJLENBQUMsQ0FBQyxLQUFLLFlBQVksWUFBWSxDQUFDLElBQUksY0FBYyxHQUFHLGtCQUFrQixFQUFFO2dCQUMzRSxPQUFPLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQzNDO1lBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLHlDQUF5QyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBRS9GLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV0RCxPQUFPLEtBQUssQ0FBQyxjQUFjLEdBQUcsZUFBZSxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7O2tIQXhJVSxxQkFBcUI7c0hBQXJCLHFCQUFxQixjQURSLE1BQU07MkZBQ25CLHFCQUFxQjtrQkFEakMsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGZvcmtKb2luLCBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciwgVGltZW91dEVycm9yLCB0aW1lciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAsIG1lcmdlTWFwLCByZXRyeVdoZW4sIHN3aXRjaE1hcCwgdGFrZSwgdGltZW91dCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQXV0aFN0YXRlU2VydmljZSB9IGZyb20gJy4uL2F1dGgtc3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aFdlbGxLbm93blNlcnZpY2UgfSBmcm9tICcuLi9jb25maWcvYXV0aC13ZWxsLWtub3duL2F1dGgtd2VsbC1rbm93bi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IENhbGxiYWNrQ29udGV4dCB9IGZyb20gJy4uL2Zsb3dzL2NhbGxiYWNrLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBGbG93c0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZmxvd3MvZmxvd3MtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVmcmVzaFNlc3Npb25JZnJhbWVTZXJ2aWNlIH0gZnJvbSAnLi4vaWZyYW1lL3JlZnJlc2gtc2Vzc2lvbi1pZnJhbWUuc2VydmljZSc7XHJcbmltcG9ydCB7IFNpbGVudFJlbmV3U2VydmljZSB9IGZyb20gJy4uL2lmcmFtZS9zaWxlbnQtcmVuZXcuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9naW5SZXNwb25zZSB9IGZyb20gJy4uL2xvZ2luL2xvZ2luLXJlc3BvbnNlJztcclxuaW1wb3J0IHsgU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4uL3N0b3JhZ2Uvc3RvcmFnZS1wZXJzaXN0ZW5jZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuLi91c2VyLWRhdGEvdXNlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmxvd0hlbHBlciB9IGZyb20gJy4uL3V0aWxzL2Zsb3dIZWxwZXIvZmxvdy1oZWxwZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFJlZnJlc2hTZXNzaW9uUmVmcmVzaFRva2VuU2VydmljZSB9IGZyb20gJy4vcmVmcmVzaC1zZXNzaW9uLXJlZnJlc2gtdG9rZW4uc2VydmljZSc7XHJcblxyXG5leHBvcnQgY29uc3QgTUFYX1JFVFJZX0FUVEVNUFRTID0gMztcclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFJlZnJlc2hTZXNzaW9uU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dIZWxwZXI6IEZsb3dIZWxwZXIsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNpbGVudFJlbmV3U2VydmljZTogU2lsZW50UmVuZXdTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhdXRoU3RhdGVTZXJ2aWNlOiBBdXRoU3RhdGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhdXRoV2VsbEtub3duU2VydmljZTogQXV0aFdlbGxLbm93blNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJlZnJlc2hTZXNzaW9uSWZyYW1lU2VydmljZTogUmVmcmVzaFNlc3Npb25JZnJhbWVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlOiBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSByZWZyZXNoU2Vzc2lvblJlZnJlc2hUb2tlblNlcnZpY2U6IFJlZnJlc2hTZXNzaW9uUmVmcmVzaFRva2VuU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlXHJcbiAgKSB7fVxyXG5cclxuICB1c2VyRm9yY2VSZWZyZXNoU2Vzc2lvbihcclxuICAgIGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIGFsbENvbmZpZ3M6IE9wZW5JZENvbmZpZ3VyYXRpb25bXSxcclxuICAgIGV4dHJhQ3VzdG9tUGFyYW1zPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH1cclxuICApOiBPYnNlcnZhYmxlPExvZ2luUmVzcG9uc2U+IHtcclxuICAgIHRoaXMucGVyc2lzdEN1c3RvbVBhcmFtcyhleHRyYUN1c3RvbVBhcmFtcywgY29uZmlnKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5mb3JjZVJlZnJlc2hTZXNzaW9uKGNvbmZpZywgYWxsQ29uZmlncywgZXh0cmFDdXN0b21QYXJhbXMpO1xyXG4gIH1cclxuXHJcbiAgZm9yY2VSZWZyZXNoU2Vzc2lvbihcclxuICAgIGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIGFsbENvbmZpZ3M6IE9wZW5JZENvbmZpZ3VyYXRpb25bXSxcclxuICAgIGV4dHJhQ3VzdG9tUGFyYW1zPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH1cclxuICApOiBPYnNlcnZhYmxlPExvZ2luUmVzcG9uc2U+IHtcclxuICAgIGNvbnN0IHsgY3VzdG9tUGFyYW1zUmVmcmVzaFRva2VuUmVxdWVzdCwgY29uZmlnSWQgfSA9IGNvbmZpZztcclxuICAgIGNvbnN0IG1lcmdlZFBhcmFtcyA9IHsgLi4uY3VzdG9tUGFyYW1zUmVmcmVzaFRva2VuUmVxdWVzdCwgLi4uZXh0cmFDdXN0b21QYXJhbXMgfTtcclxuXHJcbiAgICBpZiAodGhpcy5mbG93SGVscGVyLmlzQ3VycmVudEZsb3dDb2RlRmxvd1dpdGhSZWZyZXNoVG9rZW5zKGNvbmZpZykpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3RhcnRSZWZyZXNoU2Vzc2lvbihjb25maWcsIGFsbENvbmZpZ3MsIG1lcmdlZFBhcmFtcykucGlwZShcclxuICAgICAgICBtYXAoKCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgaXNBdXRoZW50aWNhdGVkID0gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmFyZUF1dGhTdG9yYWdlVG9rZW5zVmFsaWQoY29uZmlnKTtcclxuXHJcbiAgICAgICAgICBpZiAoaXNBdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgaWRUb2tlbjogdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmdldElkVG9rZW4oY29uZmlnKSxcclxuICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmdldEFjY2Vzc1Rva2VuKGNvbmZpZyksXHJcbiAgICAgICAgICAgICAgdXNlckRhdGE6IHRoaXMudXNlclNlcnZpY2UuZ2V0VXNlckRhdGFGcm9tU3RvcmUoY29uZmlnKSxcclxuICAgICAgICAgICAgICBpc0F1dGhlbnRpY2F0ZWQsXHJcbiAgICAgICAgICAgICAgY29uZmlnSWQsXHJcbiAgICAgICAgICAgIH0gYXMgTG9naW5SZXNwb25zZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgc2lsZW50UmVuZXdUaW1lb3V0SW5TZWNvbmRzIH0gPSBjb25maWc7XHJcbiAgICBjb25zdCB0aW1lT3V0VGltZSA9IHNpbGVudFJlbmV3VGltZW91dEluU2Vjb25kcyAqIDEwMDA7XHJcblxyXG4gICAgcmV0dXJuIGZvcmtKb2luKFtcclxuICAgICAgdGhpcy5zdGFydFJlZnJlc2hTZXNzaW9uKGNvbmZpZywgYWxsQ29uZmlncywgZXh0cmFDdXN0b21QYXJhbXMpLFxyXG4gICAgICB0aGlzLnNpbGVudFJlbmV3U2VydmljZS5yZWZyZXNoU2Vzc2lvbldpdGhJRnJhbWVDb21wbGV0ZWQkLnBpcGUodGFrZSgxKSksXHJcbiAgICBdKS5waXBlKFxyXG4gICAgICB0aW1lb3V0KHRpbWVPdXRUaW1lKSxcclxuICAgICAgcmV0cnlXaGVuKHRoaXMudGltZW91dFJldHJ5U3RyYXRlZ3kuYmluZCh0aGlzKSksXHJcbiAgICAgIG1hcCgoW18sIGNhbGxiYWNrQ29udGV4dF0pID0+IHtcclxuICAgICAgICBjb25zdCBpc0F1dGhlbnRpY2F0ZWQgPSB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuYXJlQXV0aFN0b3JhZ2VUb2tlbnNWYWxpZChjb25maWcpO1xyXG5cclxuICAgICAgICBpZiAoaXNBdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpZFRva2VuOiBjYWxsYmFja0NvbnRleHQ/LmF1dGhSZXN1bHQ/LmlkX3Rva2VuLFxyXG4gICAgICAgICAgICBhY2Nlc3NUb2tlbjogY2FsbGJhY2tDb250ZXh0Py5hdXRoUmVzdWx0Py5hY2Nlc3NfdG9rZW4sXHJcbiAgICAgICAgICAgIHVzZXJEYXRhOiB0aGlzLnVzZXJTZXJ2aWNlLmdldFVzZXJEYXRhRnJvbVN0b3JlKGNvbmZpZyksXHJcbiAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZCxcclxuICAgICAgICAgICAgY29uZmlnSWQsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwZXJzaXN0Q3VzdG9tUGFyYW1zKGV4dHJhQ3VzdG9tUGFyYW1zOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfSwgY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uKTogdm9pZCB7XHJcbiAgICBjb25zdCB7IHVzZVJlZnJlc2hUb2tlbiB9ID0gY29uZmlnO1xyXG5cclxuICAgIGlmIChleHRyYUN1c3RvbVBhcmFtcykge1xyXG4gICAgICBpZiAodXNlUmVmcmVzaFRva2VuKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLndyaXRlKCdzdG9yYWdlQ3VzdG9tUGFyYW1zUmVmcmVzaCcsIGV4dHJhQ3VzdG9tUGFyYW1zLCBjb25maWcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnc3RvcmFnZUN1c3RvbVBhcmFtc0F1dGhSZXF1ZXN0JywgZXh0cmFDdXN0b21QYXJhbXMsIGNvbmZpZyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhcnRSZWZyZXNoU2Vzc2lvbihcclxuICAgIGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIGFsbENvbmZpZ3M6IE9wZW5JZENvbmZpZ3VyYXRpb25bXSxcclxuICAgIGV4dHJhQ3VzdG9tUGFyYW1zPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH1cclxuICApOiBPYnNlcnZhYmxlPGJvb2xlYW4gfCBDYWxsYmFja0NvbnRleHQgfCBudWxsPiB7XHJcbiAgICBjb25zdCBpc1NpbGVudFJlbmV3UnVubmluZyA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5pc1NpbGVudFJlbmV3UnVubmluZyhjb25maWcpO1xyXG5cclxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWcsIGBDaGVja2luZzogc2lsZW50UmVuZXdSdW5uaW5nOiAke2lzU2lsZW50UmVuZXdSdW5uaW5nfWApO1xyXG4gICAgY29uc3Qgc2hvdWxkQmVFeGVjdXRlZCA9ICFpc1NpbGVudFJlbmV3UnVubmluZztcclxuXHJcbiAgICBpZiAoIXNob3VsZEJlRXhlY3V0ZWQpIHtcclxuICAgICAgcmV0dXJuIG9mKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmF1dGhXZWxsS25vd25TZXJ2aWNlLnF1ZXJ5QW5kU3RvcmVBdXRoV2VsbEtub3duRW5kUG9pbnRzKGNvbmZpZykucGlwZShcclxuICAgICAgc3dpdGNoTWFwKCgpID0+IHtcclxuICAgICAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2Uuc2V0U2lsZW50UmVuZXdSdW5uaW5nKGNvbmZpZyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmZsb3dIZWxwZXIuaXNDdXJyZW50Rmxvd0NvZGVGbG93V2l0aFJlZnJlc2hUb2tlbnMoY29uZmlnKSkge1xyXG4gICAgICAgICAgLy8gUmVmcmVzaCBTZXNzaW9uIHVzaW5nIFJlZnJlc2ggdG9rZW5zXHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZWZyZXNoU2Vzc2lvblJlZnJlc2hUb2tlblNlcnZpY2UucmVmcmVzaFNlc3Npb25XaXRoUmVmcmVzaFRva2Vucyhjb25maWcsIGFsbENvbmZpZ3MsIGV4dHJhQ3VzdG9tUGFyYW1zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlZnJlc2hTZXNzaW9uSWZyYW1lU2VydmljZS5yZWZyZXNoU2Vzc2lvbldpdGhJZnJhbWUoY29uZmlnLCBhbGxDb25maWdzLCBleHRyYUN1c3RvbVBhcmFtcyk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0aW1lb3V0UmV0cnlTdHJhdGVneShlcnJvckF0dGVtcHRzOiBPYnNlcnZhYmxlPGFueT4sIGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbik6IE9ic2VydmFibGU8bnVtYmVyPiB7XHJcbiAgICByZXR1cm4gZXJyb3JBdHRlbXB0cy5waXBlKFxyXG4gICAgICBtZXJnZU1hcCgoZXJyb3IsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2NhbGluZ0R1cmF0aW9uID0gMTAwMDtcclxuICAgICAgICBjb25zdCBjdXJyZW50QXR0ZW1wdCA9IGluZGV4ICsgMTtcclxuXHJcbiAgICAgICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBUaW1lb3V0RXJyb3IpIHx8IGN1cnJlbnRBdHRlbXB0ID4gTUFYX1JFVFJZX0FUVEVNUFRTKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcigoKSA9PiBuZXcgRXJyb3IoZXJyb3IpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWcsIGBmb3JjZVJlZnJlc2hTZXNzaW9uIHRpbWVvdXQuIEF0dGVtcHQgIyR7Y3VycmVudEF0dGVtcHR9YCk7XHJcblxyXG4gICAgICAgIHRoaXMuZmxvd3NEYXRhU2VydmljZS5yZXNldFNpbGVudFJlbmV3UnVubmluZyhjb25maWcpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGltZXIoY3VycmVudEF0dGVtcHQgKiBzY2FsaW5nRHVyYXRpb24pO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19