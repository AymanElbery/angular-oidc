import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CheckAuthService } from '../auth-state/check-auth.service';
import { ConfigurationService } from '../config/config.service';
import { LoginService } from '../login/login.service';
import { AutoLoginService } from './auto-login.service';
import * as i0 from "@angular/core";
export declare class AutoLoginAllRoutesGuard implements CanActivate, CanActivateChild, CanLoad {
    private readonly autoLoginService;
    private readonly checkAuthService;
    private readonly loginService;
    private readonly configurationService;
    private readonly router;
    constructor(autoLoginService: AutoLoginService, checkAuthService: CheckAuthService, loginService: LoginService, configurationService: ConfigurationService, router: Router);
    canLoad(): Observable<boolean | UrlTree>;
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree>;
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree>;
    private checkAuth;
    static ɵfac: i0.ɵɵFactoryDeclaration<AutoLoginAllRoutesGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AutoLoginAllRoutesGuard>;
}
