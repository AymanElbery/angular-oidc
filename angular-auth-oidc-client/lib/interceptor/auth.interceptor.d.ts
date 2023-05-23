import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStateService } from '../auth-state/auth-state.service';
import { ConfigurationService } from '../config/config.service';
import { LoggerService } from '../logging/logger.service';
import { ClosestMatchingRouteService } from './closest-matching-route.service';
import * as i0 from "@angular/core";
declare type HttpHandlerFn = (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>;
declare type HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => Observable<HttpEvent<unknown>>;
export declare class AuthInterceptor implements HttpInterceptor {
    private readonly authStateService;
    private readonly configurationService;
    private readonly loggerService;
    private readonly closestMatchingRouteService;
    constructor(authStateService: AuthStateService, configurationService: ConfigurationService, loggerService: LoggerService, closestMatchingRouteService: ClosestMatchingRouteService);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthInterceptor>;
}
export declare function authInterceptor(): HttpInterceptorFn;
export {};
