import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthStateService } from '../auth-state/auth-state.service';
import { ConfigurationService } from '../config/config.service';
import { LoginService } from '../login/login.service';
import { AutoLoginService } from './auto-login.service';
import * as i0 from "@angular/core";
export declare class AutoLoginPartialRoutesGuard implements CanActivate, CanActivateChild, CanLoad {
    private readonly autoLoginService;
    private readonly authStateService;
    private readonly loginService;
    private readonly configurationService;
    private readonly router;
    constructor(autoLoginService: AutoLoginService, authStateService: AuthStateService, loginService: LoginService, configurationService: ConfigurationService, router: Router);
    canLoad(): Observable<boolean>;
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>;
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>;
    private checkAuth;
    static ɵfac: i0.ɵɵFactoryDeclaration<AutoLoginPartialRoutesGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AutoLoginPartialRoutesGuard>;
}
