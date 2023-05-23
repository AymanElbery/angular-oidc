import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { CallbackContext } from '../flows/callback-context';
import { FlowsDataService } from '../flows/flows-data.service';
import { FlowsService } from '../flows/flows.service';
import { IntervalService } from './interval.service';
import * as i0 from "@angular/core";
export declare class ImplicitFlowCallbackService {
    private readonly flowsService;
    private readonly router;
    private readonly flowsDataService;
    private readonly intervalService;
    constructor(flowsService: FlowsService, router: Router, flowsDataService: FlowsDataService, intervalService: IntervalService);
    authenticatedImplicitFlowCallback(config: OpenIdConfiguration, allConfigs: OpenIdConfiguration[], hash?: string): Observable<CallbackContext>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ImplicitFlowCallbackService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ImplicitFlowCallbackService>;
}
