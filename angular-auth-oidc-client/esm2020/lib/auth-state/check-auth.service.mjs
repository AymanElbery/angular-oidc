import { Injectable } from '@angular/core';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { EventTypes } from '../public-events/event-types';
import * as i0 from "@angular/core";
import * as i1 from "../iframe/check-session.service";
import * as i2 from "../utils/url/current-url.service";
import * as i3 from "../iframe/silent-renew.service";
import * as i4 from "../user-data/user.service";
import * as i5 from "../logging/logger.service";
import * as i6 from "../auth-state/auth-state.service";
import * as i7 from "../callback/callback.service";
import * as i8 from "../callback/refresh-session.service";
import * as i9 from "../callback/periodically-token-check.service";
import * as i10 from "../login/popup/popup.service";
import * as i11 from "../auto-login/auto-login.service";
import * as i12 from "../storage/storage-persistence.service";
import * as i13 from "../public-events/public-events.service";
export class CheckAuthService {
    constructor(checkSessionService, currentUrlService, silentRenewService, userService, loggerService, authStateService, callbackService, refreshSessionService, periodicallyTokenCheckService, popupService, autoLoginService, storagePersistenceService, publicEventsService) {
        this.checkSessionService = checkSessionService;
        this.currentUrlService = currentUrlService;
        this.silentRenewService = silentRenewService;
        this.userService = userService;
        this.loggerService = loggerService;
        this.authStateService = authStateService;
        this.callbackService = callbackService;
        this.refreshSessionService = refreshSessionService;
        this.periodicallyTokenCheckService = periodicallyTokenCheckService;
        this.popupService = popupService;
        this.autoLoginService = autoLoginService;
        this.storagePersistenceService = storagePersistenceService;
        this.publicEventsService = publicEventsService;
    }
    checkAuth(configuration, allConfigs, url) {
        this.publicEventsService.fireEvent(EventTypes.CheckingAuth);
        const stateParamFromUrl = this.currentUrlService.getStateParamFromCurrentUrl(url);
        if (!!stateParamFromUrl) {
            configuration = this.getConfigurationWithUrlState([configuration], stateParamFromUrl);
            if (!configuration) {
                return throwError(() => new Error(`could not find matching config for state ${stateParamFromUrl}`));
            }
        }
        return this.checkAuthWithConfig(configuration, allConfigs, url);
    }
    checkAuthMultiple(allConfigs, url) {
        const stateParamFromUrl = this.currentUrlService.getStateParamFromCurrentUrl(url);
        if (stateParamFromUrl) {
            const config = this.getConfigurationWithUrlState(allConfigs, stateParamFromUrl);
            if (!config) {
                return throwError(() => new Error(`could not find matching config for state ${stateParamFromUrl}`));
            }
            return this.composeMultipleLoginResults(allConfigs, config, url);
        }
        const configs = allConfigs;
        const allChecks$ = configs.map((x) => this.checkAuthWithConfig(x, configs, url));
        return forkJoin(allChecks$);
    }
    checkAuthIncludingServer(configuration, allConfigs) {
        return this.checkAuthWithConfig(configuration, allConfigs).pipe(switchMap((loginResponse) => {
            const { isAuthenticated } = loginResponse;
            if (isAuthenticated) {
                return of(loginResponse);
            }
            return this.refreshSessionService.forceRefreshSession(configuration, allConfigs).pipe(tap((loginResponseAfterRefreshSession) => {
                if (loginResponseAfterRefreshSession?.isAuthenticated) {
                    this.startCheckSessionAndValidation(configuration, allConfigs);
                }
            }));
        }));
    }
    checkAuthWithConfig(config, allConfigs, url) {
        if (!config) {
            const errorMessage = 'Please provide at least one configuration before setting up the module';
            this.loggerService.logError(config, errorMessage);
            return of({ isAuthenticated: false, errorMessage, userData: null, idToken: null, accessToken: null, configId: null });
        }
        const currentUrl = url || this.currentUrlService.getCurrentUrl();
        const { configId, authority } = config;
        this.loggerService.logDebug(config, `Working with config '${configId}' using ${authority}`);
        if (this.popupService.currentWindowIsPopUp()) {
            this.popupService.sendMessageToMainWindow(currentUrl);
            return of(null);
        }
        const isCallback = this.callbackService.isCallback(currentUrl);
        this.loggerService.logDebug(config, 'currentUrl to check auth with: ', currentUrl);
        const callback$ = isCallback ? this.callbackService.handleCallbackAndFireEvents(currentUrl, config, allConfigs) : of(null);
        return callback$.pipe(map(() => {
            const isAuthenticated = this.authStateService.areAuthStorageTokensValid(config);
            if (isAuthenticated) {
                this.startCheckSessionAndValidation(config, allConfigs);
                if (!isCallback) {
                    this.authStateService.setAuthenticatedAndFireEvent(allConfigs);
                    this.userService.publishUserDataIfExists(config, allConfigs);
                }
            }
            this.loggerService.logDebug(config, 'checkAuth completed - firing events now. isAuthenticated: ' + isAuthenticated);
            return {
                isAuthenticated,
                userData: this.userService.getUserDataFromStore(config),
                accessToken: this.authStateService.getAccessToken(config),
                idToken: this.authStateService.getIdToken(config),
                configId,
            };
        }), tap(({ isAuthenticated }) => {
            this.publicEventsService.fireEvent(EventTypes.CheckingAuthFinished);
            if (isAuthenticated) {
                this.autoLoginService.checkSavedRedirectRouteAndNavigate(config);
            }
        }), catchError(({ message }) => {
            this.loggerService.logError(config, message);
            this.publicEventsService.fireEvent(EventTypes.CheckingAuthFinishedWithError, message);
            return of({ isAuthenticated: false, errorMessage: message, userData: null, idToken: null, accessToken: null, configId });
        }));
    }
    startCheckSessionAndValidation(config, allConfigs) {
        if (this.checkSessionService.isCheckSessionConfigured(config)) {
            this.checkSessionService.start(config);
        }
        this.periodicallyTokenCheckService.startTokenValidationPeriodically(allConfigs, config);
        if (this.silentRenewService.isSilentRenewConfigured(config)) {
            this.silentRenewService.getOrCreateIframe(config);
        }
    }
    getConfigurationWithUrlState(configurations, stateFromUrl) {
        for (const config of configurations) {
            const storedState = this.storagePersistenceService.read('authStateControl', config);
            if (storedState === stateFromUrl) {
                return config;
            }
        }
        return null;
    }
    composeMultipleLoginResults(configurations, activeConfig, url) {
        const allOtherConfigs = configurations.filter((x) => x.configId !== activeConfig.configId);
        const currentConfigResult = this.checkAuthWithConfig(activeConfig, configurations, url);
        const allOtherConfigResults = allOtherConfigs.map((config) => {
            const { redirectUrl } = config;
            return this.checkAuthWithConfig(config, configurations, redirectUrl);
        });
        return forkJoin([currentConfigResult, ...allOtherConfigResults]);
    }
}
CheckAuthService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CheckAuthService, deps: [{ token: i1.CheckSessionService }, { token: i2.CurrentUrlService }, { token: i3.SilentRenewService }, { token: i4.UserService }, { token: i5.LoggerService }, { token: i6.AuthStateService }, { token: i7.CallbackService }, { token: i8.RefreshSessionService }, { token: i9.PeriodicallyTokenCheckService }, { token: i10.PopUpService }, { token: i11.AutoLoginService }, { token: i12.StoragePersistenceService }, { token: i13.PublicEventsService }], target: i0.ɵɵFactoryTarget.Injectable });
CheckAuthService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CheckAuthService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CheckAuthService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CheckSessionService }, { type: i2.CurrentUrlService }, { type: i3.SilentRenewService }, { type: i4.UserService }, { type: i5.LoggerService }, { type: i6.AuthStateService }, { type: i7.CallbackService }, { type: i8.RefreshSessionService }, { type: i9.PeriodicallyTokenCheckService }, { type: i10.PopUpService }, { type: i11.AutoLoginService }, { type: i12.StoragePersistenceService }, { type: i13.PublicEventsService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy9saWIvYXV0aC1zdGF0ZS9jaGVjay1hdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsUUFBUSxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBWWpFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FBTzFELE1BQU0sT0FBTyxnQkFBZ0I7SUFDM0IsWUFDbUIsbUJBQXdDLEVBQ3hDLGlCQUFvQyxFQUNwQyxrQkFBc0MsRUFDdEMsV0FBd0IsRUFDeEIsYUFBNEIsRUFDNUIsZ0JBQWtDLEVBQ2xDLGVBQWdDLEVBQ2hDLHFCQUE0QyxFQUM1Qyw2QkFBNEQsRUFDNUQsWUFBMEIsRUFDMUIsZ0JBQWtDLEVBQ2xDLHlCQUFvRCxFQUNwRCxtQkFBd0M7UUFaeEMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQ3BDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1QyxrQ0FBNkIsR0FBN0IsNkJBQTZCLENBQStCO1FBQzVELGlCQUFZLEdB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aUMsRUFDakMsR0FBWTtRQUVaLE1BQU0sZUFBZSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTNGLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFeEYsTUFBTSxxQkFBcUIsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDM0QsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sQ0FBQztZQUUvQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZFLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxRQUFRLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLHFCQUFxQixDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDOzs2R0FqTFUsZ0JBQWdCO2lIQUFoQixnQkFBZ0I7MkZBQWhCLGdCQUFnQjtrQkFENUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZm9ya0pvaW4sIE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1hcCwgc3dpdGNoTWFwLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IEF1dGhTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi9hdXRoLXN0YXRlL2F1dGgtc3RhdGUuc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dG9Mb2dpblNlcnZpY2UgfSBmcm9tICcuLi9hdXRvLWxvZ2luL2F1dG8tbG9naW4uc2VydmljZSc7XHJcbmltcG9ydCB7IENhbGxiYWNrU2VydmljZSB9IGZyb20gJy4uL2NhbGxiYWNrL2NhbGxiYWNrLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQZXJpb2RpY2FsbHlUb2tlbkNoZWNrU2VydmljZSB9IGZyb20gJy4uL2NhbGxiYWNrL3BlcmlvZGljYWxseS10b2tlbi1jaGVjay5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVmcmVzaFNlc3Npb25TZXJ2aWNlIH0gZnJvbSAnLi4vY2FsbGJhY2svcmVmcmVzaC1zZXNzaW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vY29uZmlnL29wZW5pZC1jb25maWd1cmF0aW9uJztcclxuaW1wb3J0IHsgQ2hlY2tTZXNzaW9uU2VydmljZSB9IGZyb20gJy4uL2lmcmFtZS9jaGVjay1zZXNzaW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTaWxlbnRSZW5ld1NlcnZpY2UgfSBmcm9tICcuLi9pZnJhbWUvc2lsZW50LXJlbmV3LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2luUmVzcG9uc2UgfSBmcm9tICcuLi9sb2dpbi9sb2dpbi1yZXNwb25zZSc7XHJcbmltcG9ydCB7IFBvcFVwU2VydmljZSB9IGZyb20gJy4uL2xvZ2luL3BvcHVwL3BvcHVwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFdmVudFR5cGVzIH0gZnJvbSAnLi4vcHVibGljLWV2ZW50cy9ldmVudC10eXBlcyc7XHJcbmltcG9ydCB7IFB1YmxpY0V2ZW50c1NlcnZpY2UgfSBmcm9tICcuLi9wdWJsaWMtZXZlbnRzL3B1YmxpYy1ldmVudHMuc2VydmljZSc7XHJcbmltcG9ydCB7IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UgfSBmcm9tICcuLi9zdG9yYWdlL3N0b3JhZ2UtcGVyc2lzdGVuY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vdXNlci1kYXRhL3VzZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEN1cnJlbnRVcmxTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbHMvdXJsL2N1cnJlbnQtdXJsLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2hlY2tBdXRoU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNoZWNrU2Vzc2lvblNlcnZpY2U6IENoZWNrU2Vzc2lvblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGN1cnJlbnRVcmxTZXJ2aWNlOiBDdXJyZW50VXJsU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2lsZW50UmVuZXdTZXJ2aWNlOiBTaWxlbnRSZW5ld1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXV0aFN0YXRlU2VydmljZTogQXV0aFN0YXRlU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2FsbGJhY2tTZXJ2aWNlOiBDYWxsYmFja1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJlZnJlc2hTZXNzaW9uU2VydmljZTogUmVmcmVzaFNlc3Npb25TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBwZXJpb2RpY2FsbHlUb2tlbkNoZWNrU2VydmljZTogUGVyaW9kaWNhbGx5VG9rZW5DaGVja1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBvcHVwU2VydmljZTogUG9wVXBTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhdXRvTG9naW5TZXJ2aWNlOiBBdXRvTG9naW5TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlOiBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBwdWJsaWNFdmVudHNTZXJ2aWNlOiBQdWJsaWNFdmVudHNTZXJ2aWNlXHJcbiAgKSB7fVxyXG5cclxuICBjaGVja0F1dGgoY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbiwgYWxsQ29uZmlnczogT3BlbklkQ29uZmlndXJhdGlvbltdLCB1cmw/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPExvZ2luUmVzcG9uc2U+IHtcclxuICAgIHRoaXMucHVibGljRXZlbnRzU2VydmljZS5maXJlRXZlbnQoRXZlbnRUeXBlcy5DaGVja2luZ0F1dGgpO1xyXG5cclxuICAgIGNvbnN0IHN0YXRlUGFyYW1Gcm9tVXJsID0gdGhpcy5jdXJyZW50VXJsU2VydmljZS5nZXRTdGF0ZVBhcmFtRnJvbUN1cnJlbnRVcmwodXJsKTtcclxuXHJcbiAgICBpZiAoISFzdGF0ZVBhcmFtRnJvbVVybCkge1xyXG4gICAgICBjb25maWd1cmF0aW9uID0gdGhpcy5nZXRDb25maWd1cmF0aW9uV2l0aFVybFN0YXRlKFtjb25maWd1cmF0aW9uXSwgc3RhdGVQYXJhbUZyb21VcmwpO1xyXG5cclxuICAgICAgaWYgKCFjb25maWd1cmF0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKGBjb3VsZCBub3QgZmluZCBtYXRjaGluZyBjb25maWcgZm9yIHN0YXRlICR7c3RhdGVQYXJhbUZyb21Vcmx9YCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuY2hlY2tBdXRoV2l0aENvbmZpZyhjb25maWd1cmF0aW9uLCBhbGxDb25maWdzLCB1cmwpO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tBdXRoTXVsdGlwbGUoYWxsQ29uZmlnczogT3BlbklkQ29uZmlndXJhdGlvbltdLCB1cmw/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPExvZ2luUmVzcG9uc2VbXT4ge1xyXG4gICAgY29uc3Qgc3RhdGVQYXJhbUZyb21VcmwgPSB0aGlzLmN1cnJlbnRVcmxTZXJ2aWNlLmdldFN0YXRlUGFyYW1Gcm9tQ3VycmVudFVybCh1cmwpO1xyXG5cclxuICAgIGlmIChzdGF0ZVBhcmFtRnJvbVVybCkge1xyXG4gICAgICBjb25zdCBjb25maWcgPSB0aGlzLmdldENvbmZpZ3VyYXRpb25XaXRoVXJsU3RhdGUoYWxsQ29uZmlncywgc3RhdGVQYXJhbUZyb21VcmwpO1xyXG5cclxuICAgICAgaWYgKCFjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcigoKSA9PiBuZXcgRXJyb3IoYGNvdWxkIG5vdCBmaW5kIG1hdGNoaW5nIGNvbmZpZyBmb3Igc3RhdGUgJHtzdGF0ZVBhcmFtRnJvbVVybH1gKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmNvbXBvc2VNdWx0aXBsZUxvZ2luUmVzdWx0cyhhbGxDb25maWdzLCBjb25maWcsIHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY29uZmlncyA9IGFsbENvbmZpZ3M7XHJcbiAgICBjb25zdCBhbGxDaGVja3MkID0gY29uZmlncy5tYXAoKHgpID0+IHRoaXMuY2hlY2tBdXRoV2l0aENvbmZpZyh4LCBjb25maWdzLCB1cmwpKTtcclxuXHJcbiAgICByZXR1cm4gZm9ya0pvaW4oYWxsQ2hlY2tzJCk7XHJcbiAgfVxyXG5cclxuICBjaGVja0F1dGhJbmNsdWRpbmdTZXJ2ZXIoY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbiwgYWxsQ29uZmlnczogT3BlbklkQ29uZmlndXJhdGlvbltdKTogT2JzZXJ2YWJsZTxMb2dpblJlc3BvbnNlPiB7XHJcbiAgICByZXR1cm4gdGhpcy5jaGVja0F1dGhXaXRoQ29uZmlnKGNvbmZpZ3VyYXRpb24sIGFsbENvbmZpZ3MpLnBpcGUoXHJcbiAgICAgIHN3aXRjaE1hcCgobG9naW5SZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgaXNBdXRoZW50aWNhdGVkIH0gPSBsb2dpblJlc3BvbnNlO1xyXG5cclxuICAgICAgICBpZiAoaXNBdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgICAgICByZXR1cm4gb2YobG9naW5SZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZWZyZXNoU2Vzc2lvblNlcnZpY2UuZm9yY2VSZWZyZXNoU2Vzc2lvbihjb25maWd1cmF0aW9uLCBhbGxDb25maWdzKS5waXBlKFxyXG4gICAgICAgICAgdGFwKChsb2dpblJlc3BvbnNlQWZ0ZXJSZWZyZXNoU2Vzc2lvbikgPT4ge1xyXG4gICAgICAgICAgICBpZiAobG9naW5SZXNwb25zZUFmdGVyUmVmcmVzaFNlc3Npb24/LmlzQXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuc3RhcnRDaGVja1Nlc3Npb25BbmRWYWxpZGF0aW9uKGNvbmZpZ3VyYXRpb24sIGFsbENvbmZpZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0F1dGhXaXRoQ29uZmlnKGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbiwgYWxsQ29uZmlnczogT3BlbklkQ29uZmlndXJhdGlvbltdLCB1cmw/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPExvZ2luUmVzcG9uc2U+IHtcclxuICAgIGlmICghY29uZmlnKSB7XHJcbiAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9ICdQbGVhc2UgcHJvdmlkZSBhdCBsZWFzdCBvbmUgY29uZmlndXJhdGlvbiBiZWZvcmUgc2V0dGluZyB1cCB0aGUgbW9kdWxlJztcclxuXHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWcsIGVycm9yTWVzc2FnZSk7XHJcblxyXG4gICAgICByZXR1cm4gb2YoeyBpc0F1dGhlbnRpY2F0ZWQ6IGZhbHNlLCBlcnJvck1lc3NhZ2UsIHVzZXJEYXRhOiBudWxsLCBpZFRva2VuOiBudWxsLCBhY2Nlc3NUb2tlbjogbnVsbCwgY29uZmlnSWQ6IG51bGwgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3VycmVudFVybCA9IHVybCB8fCB0aGlzLmN1cnJlbnRVcmxTZXJ2aWNlLmdldEN1cnJlbnRVcmwoKTtcclxuICAgIGNvbnN0IHsgY29uZmlnSWQsIGF1dGhvcml0eSB9ID0gY29uZmlnO1xyXG5cclxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWcsIGBXb3JraW5nIHdpdGggY29uZmlnICcke2NvbmZpZ0lkfScgdXNpbmcgJHthdXRob3JpdHl9YCk7XHJcblxyXG4gICAgaWYgKHRoaXMucG9wdXBTZXJ2aWNlLmN1cnJlbnRXaW5kb3dJc1BvcFVwKCkpIHtcclxuICAgICAgdGhpcy5wb3B1cFNlcnZpY2Uuc2VuZE1lc3NhZ2VUb01haW5XaW5kb3coY3VycmVudFVybCk7XHJcblxyXG4gICAgICByZXR1cm4gb2YobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaXNDYWxsYmFjayA9IHRoaXMuY2FsbGJhY2tTZXJ2aWNlLmlzQ2FsbGJhY2soY3VycmVudFVybCk7XHJcblxyXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZywgJ2N1cnJlbnRVcmwgdG8gY2hlY2sgYXV0aCB3aXRoOiAnLCBjdXJyZW50VXJsKTtcclxuXHJcbiAgICBjb25zdCBjYWxsYmFjayQgPSBpc0NhbGxiYWNrID8gdGhpcy5jYWxsYmFja1NlcnZpY2UuaGFuZGxlQ2FsbGJhY2tBbmRGaXJlRXZlbnRzKGN1cnJlbnRVcmwsIGNvbmZpZywgYWxsQ29uZmlncykgOiBvZihudWxsKTtcclxuXHJcbiAgICByZXR1cm4gY2FsbGJhY2skLnBpcGUoXHJcbiAgICAgIG1hcCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNBdXRoZW50aWNhdGVkID0gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmFyZUF1dGhTdG9yYWdlVG9rZW5zVmFsaWQoY29uZmlnKTtcclxuXHJcbiAgICAgICAgaWYgKGlzQXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgdGhpcy5zdGFydENoZWNrU2Vzc2lvbkFuZFZhbGlkYXRpb24oY29uZmlnLCBhbGxDb25maWdzKTtcclxuXHJcbiAgICAgICAgICBpZiAoIWlzQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLnNldEF1dGhlbnRpY2F0ZWRBbmRGaXJlRXZlbnQoYWxsQ29uZmlncyk7XHJcbiAgICAgICAgICAgIHRoaXMudXNlclNlcnZpY2UucHVibGlzaFVzZXJEYXRhSWZFeGlzdHMoY29uZmlnLCBhbGxDb25maWdzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWcsICdjaGVja0F1dGggY29tcGxldGVkIC0gZmlyaW5nIGV2ZW50cyBub3cuIGlzQXV0aGVudGljYXRlZDogJyArIGlzQXV0aGVudGljYXRlZCk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBpc0F1dGhlbnRpY2F0ZWQsXHJcbiAgICAgICAgICB1c2VyRGF0YTogdGhpcy51c2VyU2VydmljZS5nZXRVc2VyRGF0YUZyb21TdG9yZShjb25maWcpLFxyXG4gICAgICAgICAgYWNjZXNzVG9rZW46IHRoaXMuYXV0aFN0YXRlU2VydmljZS5nZXRBY2Nlc3NUb2tlbihjb25maWcpLFxyXG4gICAgICAgICAgaWRUb2tlbjogdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmdldElkVG9rZW4oY29uZmlnKSxcclxuICAgICAgICAgIGNvbmZpZ0lkLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0pLFxyXG4gICAgICB0YXAoKHsgaXNBdXRoZW50aWNhdGVkIH0pID0+IHtcclxuICAgICAgICB0aGlzLnB1YmxpY0V2ZW50c1NlcnZpY2UuZmlyZUV2ZW50KEV2ZW50VHlwZXMuQ2hlY2tpbmdBdXRoRmluaXNoZWQpO1xyXG5cclxuICAgICAgICBpZiAoaXNBdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgICAgICB0aGlzLmF1dG9Mb2dpblNlcnZpY2UuY2hlY2tTYXZlZFJlZGlyZWN0Um91dGVBbmROYXZpZ2F0ZShjb25maWcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSksXHJcbiAgICAgIGNhdGNoRXJyb3IoKHsgbWVzc2FnZSB9KSA9PiB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGNvbmZpZywgbWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5wdWJsaWNFdmVudHNTZXJ2aWNlLmZpcmVFdmVudChFdmVudFR5cGVzLkNoZWNraW5nQXV0aEZpbmlzaGVkV2l0aEVycm9yLCBtZXNzYWdlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9mKHsgaXNBdXRoZW50aWNhdGVkOiBmYWxzZSwgZXJyb3JNZXNzYWdlOiBtZXNzYWdlLCB1c2VyRGF0YTogbnVsbCwgaWRUb2tlbjogbnVsbCwgYWNjZXNzVG9rZW46IG51bGwsIGNvbmZpZ0lkIH0pO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhcnRDaGVja1Nlc3Npb25BbmRWYWxpZGF0aW9uKGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbiwgYWxsQ29uZmlnczogT3BlbklkQ29uZmlndXJhdGlvbltdKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5jaGVja1Nlc3Npb25TZXJ2aWNlLmlzQ2hlY2tTZXNzaW9uQ29uZmlndXJlZChjb25maWcpKSB7XHJcbiAgICAgIHRoaXMuY2hlY2tTZXNzaW9uU2VydmljZS5zdGFydChjb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucGVyaW9kaWNhbGx5VG9rZW5DaGVja1NlcnZpY2Uuc3RhcnRUb2tlblZhbGlkYXRpb25QZXJpb2RpY2FsbHkoYWxsQ29uZmlncywgY29uZmlnKTtcclxuXHJcbiAgICBpZiAodGhpcy5zaWxlbnRSZW5ld1NlcnZpY2UuaXNTaWxlbnRSZW5ld0NvbmZpZ3VyZWQoY29uZmlnKSkge1xyXG4gICAgICB0aGlzLnNpbGVudFJlbmV3U2VydmljZS5nZXRPckNyZWF0ZUlmcmFtZShjb25maWcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRDb25maWd1cmF0aW9uV2l0aFVybFN0YXRlKGNvbmZpZ3VyYXRpb25zOiBPcGVuSWRDb25maWd1cmF0aW9uW10sIHN0YXRlRnJvbVVybDogc3RyaW5nKTogT3BlbklkQ29uZmlndXJhdGlvbiB7XHJcbiAgICBmb3IgKGNvbnN0IGNvbmZpZyBvZiBjb25maWd1cmF0aW9ucykge1xyXG4gICAgICBjb25zdCBzdG9yZWRTdGF0ZSA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoU3RhdGVDb250cm9sJywgY29uZmlnKTtcclxuXHJcbiAgICAgIGlmIChzdG9yZWRTdGF0ZSA9PT0gc3RhdGVGcm9tVXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb21wb3NlTXVsdGlwbGVMb2dpblJlc3VsdHMoXHJcbiAgICBjb25maWd1cmF0aW9uczogT3BlbklkQ29uZmlndXJhdGlvbltdLFxyXG4gICAgYWN0aXZlQ29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uLFxyXG4gICAgdXJsPzogc3RyaW5nXHJcbiAgKTogT2JzZXJ2YWJsZTxMb2dpblJlc3BvbnNlW10+IHtcclxuICAgIGNvbnN0IGFsbE90aGVyQ29uZmlncyA9IGNvbmZpZ3VyYXRpb25zLmZpbHRlcigoeCkgPT4geC5jb25maWdJZCAhPT0gYWN0aXZlQ29uZmlnLmNvbmZpZ0lkKTtcclxuXHJcbiAgICBjb25zdCBjdXJyZW50Q29uZmlnUmVzdWx0ID0gdGhpcy5jaGVja0F1dGhXaXRoQ29uZmlnKGFjdGl2ZUNvbmZpZywgY29uZmlndXJhdGlvbnMsIHVybCk7XHJcblxyXG4gICAgY29uc3QgYWxsT3RoZXJDb25maWdSZXN1bHRzID0gYWxsT3RoZXJDb25maWdzLm1hcCgoY29uZmlnKSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgcmVkaXJlY3RVcmwgfSA9IGNvbmZpZztcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmNoZWNrQXV0aFdpdGhDb25maWcoY29uZmlnLCBjb25maWd1cmF0aW9ucywgcmVkaXJlY3RVcmwpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGZvcmtKb2luKFtjdXJyZW50Q29uZmlnUmVzdWx0LCAuLi5hbGxPdGhlckNvbmZpZ1Jlc3VsdHNdKTtcclxuICB9XHJcbn1cclxuIl19