import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class CurrentUrlService {
    constructor(document) {
        this.document = document;
    }
    getStateParamFromCurrentUrl(url) {
        const currentUrl = url || this.getCurrentUrl();
        const parsedUrl = new URL(currentUrl);
        const urlParams = new URLSearchParams(parsedUrl.search);
        const stateFromUrl = urlParams.get('state');
        return stateFromUrl;
    }
    getCurrentUrl() {
        return this.document.defaultView.location.toString();
    }
}
CurrentUrlService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CurrentUrlService, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
CurrentUrlService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CurrentUrlService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CurrentUrlService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVudC11cmwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL3V0aWxzL3VybC9jdXJyZW50LXVybC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFHbkQsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixZQUErQyxRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO0lBQUcsQ0FBQztJQUVyRSwyQkFBMkIsQ0FBQyxHQUFZO1FBQ3RDLE1BQU0sVUFBVSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDL0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFNUMsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN2RCxDQUFDOzs4R0FkVSxpQkFBaUIsa0JBQ1IsUUFBUTtrSEFEakIsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBRDdCLFVBQVU7OzBCQUVJLE1BQU07MkJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDdXJyZW50VXJsU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSByZWFkb25seSBkb2N1bWVudDogRG9jdW1lbnQpIHt9XHJcblxyXG4gIGdldFN0YXRlUGFyYW1Gcm9tQ3VycmVudFVybCh1cmw/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY3VycmVudFVybCA9IHVybCB8fCB0aGlzLmdldEN1cnJlbnRVcmwoKTtcclxuICAgIGNvbnN0IHBhcnNlZFVybCA9IG5ldyBVUkwoY3VycmVudFVybCk7XHJcbiAgICBjb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHBhcnNlZFVybC5zZWFyY2gpO1xyXG4gICAgY29uc3Qgc3RhdGVGcm9tVXJsID0gdXJsUGFyYW1zLmdldCgnc3RhdGUnKTtcclxuXHJcbiAgICByZXR1cm4gc3RhdGVGcm9tVXJsO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q3VycmVudFVybCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcubG9jYXRpb24udG9TdHJpbmcoKTtcclxuICB9XHJcbn1cclxuIl19