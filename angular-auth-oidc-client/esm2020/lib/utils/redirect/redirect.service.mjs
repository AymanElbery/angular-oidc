import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class RedirectService {
    constructor(document) {
        this.document = document;
    }
    redirectTo(url) {
        this.document.location.href = url;
    }
}
RedirectService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RedirectService, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
RedirectService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RedirectService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RedirectService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXJlY3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL3V0aWxzL3JlZGlyZWN0L3JlZGlyZWN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUduRCxNQUFNLE9BQU8sZUFBZTtJQUMxQixZQUErQyxRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO0lBQUcsQ0FBQztJQUVyRSxVQUFVLENBQUMsR0FBRztRQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7SUFDcEMsQ0FBQzs7NEdBTFUsZUFBZSxrQkFDTixRQUFRO2dIQURqQixlQUFlLGNBREYsTUFBTTsyRkFDbkIsZUFBZTtrQkFEM0IsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7OzBCQUVuQixNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFJlZGlyZWN0U2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSByZWFkb25seSBkb2N1bWVudDogRG9jdW1lbnQpIHt9XHJcblxyXG4gIHJlZGlyZWN0VG8odXJsKTogdm9pZCB7XHJcbiAgICB0aGlzLmRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSB1cmw7XHJcbiAgfVxyXG59XHJcbiJdfQ==