import { Observable } from 'rxjs';
import { DataService } from '../../api/data.service';
import { OpenIdConfiguration } from '../../config/openid-configuration';
import { LoggerService } from '../../logging/logger.service';
import { StoragePersistenceService } from '../../storage/storage-persistence.service';
import { UrlService } from '../../utils/url/url.service';
import { CallbackContext } from '../callback-context';
import * as i0 from "@angular/core";
export declare class RefreshTokenCallbackHandlerService {
    private readonly urlService;
    private readonly loggerService;
    private readonly dataService;
    private readonly storagePersistenceService;
    constructor(urlService: UrlService, loggerService: LoggerService, dataService: DataService, storagePersistenceService: StoragePersistenceService);
    refreshTokensRequestTokens(callbackContext: CallbackContext, config: OpenIdConfiguration, customParamsRefresh?: {
        [key: string]: string | number | boolean;
    }): Observable<CallbackContext>;
    private handleRefreshRetry;
    static ɵfac: i0.ɵɵFactoryDeclaration<RefreshTokenCallbackHandlerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RefreshTokenCallbackHandlerService>;
}
