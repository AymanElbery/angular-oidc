import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./auto-login.service";
import * as i2 from "../auth-state/auth-state.service";
import * as i3 from "../login/login.service";
import * as i4 from "../config/config.service";
import * as i5 from "@angular/router";
export class AutoLoginPartialRoutesGuard {
    constructor(autoLoginService, authStateService, loginService, configurationService, router) {
        this.autoLoginService = autoLoginService;
        this.authStateService = authStateService;
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
        return this.configurationService.getOpenIDConfiguration().pipe(map((configuration) => {
            const isAuthenticated = this.authStateService.areAuthStorageTokensValid(configuration);
            if (isAuthenticated) {
                this.autoLoginService.checkSavedRedirectRouteAndNavigate(configuration);
            }
            if (!isAuthenticated) {
                this.autoLoginService.saveRedirectRoute(configuration, url);
                this.loginService.login(configuration);
            }
            return isAuthenticated;
        }));
    }
}
AutoLoginPartialRoutesGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AutoLoginPartialRoutesGuard, deps: [{ token: i1.AutoLoginService }, { token: i2.AuthStateService }, { token: i3.LoginService }, { token: i4.ConfigurationService }, { token: i5.Router }], target: i0.ɵɵFactoryTarget.Injectable });
AutoLoginPartialRoutesGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AutoLoginPartialRoutesGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AutoLoginPartialRoutesGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.AutoLoginService }, { type: i2.AuthStateService }, { type: i3.LoginService }, { type: i4.ConfigurationService }, { type: i5.Router }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1sb2dpbi1wYXJ0aWFsLXJvdXRlcy5ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL2F1dG8tbG9naW4vYXV0by1sb2dpbi1wYXJ0aWFsLXJvdXRlcy5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7OztBQU9yQyxNQUFNLE9BQU8sMkJBQTJCO0lBQ3RDLFlBQ21CLGdCQUFrQyxFQUNsQyxnQkFBa0MsRUFDbEMsWUFBMEIsRUFDMUIsb0JBQTBDLEVBQzFDLE1BQWM7UUFKZCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQzlCLENBQUM7SUFFSixPQUFPO1FBQ0wsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3hHLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBNkIsRUFBRSxLQUEwQjtRQUNuRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxLQUE2QixFQUFFLEtBQTBCO1FBQ3hFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVPLFNBQVMsQ0FBQyxHQUFXO1FBQzNCLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLHNCQUFzQixFQUFFLENBQUMsSUFBSSxDQUM1RCxHQUFHLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUNwQixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMseUJBQXlCLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFdkYsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxrQ0FBa0MsQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUN6RTtZQUVELElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzVELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ3hDO1lBRUQsT0FBTyxlQUFlLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7O3dIQXRDVSwyQkFBMkI7NEhBQTNCLDJCQUEyQixjQURkLE1BQU07MkZBQ25CLDJCQUEyQjtrQkFEdkMsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIENhbkFjdGl2YXRlLCBDYW5BY3RpdmF0ZUNoaWxkLCBDYW5Mb2FkLCBSb3V0ZXIsIFJvdXRlclN0YXRlU25hcHNob3QgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQXV0aFN0YXRlU2VydmljZSB9IGZyb20gJy4uL2F1dGgtc3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2dpblNlcnZpY2UgfSBmcm9tICcuLi9sb2dpbi9sb2dpbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0b0xvZ2luU2VydmljZSB9IGZyb20gJy4vYXV0by1sb2dpbi5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBBdXRvTG9naW5QYXJ0aWFsUm91dGVzR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSwgQ2FuQWN0aXZhdGVDaGlsZCwgQ2FuTG9hZCB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGF1dG9Mb2dpblNlcnZpY2U6IEF1dG9Mb2dpblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2luU2VydmljZTogTG9naW5TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb25maWd1cmF0aW9uU2VydmljZTogQ29uZmlndXJhdGlvblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlcjogUm91dGVyXHJcbiAgKSB7fVxyXG5cclxuICBjYW5Mb2FkKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hlY2tBdXRoKHRoaXMucm91dGVyLmdldEN1cnJlbnROYXZpZ2F0aW9uKCk/LmV4dHJhY3RlZFVybC50b1N0cmluZygpLnN1YnN0cmluZygxKSA/PyAnJyk7XHJcbiAgfVxyXG5cclxuICBjYW5BY3RpdmF0ZShyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgIHJldHVybiB0aGlzLmNoZWNrQXV0aChzdGF0ZS51cmwpO1xyXG4gIH1cclxuXHJcbiAgY2FuQWN0aXZhdGVDaGlsZChyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgIHJldHVybiB0aGlzLmNoZWNrQXV0aChzdGF0ZS51cmwpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0F1dGgodXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKS5waXBlKFxyXG4gICAgICBtYXAoKGNvbmZpZ3VyYXRpb24pID0+IHtcclxuICAgICAgICBjb25zdCBpc0F1dGhlbnRpY2F0ZWQgPSB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuYXJlQXV0aFN0b3JhZ2VUb2tlbnNWYWxpZChjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKGlzQXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgdGhpcy5hdXRvTG9naW5TZXJ2aWNlLmNoZWNrU2F2ZWRSZWRpcmVjdFJvdXRlQW5kTmF2aWdhdGUoY29uZmlndXJhdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWlzQXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgdGhpcy5hdXRvTG9naW5TZXJ2aWNlLnNhdmVSZWRpcmVjdFJvdXRlKGNvbmZpZ3VyYXRpb24sIHVybCk7XHJcbiAgICAgICAgICB0aGlzLmxvZ2luU2VydmljZS5sb2dpbihjb25maWd1cmF0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpc0F1dGhlbnRpY2F0ZWQ7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=