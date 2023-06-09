import { OpenIdConfiguration } from '../../config/openid-configuration';
import * as i0 from "@angular/core";
export declare class FlowHelper {
    isCurrentFlowCodeFlow(configuration: OpenIdConfiguration): boolean;
    isCurrentFlowAnyImplicitFlow(configuration: OpenIdConfiguration): boolean;
    isCurrentFlowCodeFlowWithRefreshTokens(configuration: OpenIdConfiguration): boolean;
    isCurrentFlowImplicitFlowWithAccessToken(configuration: OpenIdConfiguration): boolean;
    currentFlowIs(flowTypes: string[] | string, configuration: OpenIdConfiguration): boolean;
    private isCurrentFlowImplicitFlowWithoutAccessToken;
    static ɵfac: i0.ɵɵFactoryDeclaration<FlowHelper, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FlowHelper>;
}
