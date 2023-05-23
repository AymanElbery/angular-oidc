import { OpenIdConfiguration } from './../config/openid-configuration';
import { BrowserStorageService } from './browser-storage.service';
import * as i0 from "@angular/core";
export declare type StorageKeys = 'authnResult' | 'authzData' | 'access_token_expires_at' | 'authWellKnownEndPoints' | 'userData' | 'authNonce' | 'codeVerifier' | 'authStateControl' | 'reusable_refresh_token' | 'session_state' | 'storageSilentRenewRunning' | 'storageCodeFlowInProgress' | 'storageCustomParamsAuthRequest' | 'storageCustomParamsRefresh' | 'storageCustomParamsEndSession' | 'redirect' | 'configIds' | 'jwtKeys' | 'popupauth';
export declare class StoragePersistenceService {
    private readonly browserStorageService;
    constructor(browserStorageService: BrowserStorageService);
    read(key: StorageKeys, config: OpenIdConfiguration): any;
    write(key: StorageKeys, value: any, config: OpenIdConfiguration): boolean;
    remove(key: StorageKeys, config: OpenIdConfiguration): void;
    clear(config: OpenIdConfiguration): void;
    resetStorageFlowData(config: OpenIdConfiguration): void;
    resetAuthStateInStorage(config: OpenIdConfiguration): void;
    getAccessToken(config: OpenIdConfiguration): string;
    getIdToken(config: OpenIdConfiguration): string;
    getRefreshToken(config: OpenIdConfiguration): string;
    getAuthenticationResult(config: OpenIdConfiguration): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<StoragePersistenceService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StoragePersistenceService>;
}
