import { Observable } from 'rxjs';
import { DataService } from '../api/data.service';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { LoggerService } from '../logging/logger.service';
import { PublicEventsService } from '../public-events/public-events.service';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { FlowHelper } from '../utils/flowHelper/flow-helper.service';
import { TokenHelperService } from '../utils/tokenHelper/token-helper.service';
import { UserDataResult } from './userdata-result';
import * as i0 from "@angular/core";
export declare class UserService {
    private readonly oidcDataService;
    private readonly storagePersistenceService;
    private readonly eventService;
    private readonly loggerService;
    private readonly tokenHelperService;
    private readonly flowHelper;
    private readonly userDataInternal$;
    get userData$(): Observable<UserDataResult>;
    constructor(oidcDataService: DataService, storagePersistenceService: StoragePersistenceService, eventService: PublicEventsService, loggerService: LoggerService, tokenHelperService: TokenHelperService, flowHelper: FlowHelper);
    getAndPersistUserDataInStore(currentConfiguration: OpenIdConfiguration, allConfigs: OpenIdConfiguration[], isRenewProcess?: boolean, idToken?: any, decodedIdToken?: any): Observable<any>;
    getUserDataFromStore(currentConfiguration: OpenIdConfiguration): any;
    publishUserDataIfExists(currentConfiguration: OpenIdConfiguration, allConfigs: OpenIdConfiguration[]): void;
    setUserDataToStore(userData: any, currentConfiguration: OpenIdConfiguration, allConfigs: OpenIdConfiguration[]): void;
    resetUserDataInStore(currentConfiguration: OpenIdConfiguration, allConfigs: OpenIdConfiguration[]): void;
    private getUserDataOidcFlowAndSave;
    private getIdentityUserData;
    private validateUserDataSubIdToken;
    private fireUserDataEvent;
    private composeSingleOrMultipleUserDataObject;
    private composeSingleUserDataResult;
    private currentConfigIsToUpdate;
    static ɵfac: i0.ɵɵFactoryDeclaration<UserService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UserService>;
}
