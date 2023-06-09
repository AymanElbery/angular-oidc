import { OpenIdConfiguration } from '../config/openid-configuration';
import * as i0 from "@angular/core";
export declare class ClosestMatchingRouteService {
    getConfigIdForClosestMatchingRoute(route: string, configurations: OpenIdConfiguration[]): ClosestMatchingRouteResult;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClosestMatchingRouteService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClosestMatchingRouteService>;
}
export interface ClosestMatchingRouteResult {
    matchingRoute: string;
    matchingConfig: OpenIdConfiguration;
}
