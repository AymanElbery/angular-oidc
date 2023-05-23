import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../response-type-validation/response-type-validation.service";
import * as i3 from "../../utils/url/url.service";
import * as i4 from "../../utils/redirect/redirect.service";
import * as i5 from "../../config/auth-well-known/auth-well-known.service";
import * as i6 from "../../flows/flows-data.service";
export class StandardLoginService {
    constructor(loggerService, responseTypeValidationService, urlService, redirectService, authWellKnownService, flowsDataService) {
        this.loggerService = loggerService;
        this.responseTypeValidationService = responseTypeValidationService;
        this.urlService = urlService;
        this.redirectService = redirectService;
        this.authWellKnownService = authWellKnownService;
        this.flowsDataService = flowsDataService;
    }
    loginStandard(configuration, authOptions) {
        if (!this.responseTypeValidationService.hasConfigValidResponseType(configuration)) {
            this.loggerService.logError(configuration, 'Invalid response type!');
            return;
        }
        this.loggerService.logDebug(configuration, 'BEGIN Authorize OIDC Flow, no auth data');
        this.flowsDataService.setCodeFlowInProgress(configuration);
        this.authWellKnownService.queryAndStoreAuthWellKnownEndPoints(configuration).subscribe(() => {
            const { urlHandler } = authOptions || {};
            this.flowsDataService.resetSilentRenewRunning(configuration);
            this.urlService.getAuthorizeUrl(configuration, authOptions).subscribe((url) => {
                if (!url) {
                    this.loggerService.logError(configuration, 'Could not create URL', url);
                    return;
                }
                if (urlHandler) {
                    urlHandler(url);
                }
                else {
                    this.redirectService.redirectTo(url);
                }
            });
        });
    }
}
StandardLoginService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: StandardLoginService, deps: [{ token: i1.LoggerService }, { token: i2.ResponseTypeValidationService }, { token: i3.UrlService }, { token: i4.RedirectService }, { token: i5.AuthWellKnownService }, { token: i6.FlowsDataService }], target: i0.ɵɵFactoryTarget.Injectable });
StandardLoginService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: StandardLoginService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: StandardLoginService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LoggerService }, { type: i2.ResponseTypeValidationService }, { type: i3.UrlService }, { type: i4.RedirectService }, { type: i5.AuthWellKnownService }, { type: i6.FlowsDataService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhbmRhcmQtbG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL2xvZ2luL3N0YW5kYXJkL3N0YW5kYXJkLWxvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7QUFXM0MsTUFBTSxPQUFPLG9CQUFvQjtJQUMvQixZQUNtQixhQUE0QixFQUM1Qiw2QkFBNEQsRUFDNUQsVUFBc0IsRUFDdEIsZUFBZ0MsRUFDaEMsb0JBQTBDLEVBQzFDLGdCQUFrQztRQUxsQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixrQ0FBNkIsR0FBN0IsNkJBQTZCLENBQStCO1FBQzVELGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtJQUNsRCxDQUFDO0lBRUosYUFBYSxDQUFDLGFBQWtDLEVBQUUsV0FBeUI7UUFDekUsSUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQywwQkFBMEIsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUNqRixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztZQUVyRSxPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUseUNBQXlDLENBQUMsQ0FBQztRQUN0RixJQUFJLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFM0QsSUFBSSxDQUFDLG9CQUFvQixDQUFDLG1DQUFtQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDMUYsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLFdBQVcsSUFBSSxFQUFFLENBQUM7WUFFekMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTdELElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFXLEVBQUUsRUFBRTtnQkFDcEYsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDUixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsc0JBQXNCLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBRXhFLE9BQU87aUJBQ1I7Z0JBRUQsSUFBSSxVQUFVLEVBQUU7b0JBQ2QsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNqQjtxQkFBTTtvQkFDTCxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDdEM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7aUhBdkNVLG9CQUFvQjtxSEFBcEIsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBRGhDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEF1dGhPcHRpb25zIH0gZnJvbSAnLi4vLi4vYXV0aC1vcHRpb25zJztcclxuaW1wb3J0IHsgQXV0aFdlbGxLbm93blNlcnZpY2UgfSBmcm9tICcuLi8uLi9jb25maWcvYXV0aC13ZWxsLWtub3duL2F1dGgtd2VsbC1rbm93bi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmxvd3NEYXRhU2VydmljZSB9IGZyb20gJy4uLy4uL2Zsb3dzL2Zsb3dzLWRhdGEuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVkaXJlY3RTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcmVkaXJlY3QvcmVkaXJlY3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFVybFNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy91cmwvdXJsLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZXNwb25zZVR5cGVWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uL3Jlc3BvbnNlLXR5cGUtdmFsaWRhdGlvbi9yZXNwb25zZS10eXBlLXZhbGlkYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLy4uLy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTdGFuZGFyZExvZ2luU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJlc3BvbnNlVHlwZVZhbGlkYXRpb25TZXJ2aWNlOiBSZXNwb25zZVR5cGVWYWxpZGF0aW9uU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgdXJsU2VydmljZTogVXJsU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVkaXJlY3RTZXJ2aWNlOiBSZWRpcmVjdFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGF1dGhXZWxsS25vd25TZXJ2aWNlOiBBdXRoV2VsbEtub3duU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmxvd3NEYXRhU2VydmljZTogRmxvd3NEYXRhU2VydmljZVxyXG4gICkge31cclxuXHJcbiAgbG9naW5TdGFuZGFyZChjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uLCBhdXRoT3B0aW9ucz86IEF1dGhPcHRpb25zKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMucmVzcG9uc2VUeXBlVmFsaWRhdGlvblNlcnZpY2UuaGFzQ29uZmlnVmFsaWRSZXNwb25zZVR5cGUoY29uZmlndXJhdGlvbikpIHtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGNvbmZpZ3VyYXRpb24sICdJbnZhbGlkIHJlc3BvbnNlIHR5cGUhJyk7XHJcblxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZ3VyYXRpb24sICdCRUdJTiBBdXRob3JpemUgT0lEQyBGbG93LCBubyBhdXRoIGRhdGEnKTtcclxuICAgIHRoaXMuZmxvd3NEYXRhU2VydmljZS5zZXRDb2RlRmxvd0luUHJvZ3Jlc3MoY29uZmlndXJhdGlvbik7XHJcblxyXG4gICAgdGhpcy5hdXRoV2VsbEtub3duU2VydmljZS5xdWVyeUFuZFN0b3JlQXV0aFdlbGxLbm93bkVuZFBvaW50cyhjb25maWd1cmF0aW9uKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICBjb25zdCB7IHVybEhhbmRsZXIgfSA9IGF1dGhPcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgdGhpcy5mbG93c0RhdGFTZXJ2aWNlLnJlc2V0U2lsZW50UmVuZXdSdW5uaW5nKGNvbmZpZ3VyYXRpb24pO1xyXG5cclxuICAgICAgdGhpcy51cmxTZXJ2aWNlLmdldEF1dGhvcml6ZVVybChjb25maWd1cmF0aW9uLCBhdXRoT3B0aW9ucykuc3Vic2NyaWJlKCh1cmw6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGlmICghdXJsKSB7XHJcbiAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoY29uZmlndXJhdGlvbiwgJ0NvdWxkIG5vdCBjcmVhdGUgVVJMJywgdXJsKTtcclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXJsSGFuZGxlcikge1xyXG4gICAgICAgICAgdXJsSGFuZGxlcih1cmwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnJlZGlyZWN0U2VydmljZS5yZWRpcmVjdFRvKHVybCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=