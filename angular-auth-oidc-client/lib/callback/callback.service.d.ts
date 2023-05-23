import { Observable } from 'rxjs';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { CallbackContext } from '../flows/callback-context';
import { FlowHelper } from '../utils/flowHelper/flow-helper.service';
import { UrlService } from '../utils/url/url.service';
import { CodeFlowCallbackService } from './code-flow-callback.service';
import { ImplicitFlowCallbackService } from './implicit-flow-callback.service';
import * as i0 from "@angular/core";
export declare class CallbackService {
    private readonly urlService;
    private readonly flowHelper;
    private readonly implicitFlowCallbackService;
    private readonly codeFlowCallbackService;
    private readonly stsCallbackInternal$;
    get stsCallback$(): Observable<unknown>;
    constructor(urlService: UrlService, flowHelper: FlowHelper, implicitFlowCallbackService: ImplicitFlowCallbackService, codeFlowCallbackService: CodeFlowCallbackService);
    isCallback(currentUrl: string): boolean;
    handleCallbackAndFireEvents(currentCallbackUrl: string, config: OpenIdConfiguration, allConfigs: OpenIdConfiguration[]): Observable<CallbackContext>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CallbackService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CallbackService>;
}
