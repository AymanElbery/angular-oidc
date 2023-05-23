import { AuthOptions } from '../../auth-options';
import { AuthWellKnownService } from '../../config/auth-well-known/auth-well-known.service';
import { FlowsDataService } from '../../flows/flows-data.service';
import { LoggerService } from '../../logging/logger.service';
import { RedirectService } from '../../utils/redirect/redirect.service';
import { UrlService } from '../../utils/url/url.service';
import { ResponseTypeValidationService } from '../response-type-validation/response-type-validation.service';
import { OpenIdConfiguration } from './../../config/openid-configuration';
import * as i0 from "@angular/core";
export declare class StandardLoginService {
    private readonly loggerService;
    private readonly responseTypeValidationService;
    private readonly urlService;
    private readonly redirectService;
    private readonly authWellKnownService;
    private readonly flowsDataService;
    constructor(loggerService: LoggerService, responseTypeValidationService: ResponseTypeValidationService, urlService: UrlService, redirectService: RedirectService, authWellKnownService: AuthWellKnownService, flowsDataService: FlowsDataService);
    loginStandard(configuration: OpenIdConfiguration, authOptions?: AuthOptions): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<StandardLoginService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StandardLoginService>;
}
