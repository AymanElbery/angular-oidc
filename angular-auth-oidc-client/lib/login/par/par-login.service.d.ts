import { Observable } from 'rxjs';
import { AuthOptions } from '../../auth-options';
import { CheckAuthService } from '../../auth-state/check-auth.service';
import { AuthWellKnownService } from '../../config/auth-well-known/auth-well-known.service';
import { OpenIdConfiguration } from '../../config/openid-configuration';
import { LoggerService } from '../../logging/logger.service';
import { RedirectService } from '../../utils/redirect/redirect.service';
import { UrlService } from '../../utils/url/url.service';
import { LoginResponse } from '../login-response';
import { PopupOptions } from '../popup/popup-options';
import { PopUpService } from '../popup/popup.service';
import { ResponseTypeValidationService } from '../response-type-validation/response-type-validation.service';
import { ParService } from './par.service';
import * as i0 from "@angular/core";
export declare class ParLoginService {
    private readonly loggerService;
    private readonly responseTypeValidationService;
    private readonly urlService;
    private readonly redirectService;
    private readonly authWellKnownService;
    private readonly popupService;
    private readonly checkAuthService;
    private readonly parService;
    constructor(loggerService: LoggerService, responseTypeValidationService: ResponseTypeValidationService, urlService: UrlService, redirectService: RedirectService, authWellKnownService: AuthWellKnownService, popupService: PopUpService, checkAuthService: CheckAuthService, parService: ParService);
    loginPar(configuration: OpenIdConfiguration, authOptions?: AuthOptions): void;
    loginWithPopUpPar(configuration: OpenIdConfiguration, allConfigs: OpenIdConfiguration[], authOptions?: AuthOptions, popupOptions?: PopupOptions): Observable<LoginResponse>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ParLoginService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ParLoginService>;
}
