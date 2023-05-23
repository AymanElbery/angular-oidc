import { Observable } from 'rxjs';
import { DataService } from '../../api/data.service';
import { OpenIdConfiguration } from '../../config/openid-configuration';
import { LoggerService } from '../../logging/logger.service';
import { StoragePersistenceService } from '../../storage/storage-persistence.service';
import { UrlService } from '../../utils/url/url.service';
import { ParResponse } from './par-response';
import * as i0 from "@angular/core";
export declare class ParService {
    private readonly loggerService;
    private readonly urlService;
    private readonly dataService;
    private readonly storagePersistenceService;
    constructor(loggerService: LoggerService, urlService: UrlService, dataService: DataService, storagePersistenceService: StoragePersistenceService);
    postParRequest(configuration: OpenIdConfiguration, customParams?: {
        [key: string]: string | number | boolean;
    }): Observable<ParResponse>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ParService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ParService>;
}
