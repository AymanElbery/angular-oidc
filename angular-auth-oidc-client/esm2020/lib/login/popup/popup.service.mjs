import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../storage/storage-persistence.service";
export class PopUpService {
    constructor(document, loggerService, storagePersistenceService) {
        this.document = document;
        this.loggerService = loggerService;
        this.storagePersistenceService = storagePersistenceService;
        this.STORAGE_IDENTIFIER = 'popupauth';
        this.resultInternal$ = new Subject();
    }
    get result$() {
        return this.resultInternal$.asObservable();
    }
    get windowInternal() {
        return this.document.defaultView;
    }
    currentWindowIsPopUp() {
        return !!this.windowInternal.opener && this.windowInternal.opener !== this.windowInternal;
    }
    isCurrentlyInPopup(config) {
        if (this.canAccessSessionStorage()) {
            const mainWindowHasPopupOpen = this.mainWindowHasPopupOpen(config);
            const currentWindowIsPopup = this.currentWindowIsPopUp();
            return mainWindowHasPopupOpen || currentWindowIsPopup;
        }
        return false;
    }
    openPopUp(url, popupOptions, config) {
        const optionsToPass = this.getOptions(popupOptions);
        this.popUp = this.windowInternal.open(url, '_blank', optionsToPass);
        if (!this.popUp) {
            this.loggerService.logError(config, 'Could not open popup');
            return;
        }
        this.storagePersistenceService.write(this.STORAGE_IDENTIFIER, 'true', config);
        const listener = (event) => {
            if (!event?.data || typeof event.data !== 'string') {
                this.cleanUp(listener, config);
                return;
            }
            this.resultInternal$.next({ userClosed: false, receivedUrl: event.data });
            this.cleanUp(listener, config);
        };
        this.windowInternal.addEventListener('message', listener, false);
        this.handle = this.windowInternal.setInterval(() => {
            if (this.popUp?.closed) {
                this.resultInternal$.next({ userClosed: true });
                this.cleanUp(listener, config);
            }
        }, 200);
    }
    sendMessageToMainWindow(url) {
        if (this.windowInternal.opener) {
            const href = this.windowInternal.location.href;
            this.sendMessage(url, href);
        }
    }
    cleanUp(listener, config) {
        this.windowInternal.removeEventListener('message', listener, false);
        this.windowInternal.clearInterval(this.handle);
        if (this.popUp) {
            this.storagePersistenceService.remove(this.STORAGE_IDENTIFIER, config);
            this.popUp.close();
            this.popUp = null;
        }
    }
    sendMessage(url, href) {
        this.windowInternal.opener.postMessage(url, href);
    }
    getOptions(popupOptions) {
        const popupDefaultOptions = { width: 500, height: 500, left: 50, top: 50 };
        const options = { ...popupDefaultOptions, ...(popupOptions || {}) };
        const left = this.windowInternal.screenLeft + (this.windowInternal.outerWidth - options.width) / 2;
        const top = this.windowInternal.screenTop + (this.windowInternal.outerHeight - options.height) / 2;
        options.left = left;
        options.top = top;
        return Object.entries(options)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join(',');
    }
    mainWindowHasPopupOpen(config) {
        return !!this.storagePersistenceService.read(this.STORAGE_IDENTIFIER, config);
    }
    canAccessSessionStorage() {
        return typeof navigator !== 'undefined' && navigator.cookieEnabled && typeof Storage !== 'undefined';
    }
}
PopUpService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: PopUpService, deps: [{ token: DOCUMENT }, { token: i1.LoggerService }, { token: i2.StoragePersistenceService }], target: i0.ɵɵFactoryTarget.Injectable });
PopUpService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: PopUpService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: PopUpService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.LoggerService }, { type: i2.StoragePersistenceService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL2xvZ2luL3BvcHVwL3BvcHVwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7QUFRM0MsTUFBTSxPQUFPLFlBQVk7SUFpQnZCLFlBQ3FDLFFBQWtCLEVBQ3BDLGFBQTRCLEVBQzVCLHlCQUFvRDtRQUZsQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3BDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBMkI7UUFuQnRELHVCQUFrQixHQUFHLFdBQVcsQ0FBQztRQU1qQyxvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFlLENBQUM7SUFjM0QsQ0FBQztJQVpKLElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsSUFBWSxjQUFjO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7SUFDbkMsQ0FBQztJQVFELG9CQUFvQjtRQUNsQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzVGLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxNQUEyQjtRQUM1QyxJQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxFQUFFO1lBQ2xDLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25FLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFFekQsT0FBTyxzQkFBc0IsSUFBSSxvQkFBb0IsQ0FBQztTQUN2RDtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELFNBQVMsQ0FBQyxHQUFXLEVBQUUsWUFBMEIsRUFBRSxNQUEyQjtRQUM1RSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXBELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUVwRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNmLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1lBRTVELE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUU5RSxNQUFNLFFBQVEsR0FBRyxDQUFDLEtBQW1CLEVBQVEsRUFBRTtZQUM3QyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUNsRCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFFL0IsT0FBTzthQUNSO1lBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUUxRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFakUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDakQsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDdEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFFaEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDaEM7UUFDSCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDVixDQUFDO0lBRUQsdUJBQXVCLENBQUMsR0FBVztRQUNqQyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO1lBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUUvQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFTyxPQUFPLENBQUMsUUFBYSxFQUFFLE1BQTJCO1FBQ3hELElBQUksQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFL0MsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDdkUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjtJQUNILENBQUM7SUFFTyxXQUFXLENBQUMsR0FBVyxFQUFFLElBQVk7UUFDM0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU8sVUFBVSxDQUFDLFlBQTBCO1FBQzNDLE1BQU0sbUJBQW1CLEdBQWlCLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ3pGLE1BQU0sT0FBTyxHQUFpQixFQUFFLEdBQUcsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ2xGLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzRyxNQUFNLEdBQUcsR0FBVyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFM0csT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDcEIsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFFbEIsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQzthQUMzQixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2FBQ2hGLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFTyxzQkFBc0IsQ0FBQyxNQUEyQjtRQUN4RCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRU8sdUJBQXVCO1FBQzdCLE9BQU8sT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxhQUFhLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxDQUFDO0lBQ3ZHLENBQUM7O3lHQXJIVSxZQUFZLGtCQWtCYixRQUFROzZHQWxCUCxZQUFZLGNBREMsTUFBTTsyRkFDbkIsWUFBWTtrQkFEeEIsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7OzBCQW1CN0IsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vY29uZmlnL29wZW5pZC1jb25maWd1cmF0aW9uJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc3RvcmFnZS9zdG9yYWdlLXBlcnNpc3RlbmNlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQb3B1cE9wdGlvbnMgfSBmcm9tICcuL3BvcHVwLW9wdGlvbnMnO1xyXG5pbXBvcnQgeyBQb3B1cFJlc3VsdCB9IGZyb20gJy4vcG9wdXAtcmVzdWx0JztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBQb3BVcFNlcnZpY2Uge1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgU1RPUkFHRV9JREVOVElGSUVSID0gJ3BvcHVwYXV0aCc7XHJcblxyXG4gIHByaXZhdGUgcG9wVXA6IFdpbmRvdztcclxuXHJcbiAgcHJpdmF0ZSBoYW5kbGU6IG51bWJlcjtcclxuXHJcbiAgcHJpdmF0ZSByZWFkb25seSByZXN1bHRJbnRlcm5hbCQgPSBuZXcgU3ViamVjdDxQb3B1cFJlc3VsdD4oKTtcclxuXHJcbiAgZ2V0IHJlc3VsdCQoKTogT2JzZXJ2YWJsZTxQb3B1cFJlc3VsdD4ge1xyXG4gICAgcmV0dXJuIHRoaXMucmVzdWx0SW50ZXJuYWwkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXQgd2luZG93SW50ZXJuYWwoKTogV2luZG93IHtcclxuICAgIHJldHVybiB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3O1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIHJlYWRvbmx5IGRvY3VtZW50OiBEb2N1bWVudCxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZTogU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZVxyXG4gICkge31cclxuXHJcbiAgY3VycmVudFdpbmRvd0lzUG9wVXAoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gISF0aGlzLndpbmRvd0ludGVybmFsLm9wZW5lciAmJiB0aGlzLndpbmRvd0ludGVybmFsLm9wZW5lciAhPT0gdGhpcy53aW5kb3dJbnRlcm5hbDtcclxuICB9XHJcblxyXG4gIGlzQ3VycmVudGx5SW5Qb3B1cChjb25maWc6IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzLmNhbkFjY2Vzc1Nlc3Npb25TdG9yYWdlKCkpIHtcclxuICAgICAgY29uc3QgbWFpbldpbmRvd0hhc1BvcHVwT3BlbiA9IHRoaXMubWFpbldpbmRvd0hhc1BvcHVwT3Blbihjb25maWcpO1xyXG4gICAgICBjb25zdCBjdXJyZW50V2luZG93SXNQb3B1cCA9IHRoaXMuY3VycmVudFdpbmRvd0lzUG9wVXAoKTtcclxuXHJcbiAgICAgIHJldHVybiBtYWluV2luZG93SGFzUG9wdXBPcGVuIHx8IGN1cnJlbnRXaW5kb3dJc1BvcHVwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIG9wZW5Qb3BVcCh1cmw6IHN0cmluZywgcG9wdXBPcHRpb25zOiBQb3B1cE9wdGlvbnMsIGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbik6IHZvaWQge1xyXG4gICAgY29uc3Qgb3B0aW9uc1RvUGFzcyA9IHRoaXMuZ2V0T3B0aW9ucyhwb3B1cE9wdGlvbnMpO1xyXG5cclxuICAgIHRoaXMucG9wVXAgPSB0aGlzLndpbmRvd0ludGVybmFsLm9wZW4odXJsLCAnX2JsYW5rJywgb3B0aW9uc1RvUGFzcyk7XHJcblxyXG4gICAgaWYgKCF0aGlzLnBvcFVwKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWcsICdDb3VsZCBub3Qgb3BlbiBwb3B1cCcpO1xyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSh0aGlzLlNUT1JBR0VfSURFTlRJRklFUiwgJ3RydWUnLCBjb25maWcpO1xyXG5cclxuICAgIGNvbnN0IGxpc3RlbmVyID0gKGV2ZW50OiBNZXNzYWdlRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKCFldmVudD8uZGF0YSB8fCB0eXBlb2YgZXZlbnQuZGF0YSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICB0aGlzLmNsZWFuVXAobGlzdGVuZXIsIGNvbmZpZyk7XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5yZXN1bHRJbnRlcm5hbCQubmV4dCh7IHVzZXJDbG9zZWQ6IGZhbHNlLCByZWNlaXZlZFVybDogZXZlbnQuZGF0YSB9KTtcclxuXHJcbiAgICAgIHRoaXMuY2xlYW5VcChsaXN0ZW5lciwgY29uZmlnKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy53aW5kb3dJbnRlcm5hbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdGVuZXIsIGZhbHNlKTtcclxuXHJcbiAgICB0aGlzLmhhbmRsZSA9IHRoaXMud2luZG93SW50ZXJuYWwuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5wb3BVcD8uY2xvc2VkKSB7XHJcbiAgICAgICAgdGhpcy5yZXN1bHRJbnRlcm5hbCQubmV4dCh7IHVzZXJDbG9zZWQ6IHRydWUgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYW5VcChsaXN0ZW5lciwgY29uZmlnKTtcclxuICAgICAgfVxyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIHNlbmRNZXNzYWdlVG9NYWluV2luZG93KHVybDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy53aW5kb3dJbnRlcm5hbC5vcGVuZXIpIHtcclxuICAgICAgY29uc3QgaHJlZiA9IHRoaXMud2luZG93SW50ZXJuYWwubG9jYXRpb24uaHJlZjtcclxuXHJcbiAgICAgIHRoaXMuc2VuZE1lc3NhZ2UodXJsLCBocmVmKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2xlYW5VcChsaXN0ZW5lcjogYW55LCBjb25maWc6IE9wZW5JZENvbmZpZ3VyYXRpb24pOiB2b2lkIHtcclxuICAgIHRoaXMud2luZG93SW50ZXJuYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RlbmVyLCBmYWxzZSk7XHJcbiAgICB0aGlzLndpbmRvd0ludGVybmFsLmNsZWFySW50ZXJ2YWwodGhpcy5oYW5kbGUpO1xyXG5cclxuICAgIGlmICh0aGlzLnBvcFVwKSB7XHJcbiAgICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZW1vdmUodGhpcy5TVE9SQUdFX0lERU5USUZJRVIsIGNvbmZpZyk7XHJcbiAgICAgIHRoaXMucG9wVXAuY2xvc2UoKTtcclxuICAgICAgdGhpcy5wb3BVcCA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNlbmRNZXNzYWdlKHVybDogc3RyaW5nLCBocmVmOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMud2luZG93SW50ZXJuYWwub3BlbmVyLnBvc3RNZXNzYWdlKHVybCwgaHJlZik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldE9wdGlvbnMocG9wdXBPcHRpb25zOiBQb3B1cE9wdGlvbnMpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgcG9wdXBEZWZhdWx0T3B0aW9uczogUG9wdXBPcHRpb25zID0geyB3aWR0aDogNTAwLCBoZWlnaHQ6IDUwMCwgbGVmdDogNTAsIHRvcDogNTAgfTtcclxuICAgIGNvbnN0IG9wdGlvbnM6IFBvcHVwT3B0aW9ucyA9IHsgLi4ucG9wdXBEZWZhdWx0T3B0aW9ucywgLi4uKHBvcHVwT3B0aW9ucyB8fCB7fSkgfTtcclxuICAgIGNvbnN0IGxlZnQ6IG51bWJlciA9IHRoaXMud2luZG93SW50ZXJuYWwuc2NyZWVuTGVmdCArICh0aGlzLndpbmRvd0ludGVybmFsLm91dGVyV2lkdGggLSBvcHRpb25zLndpZHRoKSAvIDI7XHJcbiAgICBjb25zdCB0b3A6IG51bWJlciA9IHRoaXMud2luZG93SW50ZXJuYWwuc2NyZWVuVG9wICsgKHRoaXMud2luZG93SW50ZXJuYWwub3V0ZXJIZWlnaHQgLSBvcHRpb25zLmhlaWdodCkgLyAyO1xyXG5cclxuICAgIG9wdGlvbnMubGVmdCA9IGxlZnQ7XHJcbiAgICBvcHRpb25zLnRvcCA9IHRvcDtcclxuXHJcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMob3B0aW9ucylcclxuICAgICAgLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBgJHtlbmNvZGVVUklDb21wb25lbnQoa2V5KX09JHtlbmNvZGVVUklDb21wb25lbnQodmFsdWUpfWApXHJcbiAgICAgIC5qb2luKCcsJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1haW5XaW5kb3dIYXNQb3B1cE9wZW4oY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gISF0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCh0aGlzLlNUT1JBR0VfSURFTlRJRklFUiwgY29uZmlnKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2FuQWNjZXNzU2Vzc2lvblN0b3JhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLmNvb2tpZUVuYWJsZWQgJiYgdHlwZW9mIFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnO1xyXG4gIH1cclxufVxyXG4iXX0=