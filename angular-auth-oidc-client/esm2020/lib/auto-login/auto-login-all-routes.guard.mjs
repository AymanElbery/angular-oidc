import { Injectable } from '@angular/core';
import { map, switchMap, take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./auto-login.service";
import * as i2 from "../auth-state/check-auth.service";
import * as i3 from "../login/login.service";
import * as i4 from "../config/config.service";
import * as i5 from "@angular/router";
export class AutoLoginAllRoutesGuard {
    constructor(autoLoginService, checkAuthService, loginService, configurationService, router) {
        this.autoLoginService = autoLoginService;
        this.checkAuthService = checkAuthService;
        this.loginService = loginService;
        this.configurationService = configurationService;
        this.router = router;
    }
    canLoad() {
        return this.checkAuth(this.router.getCurrentNavigation()?.extractedUrl.toString().substring(1) ?? '');
    }
    canActivate(route, state) {
        return this.checkAuth(state.url);
    }
    canActivateChild(route, state) {
        return this.checkAuth(state.url);
    }
    checkAuth(url) {
        return this.configurationService.getOpenIDConfiguration().pipe(switchMap((config) => {
            const allconfigs = this.configurationService.getAllConfigurations();
            return this.checkAuthService.checkAuth(config, allconfigs).pipe(take(1), map(({ isAuthenticated }) => {
                if (isAuthenticated) {
                    this.autoLoginService.checkSavedRedirectRouteAndNavigate(config);
                }
                if (!isAuthenticated) {
                    this.autoLoginService.saveRedirectRoute(config, url);
                    this.loginService.login(config);
                }
                return isAuthenticated;
            }));
        }));
    }
}
AutoLoginAllRoutesGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AutoLoginAllRoutesGuard, deps: [{ token: i1.AutoLoginService }, { token: i2.CheckAuthService }, { token: i3.LoginService }, { token: i4.ConfigurationService }, { token: i5.Router }], target: i0.ɵɵFactoryTarget.Injectable });
AutoLoginAllRoutesGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AutoLoginAllRoutesGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AutoLoginAllRoutesGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.AutoLoginService }, { type: i2.CheckAuthService }, { type: i3.LoginService }, { type: i4.ConfigurationService }, { type: i5.Router }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1sb2dpbi1hbGwtcm91dGVzLmd1YXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy9saWIvYXV0by1sb2dpbi9hdXRvLWxvZ2luLWFsbC1yb3V0ZXMuZ3VhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7OztBQU90RCxNQUFNLE9BQU8sdUJBQXVCO0lBQ2xDLFlBQ21CLGdCQUFrQyxFQUNsQyxnQkFBa0MsRUFDbEMsWUFBMEIsRUFDMUIsb0JBQTBDLEVBQzFDLE1BQWM7UUFKZCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQzlCLENBQUM7SUFFSixPQUFPO1FBQ0wsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3hHLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBNkIsRUFBRSxLQUEwQjtRQUNuRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxLQUE2QixFQUFFLEtBQTBCO1FBQ3hFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVPLFNBQVMsQ0FBQyxHQUFXO1FBQzNCLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLHNCQUFzQixFQUFFLENBQUMsSUFBSSxDQUM1RCxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNuQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUVwRSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FDN0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNQLEdBQUcsQ0FBQyxDQUFDLEVBQUUsZUFBZSxFQUFFLEVBQUUsRUFBRTtnQkFDMUIsSUFBSSxlQUFlLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxrQ0FBa0MsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDbEU7Z0JBRUQsSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDckQsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ2pDO2dCQUVELE9BQU8sZUFBZSxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUNILENBQUM7UUFDSixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQzs7b0hBM0NVLHVCQUF1Qjt3SEFBdkIsdUJBQXVCLGNBRFYsTUFBTTsyRkFDbkIsdUJBQXVCO2tCQURuQyxVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgQ2FuQWN0aXZhdGUsIENhbkFjdGl2YXRlQ2hpbGQsIENhbkxvYWQsIFJvdXRlciwgUm91dGVyU3RhdGVTbmFwc2hvdCwgVXJsVHJlZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgbWFwLCBzd2l0Y2hNYXAsIHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IENoZWNrQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9hdXRoLXN0YXRlL2NoZWNrLWF1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi4vbG9naW4vbG9naW4uc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dG9Mb2dpblNlcnZpY2UgfSBmcm9tICcuL2F1dG8tbG9naW4uc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgQXV0b0xvZ2luQWxsUm91dGVzR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSwgQ2FuQWN0aXZhdGVDaGlsZCwgQ2FuTG9hZCB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGF1dG9Mb2dpblNlcnZpY2U6IEF1dG9Mb2dpblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNoZWNrQXV0aFNlcnZpY2U6IENoZWNrQXV0aFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2luU2VydmljZTogTG9naW5TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb25maWd1cmF0aW9uU2VydmljZTogQ29uZmlndXJhdGlvblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlcjogUm91dGVyXHJcbiAgKSB7fVxyXG5cclxuICBjYW5Mb2FkKCk6IE9ic2VydmFibGU8Ym9vbGVhbiB8IFVybFRyZWU+IHtcclxuICAgIHJldHVybiB0aGlzLmNoZWNrQXV0aCh0aGlzLnJvdXRlci5nZXRDdXJyZW50TmF2aWdhdGlvbigpPy5leHRyYWN0ZWRVcmwudG9TdHJpbmcoKS5zdWJzdHJpbmcoMSkgPz8gJycpO1xyXG4gIH1cclxuXHJcbiAgY2FuQWN0aXZhdGUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogT2JzZXJ2YWJsZTxib29sZWFuIHwgVXJsVHJlZT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hlY2tBdXRoKHN0YXRlLnVybCk7XHJcbiAgfVxyXG5cclxuICBjYW5BY3RpdmF0ZUNoaWxkKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IE9ic2VydmFibGU8Ym9vbGVhbiB8IFVybFRyZWU+IHtcclxuICAgIHJldHVybiB0aGlzLmNoZWNrQXV0aChzdGF0ZS51cmwpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0F1dGgodXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKS5waXBlKFxyXG4gICAgICBzd2l0Y2hNYXAoKGNvbmZpZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFsbGNvbmZpZ3MgPSB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEFsbENvbmZpZ3VyYXRpb25zKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNoZWNrQXV0aFNlcnZpY2UuY2hlY2tBdXRoKGNvbmZpZywgYWxsY29uZmlncykucGlwZShcclxuICAgICAgICAgIHRha2UoMSksXHJcbiAgICAgICAgICBtYXAoKHsgaXNBdXRoZW50aWNhdGVkIH0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzQXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuYXV0b0xvZ2luU2VydmljZS5jaGVja1NhdmVkUmVkaXJlY3RSb3V0ZUFuZE5hdmlnYXRlKGNvbmZpZyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghaXNBdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5hdXRvTG9naW5TZXJ2aWNlLnNhdmVSZWRpcmVjdFJvdXRlKGNvbmZpZywgdXJsKTtcclxuICAgICAgICAgICAgICB0aGlzLmxvZ2luU2VydmljZS5sb2dpbihjb25maWcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaXNBdXRoZW50aWNhdGVkO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19