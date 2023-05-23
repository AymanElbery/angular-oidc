import { Observable } from 'rxjs';
import { AuthOptions } from '../../auth-options';
import { CheckAuthService } from '../../auth-state/check-auth.service';
import { AuthWellKnownService } from '../../config/auth-well-known/auth-well-known.service';
import { OpenIdConfiguration } from '../../config/openid-configuration';
import { LoggerService } from '../../logging/logger.service';
import { UrlService } from '../../utils/url/url.service';
import { LoginResponse } from '../login-response';
import { PopupOptions } from '../popup/popup-options';
import { PopUpService } from '../popup/popup.service';
import { ResponseTypeValidationService } from '../response-type-validation/response-type-validation.service';
import * as i0 from "@angular/core";
export declare class PopUpLoginService {
    private readonly loggerService;
    private readonly responseTypeValidationService;
    private readonly urlService;
    private readonly authWellKnownService;
    private readonly popupService;
    private readonly checkAuthService;
    constructor(loggerService: LoggerService, responseTypeValidationService: ResponseTypeValidationService, urlService: UrlService, authWellKnownService: AuthWellKnownService, popupService: PopUpService, checkAuthService: CheckAuthService);
    loginWithPopUpStandard(configuration: OpenIdConfiguration, allConfigs: OpenIdConfiguration[], authOptions?: AuthOptions, popupOptions?: PopupOptions): Observable<LoginResponse>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PopUpLoginService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PopUpLoginService>;
}
