import { Observable } from 'rxjs';
import { AuthOptions } from '../auth-options';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { LoginResponse } from './login-response';
import { ParLoginService } from './par/par-login.service';
import { PopUpLoginService } from './popup/popup-login.service';
import { PopupOptions } from './popup/popup-options';
import { PopUpService } from './popup/popup.service';
import { StandardLoginService } from './standard/standard-login.service';
import * as i0 from "@angular/core";
export declare class LoginService {
    private readonly parLoginService;
    private readonly popUpLoginService;
    private readonly standardLoginService;
    private readonly storagePersistenceService;
    private readonly popupService;
    constructor(parLoginService: ParLoginService, popUpLoginService: PopUpLoginService, standardLoginService: StandardLoginService, storagePersistenceService: StoragePersistenceService, popupService: PopUpService);
    login(configuration: OpenIdConfiguration, authOptions?: AuthOptions): void;
    loginWithPopUp(configuration: OpenIdConfiguration, allConfigs: OpenIdConfiguration[], authOptions?: AuthOptions, popupOptions?: PopupOptions): Observable<LoginResponse>;
    static ɵfac: i0.ɵɵFactoryDeclaration<LoginService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LoginService>;
}
