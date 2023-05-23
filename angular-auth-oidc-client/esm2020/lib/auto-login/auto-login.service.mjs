import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../storage/storage-persistence.service";
import * as i2 from "@angular/router";
const STORAGE_KEY = 'redirect';
export class AutoLoginService {
    constructor(storageService, router) {
        this.storageService = storageService;
        this.router = router;
    }
    checkSavedRedirectRouteAndNavigate(config) {
        const savedRouteForRedirect = this.getStoredRedirectRoute(config);
        if (savedRouteForRedirect) {
            this.deleteStoredRedirectRoute(config);
            this.router.navigateByUrl(savedRouteForRedirect);
        }
    }
    /**
     * Saves the redirect URL to storage.
     *
     * @param url The redirect URL to save.
     */
    saveRedirectRoute(config, url) {
        this.storageService.write(STORAGE_KEY, url, config);
    }
    /**
     * Gets the stored redirect URL from storage.
     */
    getStoredRedirectRoute(config) {
        return this.storageService.read(STORAGE_KEY, config);
    }
    /**
     * Removes the redirect URL from storage.
     */
    deleteStoredRedirectRoute(config) {
        this.storageService.remove(STORAGE_KEY, config);
    }
}
AutoLoginService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AutoLoginService, deps: [{ token: i1.StoragePersistenceService }, { token: i2.Router }], target: i0.ɵɵFactoryTarget.Injectable });
AutoLoginService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AutoLoginService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AutoLoginService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.StoragePersistenceService }, { type: i2.Router }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1sb2dpbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy9saWIvYXV0by1sb2dpbi9hdXRvLWxvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQUszQyxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUM7QUFHL0IsTUFBTSxPQUFPLGdCQUFnQjtJQUMzQixZQUE2QixjQUF5QyxFQUFtQixNQUFjO1FBQTFFLG1CQUFjLEdBQWQsY0FBYyxDQUEyQjtRQUFtQixXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUcsQ0FBQztJQUUzRyxrQ0FBa0MsQ0FBQyxNQUEyQjtRQUM1RCxNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVsRSxJQUFJLHFCQUFxQixFQUFFO1lBQ3pCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxpQkFBaUIsQ0FBQyxNQUEyQixFQUFFLEdBQVc7UUFDeEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQ7O09BRUc7SUFDSyxzQkFBc0IsQ0FBQyxNQUEyQjtRQUN4RCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7O09BRUc7SUFDSyx5QkFBeUIsQ0FBQyxNQUEyQjtRQUMzRCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEQsQ0FBQzs7NkdBakNVLGdCQUFnQjtpSEFBaEIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBRDVCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4uL3N0b3JhZ2Uvc3RvcmFnZS1wZXJzaXN0ZW5jZS5zZXJ2aWNlJztcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XG5cbmNvbnN0IFNUT1JBR0VfS0VZID0gJ3JlZGlyZWN0JztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEF1dG9Mb2dpblNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHN0b3JhZ2VTZXJ2aWNlOiBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLCBwcml2YXRlIHJlYWRvbmx5IHJvdXRlcjogUm91dGVyKSB7fVxuXG4gIGNoZWNrU2F2ZWRSZWRpcmVjdFJvdXRlQW5kTmF2aWdhdGUoY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uKTogdm9pZCB7XG4gICAgY29uc3Qgc2F2ZWRSb3V0ZUZvclJlZGlyZWN0ID0gdGhpcy5nZXRTdG9yZWRSZWRpcmVjdFJvdXRlKGNvbmZpZyk7XG5cbiAgICBpZiAoc2F2ZWRSb3V0ZUZvclJlZGlyZWN0KSB7XG4gICAgICB0aGlzLmRlbGV0ZVN0b3JlZFJlZGlyZWN0Um91dGUoY29uZmlnKTtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwoc2F2ZWRSb3V0ZUZvclJlZGlyZWN0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIHJlZGlyZWN0IFVSTCB0byBzdG9yYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gdXJsIFRoZSByZWRpcmVjdCBVUkwgdG8gc2F2ZS5cbiAgICovXG4gIHNhdmVSZWRpcmVjdFJvdXRlKGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbiwgdXJsOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLndyaXRlKFNUT1JBR0VfS0VZLCB1cmwsIGNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgc3RvcmVkIHJlZGlyZWN0IFVSTCBmcm9tIHN0b3JhZ2UuXG4gICAqL1xuICBwcml2YXRlIGdldFN0b3JlZFJlZGlyZWN0Um91dGUoY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlU2VydmljZS5yZWFkKFNUT1JBR0VfS0VZLCBjb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHJlZGlyZWN0IFVSTCBmcm9tIHN0b3JhZ2UuXG4gICAqL1xuICBwcml2YXRlIGRlbGV0ZVN0b3JlZFJlZGlyZWN0Um91dGUoY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5zdG9yYWdlU2VydmljZS5yZW1vdmUoU1RPUkFHRV9LRVksIGNvbmZpZyk7XG4gIH1cbn1cbiJdfQ==