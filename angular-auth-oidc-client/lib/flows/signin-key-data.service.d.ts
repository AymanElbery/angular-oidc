import { Observable } from 'rxjs';
import { DataService } from '../api/data.service';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { LoggerService } from '../logging/logger.service';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { JwtKeys } from '../validation/jwtkeys';
import * as i0 from "@angular/core";
export declare class SigninKeyDataService {
    private readonly storagePersistenceService;
    private readonly loggerService;
    private readonly dataService;
    constructor(storagePersistenceService: StoragePersistenceService, loggerService: LoggerService, dataService: DataService);
    getSigningKeys(currentConfiguration: OpenIdConfiguration): Observable<JwtKeys>;
    private handleErrorGetSigningKeys;
    static ɵfac: i0.ɵɵFactoryDeclaration<SigninKeyDataService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SigninKeyDataService>;
}
