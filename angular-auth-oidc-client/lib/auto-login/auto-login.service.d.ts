import { Router } from '@angular/router';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { OpenIdConfiguration } from './../config/openid-configuration';
import * as i0 from "@angular/core";
export declare class AutoLoginService {
    private readonly storageService;
    private readonly router;
    constructor(storageService: StoragePersistenceService, router: Router);
    checkSavedRedirectRouteAndNavigate(config: OpenIdConfiguration): void;
    /**
     * Saves the redirect URL to storage.
     *
     * @param url The redirect URL to save.
     */
    saveRedirectRoute(config: OpenIdConfiguration, url: string): void;
    /**
     * Gets the stored redirect URL from storage.
     */
    private getStoredRedirectRoute;
    /**
     * Removes the redirect URL from storage.
     */
    private deleteStoredRedirectRoute;
    static ɵfac: i0.ɵɵFactoryDeclaration<AutoLoginService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AutoLoginService>;
}
