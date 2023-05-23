import { Observable } from 'rxjs';
import { PublicEventsService } from '../../public-events/public-events.service';
import { StoragePersistenceService } from '../../storage/storage-persistence.service';
import { OpenIdConfiguration } from '../openid-configuration';
import { AuthWellKnownDataService } from './auth-well-known-data.service';
import { AuthWellKnownEndpoints } from './auth-well-known-endpoints';
import * as i0 from "@angular/core";
export declare class AuthWellKnownService {
    private readonly dataService;
    private readonly publicEventsService;
    private readonly storagePersistenceService;
    constructor(dataService: AuthWellKnownDataService, publicEventsService: PublicEventsService, storagePersistenceService: StoragePersistenceService);
    storeWellKnownEndpoints(config: OpenIdConfiguration, mappedWellKnownEndpoints: AuthWellKnownEndpoints): void;
    queryAndStoreAuthWellKnownEndPoints(config: OpenIdConfiguration): Observable<AuthWellKnownEndpoints>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthWellKnownService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthWellKnownService>;
}
