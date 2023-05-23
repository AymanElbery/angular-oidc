import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../response-type-validation/response-type-validation.service";
import * as i3 from "../../utils/url/url.service";
import * as i4 from "../../utils/redirect/redirect.service";
import * as i5 from "../../config/auth-well-known/auth-well-known.service";
import * as i6 from "../popup/popup.service";
import * as i7 from "../../auth-state/check-auth.service";
import * as i8 from "./par.service";
export class ParLoginService {
    constructor(loggerService, responseTypeValidationService, urlService, redirectService, authWellKnownService, popupService, checkAuthService, parService) {
        this.loggerService = loggerService;
        this.responseTypeValidationService = responseTypeValidationService;
        this.urlService = urlService;
        this.redirectService = redirectService;
        this.authWellKnownService = authWellKnownService;
        this.popupService = popupService;
        this.checkAuthService = checkAuthService;
        this.parService = parService;
    }
    loginPar(configuration, authOptions) {
        if (!this.responseTypeValidationService.hasConfigValidResponseType(configuration)) {
            this.loggerService.logError(configuration, 'Invalid response type!');
            return;
        }
        this.loggerService.logDebug(configuration, 'BEGIN Authorize OIDC Flow, no auth data');
        const { urlHandler, customParams } = authOptions || {};
        this.authWellKnownService
            .queryAndStoreAuthWellKnownEndPoints(configuration)
            .pipe(switchMap(() => this.parService.postParRequest(configuration, customParams)))
            .subscribe((response) => {
            this.loggerService.logDebug(configuration, 'par response: ', response);
            const url = this.urlService.getAuthorizeParUrl(response.requestUri, configuration);
            this.loggerService.logDebug(configuration, 'par request url: ', url);
            if (!url) {
                this.loggerService.logError(configuration, `Could not create URL with param ${response.requestUri}: '${url}'`);
                return;
            }
            if (urlHandler) {
                urlHandler(url);
            }
            else {
                this.redirectService.redirectTo(url);
            }
        });
    }
    loginWithPopUpPar(configuration, allConfigs, authOptions, popupOptions) {
        const { configId } = configuration;
        if (!this.responseTypeValidationService.hasConfigValidResponseType(configuration)) {
            const errorMessage = 'Invalid response type!';
            this.loggerService.logError(configuration, errorMessage);
            return throwError(() => new Error(errorMessage));
        }
        this.loggerService.logDebug(configuration, 'BEGIN Authorize OIDC Flow with popup, no auth data');
        const { customParams } = authOptions || {};
        return this.authWellKnownService.queryAndStoreAuthWellKnownEndPoints(configuration).pipe(switchMap(() => this.parService.postParRequest(configuration, customParams)), switchMap((response) => {
            this.loggerService.logDebug(configuration, 'par response: ', response);
            const url = this.urlService.getAuthorizeParUrl(response.requestUri, configuration);
            this.loggerService.logDebug(configuration, 'par request url: ', url);
            if (!url) {
                const errorMessage = `Could not create URL with param ${response.requestUri}: 'url'`;
                this.loggerService.logError(configuration, errorMessage);
                return throwError(() => new Error(errorMessage));
            }
            this.popupService.openPopUp(url, popupOptions, configuration);
            return this.popupService.result$.pipe(take(1), switchMap((result) => {
                const { userClosed, receivedUrl } = result;
                if (userClosed) {
                    return of({
                        isAuthenticated: false,
                        errorMessage: 'User closed popup',
                        userData: null,
                        idToken: null,
                        accessToken: null,
                        configId,
                    });
                }
                return this.checkAuthService.checkAuth(configuration, allConfigs, receivedUrl);
            }));
        }));
    }
}
ParLoginService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ParLoginService, deps: [{ token: i1.LoggerService }, { token: i2.ResponseTypeValidationService }, { token: i3.UrlService }, { token: i4.RedirectService }, { token: i5.AuthWellKnownService }, { token: i6.PopUpService }, { token: i7.CheckAuthService }, { token: i8.ParService }], target: i0.ɵɵFactoryTarget.Injectable });
ParLoginService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ParLoginService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ParLoginService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LoggerService }, { type: i2.ResponseTypeValidationService }, { type: i3.UrlService }, { type: i4.RedirectService }, { type: i5.AuthWellKnownService }, { type: i6.PopUpService }, { type: i7.CheckAuthService }, { type: i8.ParService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyLWxvZ2luLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9sb2dpbi9wYXIvcGFyLWxvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7O0FBaUJqRCxNQUFNLE9BQU8sZUFBZTtJQUMxQixZQUNtQixhQUE0QixFQUM1Qiw2QkFBNEQsRUFDNUQsVUFBc0IsRUFDdEIsZUFBZ0MsRUFDaEMsb0JBQTBDLEVBQzFDLFlBQTBCLEVBQzFCLGdCQUFrQyxFQUNsQyxVQUFzQjtRQVB0QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixrQ0FBNkIsR0FBN0IsNkJBQTZCLENBQStCO1FBQzVELGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxlQUFVLEdBQVYsVUFBVSxDQUFZO0lBQ3RDLENBQUM7SUFFSixRQUFRLENBQUMsYUFBa0MsRUFBRSxXQUF5QjtRQUNwRSxJQUFJLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLDBCQUEwQixDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ2pGLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBRXJFLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxh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QyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBRXpELE9BQU8sVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7YUFDbEQ7WUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRTlELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUNuQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQ1AsU0FBUyxDQUFDLENBQUMsTUFBOEIsRUFBRSxFQUFFO2dCQUMzQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sQ0FBQztnQkFFM0MsSUFBSSxVQUFVLEVBQUU7b0JBQ2QsT0FBTyxFQUFFLENBQUM7d0JBQ1IsZUFBZSxFQUFFLEtBQUs7d0JBQ3RCLFlBQVksRUFBRSxtQkFBbUI7d0JBQ2pDLFFBQVEsRUFBRSxJQUFJO3dCQUNkLE9BQU8sRUFBRSxJQUFJO3dCQUNiLFdBQVcsRUFBRSxJQUFJO3dCQUNqQixRQUFRO3FCQUNULENBQUMsQ0FBQztpQkFDSjtnQkFFRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUNqRixDQUFDLENBQUMsQ0FDSCxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7OzRHQTNHVSxlQUFlO2dIQUFmLGVBQWU7MkZBQWYsZUFBZTtrQkFEM0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgc3dpdGNoTWFwLCB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBBdXRoT3B0aW9ucyB9IGZyb20gJy4uLy4uL2F1dGgtb3B0aW9ucyc7XHJcbmltcG9ydCB7IENoZWNrQXV0aFNlcnZpY2UgfSBmcm9tICcuLi8uLi9hdXRoLXN0YXRlL2NoZWNrLWF1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhXZWxsS25vd25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY29uZmlnL2F1dGgtd2VsbC1rbm93bi9hdXRoLXdlbGwta25vd24uc2VydmljZSc7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi9jb25maWcvb3BlbmlkLWNvbmZpZ3VyYXRpb24nO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFJlZGlyZWN0U2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3JlZGlyZWN0L3JlZGlyZWN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVcmxTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXJsL3VybC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9naW5SZXNwb25zZSB9IGZyb20gJy4uL2xvZ2luLXJlc3BvbnNlJztcclxuaW1wb3J0IHsgUG9wdXBPcHRpb25zIH0gZnJvbSAnLi4vcG9wdXAvcG9wdXAtb3B0aW9ucyc7XHJcbmltcG9ydCB7IFBvcHVwUmVzdWx0UmVjZWl2ZWRVcmwgfSBmcm9tICcuLi9wb3B1cC9wb3B1cC1yZXN1bHQnO1xyXG5pbXBvcnQgeyBQb3BVcFNlcnZpY2UgfSBmcm9tICcuLi9wb3B1cC9wb3B1cC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9yZXNwb25zZS10eXBlLXZhbGlkYXRpb24vcmVzcG9uc2UtdHlwZS12YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQYXJSZXNwb25zZSB9IGZyb20gJy4vcGFyLXJlc3BvbnNlJztcclxuaW1wb3J0IHsgUGFyU2VydmljZSB9IGZyb20gJy4vcGFyLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUGFyTG9naW5TZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2U6IFJlc3BvbnNlVHlwZVZhbGlkYXRpb25TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSB1cmxTZXJ2aWNlOiBVcmxTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSByZWRpcmVjdFNlcnZpY2U6IFJlZGlyZWN0U2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXV0aFdlbGxLbm93blNlcnZpY2U6IEF1dGhXZWxsS25vd25TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBwb3B1cFNlcnZpY2U6IFBvcFVwU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2hlY2tBdXRoU2VydmljZTogQ2hlY2tBdXRoU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGFyU2VydmljZTogUGFyU2VydmljZVxyXG4gICkge31cclxuXHJcbiAgbG9naW5QYXIoY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbiwgYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLnJlc3BvbnNlVHlwZVZhbGlkYXRpb25TZXJ2aWNlLmhhc0NvbmZpZ1ZhbGlkUmVzcG9uc2VUeXBlKGNvbmZpZ3VyYXRpb24pKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWd1cmF0aW9uLCAnSW52YWxpZCByZXNwb25zZSB0eXBlIScpO1xyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWd1cmF0aW9uLCAnQkVHSU4gQXV0aG9yaXplIE9JREMgRmxvdywgbm8gYXV0aCBkYXRhJyk7XHJcblxyXG4gICAgY29uc3QgeyB1cmxIYW5kbGVyLCBjdXN0b21QYXJhbXMgfSA9IGF1dGhPcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIHRoaXMuYXV0aFdlbGxLbm93blNlcnZpY2VcclxuICAgICAgLnF1ZXJ5QW5kU3RvcmVBdXRoV2VsbEtub3duRW5kUG9pbnRzKGNvbmZpZ3VyYXRpb24pXHJcbiAgICAgIC5waXBlKHN3aXRjaE1hcCgoKSA9PiB0aGlzLnBhclNlcnZpY2UucG9zdFBhclJlcXVlc3QoY29uZmlndXJhdGlvbiwgY3VzdG9tUGFyYW1zKSkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZ3VyYXRpb24sICdwYXIgcmVzcG9uc2U6ICcsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy51cmxTZXJ2aWNlLmdldEF1dGhvcml6ZVBhclVybChyZXNwb25zZS5yZXF1ZXN0VXJpLCBjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZ3VyYXRpb24sICdwYXIgcmVxdWVzdCB1cmw6ICcsIHVybCk7XHJcblxyXG4gICAgICAgIGlmICghdXJsKSB7XHJcbiAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoY29uZmlndXJhdGlvbiwgYENvdWxkIG5vdCBjcmVhdGUgVVJMIHdpdGggcGFyYW0gJHtyZXNwb25zZS5yZXF1ZXN0VXJpfTogJyR7dXJsfSdgKTtcclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXJsSGFuZGxlcikge1xyXG4gICAgICAgICAgdXJsSGFuZGxlcih1cmwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnJlZGlyZWN0U2VydmljZS5yZWRpcmVjdFRvKHVybCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGxvZ2luV2l0aFBvcFVwUGFyKFxyXG4gICAgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIGFsbENvbmZpZ3M6IE9wZW5JZENvbmZpZ3VyYXRpb25bXSxcclxuICAgIGF1dGhPcHRpb25zPzogQXV0aE9wdGlvbnMsXHJcbiAgICBwb3B1cE9wdGlvbnM/OiBQb3B1cE9wdGlvbnNcclxuICApOiBPYnNlcnZhYmxlPExvZ2luUmVzcG9uc2U+IHtcclxuICAgIGNvbnN0IHsgY29uZmlnSWQgfSA9IGNvbmZpZ3VyYXRpb247XHJcblxyXG4gICAgaWYgKCF0aGlzLnJlc3BvbnNlVHlwZVZhbGlkYXRpb25TZXJ2aWNlLmhhc0NvbmZpZ1ZhbGlkUmVzcG9uc2VUeXBlKGNvbmZpZ3VyYXRpb24pKSB7XHJcbiAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9ICdJbnZhbGlkIHJlc3BvbnNlIHR5cGUhJztcclxuXHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWd1cmF0aW9uLCBlcnJvck1lc3NhZ2UpO1xyXG5cclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKGVycm9yTWVzc2FnZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWd1cmF0aW9uLCAnQkVHSU4gQXV0aG9yaXplIE9JREMgRmxvdyB3aXRoIHBvcHVwLCBubyBhdXRoIGRhdGEnKTtcclxuXHJcbiAgICBjb25zdCB7IGN1c3RvbVBhcmFtcyB9ID0gYXV0aE9wdGlvbnMgfHwge307XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYXV0aFdlbGxLbm93blNlcnZpY2UucXVlcnlBbmRTdG9yZUF1dGhXZWxsS25vd25FbmRQb2ludHMoY29uZmlndXJhdGlvbikucGlwZShcclxuICAgICAgc3dpdGNoTWFwKCgpID0+IHRoaXMucGFyU2VydmljZS5wb3N0UGFyUmVxdWVzdChjb25maWd1cmF0aW9uLCBjdXN0b21QYXJhbXMpKSxcclxuICAgICAgc3dpdGNoTWFwKChyZXNwb25zZTogUGFyUmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlndXJhdGlvbiwgJ3BhciByZXNwb25zZTogJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLnVybFNlcnZpY2UuZ2V0QXV0aG9yaXplUGFyVXJsKHJlc3BvbnNlLnJlcXVlc3RVcmksIGNvbmZpZ3VyYXRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlndXJhdGlvbiwgJ3BhciByZXF1ZXN0IHVybDogJywgdXJsKTtcclxuXHJcbiAgICAgICAgaWYgKCF1cmwpIHtcclxuICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBDb3VsZCBub3QgY3JlYXRlIFVSTCB3aXRoIHBhcmFtICR7cmVzcG9uc2UucmVxdWVzdFVyaX06ICd1cmwnYDtcclxuXHJcbiAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoY29uZmlndXJhdGlvbiwgZXJyb3JNZXNzYWdlKTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcigoKSA9PiBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBvcHVwU2VydmljZS5vcGVuUG9wVXAodXJsLCBwb3B1cE9wdGlvbnMsIGNvbmZpZ3VyYXRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5wb3B1cFNlcnZpY2UucmVzdWx0JC5waXBlKFxyXG4gICAgICAgICAgdGFrZSgxKSxcclxuICAgICAgICAgIHN3aXRjaE1hcCgocmVzdWx0OiBQb3B1cFJlc3VsdFJlY2VpdmVkVXJsKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgdXNlckNsb3NlZCwgcmVjZWl2ZWRVcmwgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgIGlmICh1c2VyQ2xvc2VkKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG9mKHtcclxuICAgICAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdVc2VyIGNsb3NlZCBwb3B1cCcsXHJcbiAgICAgICAgICAgICAgICB1c2VyRGF0YTogbnVsbCxcclxuICAgICAgICAgICAgICAgIGlkVG9rZW46IG51bGwsXHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogbnVsbCxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ0lkLFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja0F1dGhTZXJ2aWNlLmNoZWNrQXV0aChjb25maWd1cmF0aW9uLCBhbGxDb25maWdzLCByZWNlaXZlZFVybCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=