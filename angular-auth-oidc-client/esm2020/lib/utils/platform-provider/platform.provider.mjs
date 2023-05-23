import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as i0 from "@angular/core";
export class PlatformProvider {
    constructor(platformId) {
        this.platformId = platformId;
    }
    isBrowser() {
        return isPlatformBrowser(this.platformId);
    }
}
PlatformProvider.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: PlatformProvider, deps: [{ token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
PlatformProvider.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: PlatformProvider });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: PlatformProvider, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0ucHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi91dGlscy9wbGF0Zm9ybS1wcm92aWRlci9wbGF0Zm9ybS5wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBR2hFLE1BQU0sT0FBTyxnQkFBZ0I7SUFLM0IsWUFBa0QsVUFBa0I7UUFBbEIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtJQUFHLENBQUM7SUFKeEUsU0FBUztRQUNQLE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7OzZHQUhVLGdCQUFnQixrQkFLUCxXQUFXO2lIQUxwQixnQkFBZ0I7MkZBQWhCLGdCQUFnQjtrQkFENUIsVUFBVTs7MEJBTUksTUFBTTsyQkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIFBMQVRGT1JNX0lEIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBQbGF0Zm9ybVByb3ZpZGVyIHtcclxuICBpc0Jyb3dzZXIoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcmVhZG9ubHkgcGxhdGZvcm1JZDogc3RyaW5nKSB7fVxyXG59XHJcbiJdfQ==