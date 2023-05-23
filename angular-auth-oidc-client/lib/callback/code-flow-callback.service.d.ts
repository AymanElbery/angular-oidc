import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { CallbackContext } from '../flows/callback-context';
import { FlowsDataService } from '../flows/flows-data.service';
import { FlowsService } from '../flows/flows.service';
import { IntervalService } from './interval.service';
import * as i0 from "@angular/core";
export declare class CodeFlowCallbackService {
    private readonly flowsService;
    private readonly flowsDataService;
    private readonly intervalService;
    private readonly router;
    constructor(flowsService: FlowsService, flowsDataService: FlowsDataService, intervalService: IntervalService, router: Router);
    authenticatedCallbackWithCode(urlToCheck: string, config: OpenIdConfiguration, allConfigs: OpenIdConfiguration[]): Observable<CallbackContext>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CodeFlowCallbackService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CodeFlowCallbackService>;
}
