import { inject, Injectable } from '@angular/core';
import { AuthStateService } from '../auth-state/auth-state.service';
import { ConfigurationService } from '../config/config.service';
import { LoggerService } from '../logging/logger.service';
import { ClosestMatchingRouteService } from './closest-matching-route.service';
import * as i0 from "@angular/core";
import * as i1 from "../auth-state/auth-state.service";
import * as i2 from "../config/config.service";
import * as i3 from "../logging/logger.service";
import * as i4 from "./closest-matching-route.service";
export class AuthInterceptor {
    constructor(authStateService, configurationService, loggerService, closestMatchingRouteService) {
        this.authStateService = authStateService;
        this.configurationService = configurationService;
        this.loggerService = loggerService;
        this.closestMatchingRouteService = closestMatchingRouteService;
    }
    intercept(req, next) {
        return interceptRequest(req, next.handle, {
            configurationService: this.configurationService,
            authStateService: this.authStateService,
            closestMatchingRouteService: this.closestMatchingRouteService,
            loggerService: this.loggerService,
        });
    }
}
AuthInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AuthInterceptor, deps: [{ token: i1.AuthStateService }, { token: i2.ConfigurationService }, { token: i3.LoggerService }, { token: i4.ClosestMatchingRouteService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AuthInterceptor });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AuthInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.AuthStateService }, { type: i2.ConfigurationService }, { type: i3.LoggerService }, { type: i4.ClosestMatchingRouteService }]; } });
export function authInterceptor() {
    return (req, next) => {
        return interceptRequest(req, next, {
            configurationService: inject(ConfigurationService),
            authStateService: inject(AuthStateService),
            closestMatchingRouteService: inject(ClosestMatchingRouteService),
            loggerService: inject(LoggerService),
        });
    };
}
function interceptRequest(req, next, deps) {
    if (!deps.configurationService.hasAtLeastOneConfig()) {
        return next(req);
    }
    const allConfigurations = deps.configurationService.getAllConfigurations();
    const allRoutesConfigured = allConfigurations.map((x) => x.secureRoutes || []);
    const allRoutesConfiguredFlat = [].concat(...allRoutesConfigured);
    if (allRoutesConfiguredFlat.length === 0) {
        deps.loggerService.logDebug(allConfigurations[0], `No routes to check configured`);
        return next(req);
    }
    const { matchingConfig, matchingRoute } = deps.closestMatchingRouteService.getConfigIdForClosestMatchingRoute(req.url, allConfigurations);
    if (!matchingConfig) {
        deps.loggerService.logDebug(allConfigurations[0], `Did not find any configured route for route ${req.url}`);
        return next(req);
    }
    deps.loggerService.logDebug(matchingConfig, `'${req.url}' matches configured route '${matchingRoute}'`);
    const token = deps.authStateService.getAccessToken(matchingConfig);
    if (!token) {
        deps.loggerService.logDebug(matchingConfig, `Wanted to add token to ${req.url} but found no token: '${token}'`);
        return next(req);
    }
    deps.loggerService.logDebug(matchingConfig, `'${req.url}' matches configured route '${matchingRoute}', adding token`);
    req = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
        headers: req.headers.set('X-OAUTH-IDENTITY-DOMAIN-NAME', 'StudentServicesDomain'),
    });
    return next(req);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5pbnRlcmNlcHRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFbkQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDcEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDOzs7Ozs7QUFPL0UsTUFBTSxPQUFPLGVBQWU7SUFDMUIsWUFDbUIsZ0JBQWtDLEVBQ2xDLG9CQUEwQyxFQUMxQyxhQUE0QixFQUM1QiwyQkFBd0Q7UUFIeEQscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGdDQUEyQixHQUEzQiwyQkFBMkIsQ0FBNkI7SUFDeEUsQ0FBQztJQUVKLFNBQVMsQ0FBQyxHQUFxQixFQUFFLElBQWlCO1FBQ2hELE9BQU8sZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDeEMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLG9CQUFvQjtZQUMvQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ3ZDLDJCQUEyQixFQUFFLElBQUksQ0FBQywyQkFBMkI7WUFDN0QsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO1NBQ2xDLENBQUMsQ0FBQztJQUNMLENBQUM7OzRHQWZVLGVBQWU7Z0hBQWYsZUFBZTsy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ZXB0b3IsIEh0dHBSZXF1ZXN0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBpbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBBdXRoU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vYXV0aC1zdGF0ZS9hdXRoLXN0YXRlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uU2VydmljZSB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2xvc2VzdE1hdGNoaW5nUm91dGVTZXJ2aWNlIH0gZnJvbSAnLi9jbG9zZXN0LW1hdGNoaW5nLXJvdXRlLnNlcnZpY2UnO1xyXG5cclxuLy8gdGhlc2UgdHlwZXMgY2FuIGJlIGRyb3BwZWQgd2hlbiBBbmd1bGFyIDE0IHN1cHBvcnQgaXMgZHJvcHBlZCAoYW5kIGltcG9ydGVkIGZyb20gYW5ndWxhci9jb21tb24vaHR0cClcclxuZGVjbGFyZSB0eXBlIEh0dHBIYW5kbGVyRm4gPSAocmVxOiBIdHRwUmVxdWVzdDx1bmtub3duPikgPT4gT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8dW5rbm93bj4+O1xyXG5kZWNsYXJlIHR5cGUgSHR0cEludGVyY2VwdG9yRm4gPSAocmVxOiBIdHRwUmVxdWVzdDx1bmtub3duPiwgbmV4dDogSHR0cEhhbmRsZXJGbikgPT4gT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8dW5rbm93bj4+O1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aEludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXV0aFN0YXRlU2VydmljZTogQXV0aFN0YXRlU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29uZmlndXJhdGlvblNlcnZpY2U6IENvbmZpZ3VyYXRpb25TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjbG9zZXN0TWF0Y2hpbmdSb3V0ZVNlcnZpY2U6IENsb3Nlc3RNYXRjaGluZ1JvdXRlU2VydmljZVxyXG4gICkge31cclxuXHJcbiAgaW50ZXJjZXB0KHJlcTogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XHJcbiAgICByZXR1cm4gaW50ZXJjZXB0UmVxdWVzdChyZXEsIG5leHQuaGFuZGxlLCB7XHJcbiAgICAgIGNvbmZpZ3VyYXRpb25TZXJ2aWNlOiB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLFxyXG4gICAgICBhdXRoU3RhdGVTZXJ2aWNlOiB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UsXHJcbiAgICAgIGNsb3Nlc3RNYXRjaGluZ1JvdXRlU2VydmljZTogdGhpcy5jbG9zZXN0TWF0Y2hpbmdSb3V0ZVNlcnZpY2UsXHJcbiAgICAgIGxvZ2dlclNlcnZpY2U6IHRoaXMubG9nZ2VyU2VydmljZSxcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF1dGhJbnRlcmNlcHRvcigpOiBIdHRwSW50ZXJjZXB0b3JGbiB7XHJcbiAgcmV0dXJuIChyZXEsIG5leHQpID0+IHtcclxuICAgIHJldHVybiBpbnRlcmNlcHRSZXF1ZXN0KHJlcSwgbmV4dCwge1xyXG4gICAgICBjb25maWd1cmF0aW9uU2VydmljZTogaW5qZWN0KENvbmZpZ3VyYXRpb25TZXJ2aWNlKSxcclxuICAgICAgYXV0aFN0YXRlU2VydmljZTogaW5qZWN0KEF1dGhTdGF0ZVNlcnZpY2UpLFxyXG4gICAgICBjbG9zZXN0TWF0Y2hpbmdSb3V0ZVNlcnZpY2U6IGluamVjdChDbG9zZXN0TWF0Y2hpbmdSb3V0ZVNlcnZpY2UpLFxyXG4gICAgICBsb2dnZXJTZXJ2aWNlOiBpbmplY3QoTG9nZ2VyU2VydmljZSksXHJcbiAgICB9KTtcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnRlcmNlcHRSZXF1ZXN0KFxyXG4gIHJlcTogSHR0cFJlcXVlc3Q8YW55PixcclxuICBuZXh0OiBIdHRwSGFuZGxlckZuLFxyXG4gIGRlcHM6IHtcclxuICAgIGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2U7XHJcbiAgICBjb25maWd1cmF0aW9uU2VydmljZTogQ29uZmlndXJhdGlvblNlcnZpY2U7XHJcbiAgICBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlO1xyXG4gICAgY2xvc2VzdE1hdGNoaW5nUm91dGVTZXJ2aWNlOiBDbG9zZXN0TWF0Y2hpbmdSb3V0ZVNlcnZpY2U7XHJcbiAgfVxyXG4pOiBPYnNlcnZhYmxlPEh0dHBFdmVudDx1bmtub3duPj4ge1xyXG4gIGlmICghZGVwcy5jb25maWd1cmF0aW9uU2VydmljZS5oYXNBdExlYXN0T25lQ29uZmlnKCkpIHtcclxuICAgIHJldHVybiBuZXh0KHJlcSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBhbGxDb25maWd1cmF0aW9ucyA9IGRlcHMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0QWxsQ29uZmlndXJhdGlvbnMoKTtcclxuICBjb25zdCBhbGxSb3V0ZXNDb25maWd1cmVkID0gYWxsQ29uZmlndXJhdGlvbnMubWFwKCh4KSA9PiB4LnNlY3VyZVJvdXRlcyB8fCBbXSk7XHJcbiAgY29uc3QgYWxsUm91dGVzQ29uZmlndXJlZEZsYXQgPSBbXS5jb25jYXQoLi4uYWxsUm91dGVzQ29uZmlndXJlZCkgYXMgc3RyaW5nW107XHJcblxyXG4gIGlmIChhbGxSb3V0ZXNDb25maWd1cmVkRmxhdC5sZW5ndGggPT09IDApIHtcclxuICAgIGRlcHMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhhbGxDb25maWd1cmF0aW9uc1swXSwgYE5vIHJvdXRlcyB0byBjaGVjayBjb25maWd1cmVkYCk7XHJcblxyXG4gICAgcmV0dXJuIG5leHQocmVxKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHsgbWF0Y2hpbmdDb25maWcsIG1hdGNoaW5nUm91dGUgfSA9IGRlcHMuY2xvc2VzdE1hdGNoaW5nUm91dGVTZXJ2aWNlLmdldENvbmZpZ0lkRm9yQ2xvc2VzdE1hdGNoaW5nUm91dGUocmVxLnVybCwgYWxsQ29uZmlndXJhdGlvbnMpO1xyXG5cclxuICBpZiAoIW1hdGNoaW5nQ29uZmlnKSB7XHJcbiAgICBkZXBzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYWxsQ29uZmlndXJhdGlvbnNbMF0sIGBEaWQgbm90IGZpbmQgYW55IGNvbmZpZ3VyZWQgcm91dGUgZm9yIHJvdXRlICR7cmVxLnVybH1gKTtcclxuXHJcbiAgICByZXR1cm4gbmV4dChyZXEpO1xyXG4gIH1cclxuXHJcbiAgZGVwcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKG1hdGNoaW5nQ29uZmlnLCBgJyR7cmVxLnVybH0nIG1hdGNoZXMgY29uZmlndXJlZCByb3V0ZSAnJHttYXRjaGluZ1JvdXRlfSdgKTtcclxuICBjb25zdCB0b2tlbiA9IGRlcHMuYXV0aFN0YXRlU2VydmljZS5nZXRBY2Nlc3NUb2tlbihtYXRjaGluZ0NvbmZpZyk7XHJcblxyXG4gIGlmICghdG9rZW4pIHtcclxuICAgIGRlcHMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhtYXRjaGluZ0NvbmZpZywgYFdhbnRlZCB0byBhZGQgdG9rZW4gdG8gJHtyZXEudXJsfSBidXQgZm91bmQgbm8gdG9rZW46ICcke3Rva2VufSdgKTtcclxuXHJcbiAgICByZXR1cm4gbmV4dChyZXEpO1xyXG4gIH1cclxuXHJcbiAgZGVwcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKG1hdGNoaW5nQ29uZmlnLCBgJyR7cmVxLnVybH0nIG1hdGNoZXMgY29uZmlndXJlZCByb3V0ZSAnJHttYXRjaGluZ1JvdXRlfScsIGFkZGluZyB0b2tlbmApO1xyXG4gIHJlcSA9IHJlcS5jbG9uZSh7XHJcbiAgICBoZWFkZXJzOiByZXEuaGVhZGVycy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyB0b2tlbiksXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBuZXh0KHJlcSk7XHJcbn1cclxuIl19