import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class CryptoService {
    constructor(doc) {
        this.doc = doc;
    }
    getCrypto() {
        // support for IE,  (window.crypto || window.msCrypto)
        return this.doc.defaultView.crypto || this.doc.defaultView.msCrypto;
    }
}
CryptoService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CryptoService, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
CryptoService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CryptoService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CryptoService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J5cHRvLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi91dGlscy9jcnlwdG8vY3J5cHRvLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUduRCxNQUFNLE9BQU8sYUFBYTtJQUN4QixZQUErQyxHQUFhO1FBQWIsUUFBRyxHQUFILEdBQUcsQ0FBVTtJQUFHLENBQUM7SUFFaEUsU0FBUztRQUNQLHNEQUFzRDtRQUN0RCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQW1CLENBQUMsUUFBUSxDQUFDO0lBQy9FLENBQUM7OzBHQU5VLGFBQWEsa0JBQ0osUUFBUTs4R0FEakIsYUFBYTsyRkFBYixhQUFhO2tCQUR6QixVQUFVOzswQkFFSSxNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ3J5cHRvU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSByZWFkb25seSBkb2M6IERvY3VtZW50KSB7fVxyXG5cclxuICBnZXRDcnlwdG8oKTogYW55IHtcclxuICAgIC8vIHN1cHBvcnQgZm9yIElFLCAgKHdpbmRvdy5jcnlwdG8gfHwgd2luZG93Lm1zQ3J5cHRvKVxyXG4gICAgcmV0dXJuIHRoaXMuZG9jLmRlZmF1bHRWaWV3LmNyeXB0byB8fCAodGhpcy5kb2MuZGVmYXVsdFZpZXcgYXMgYW55KS5tc0NyeXB0bztcclxuICB9XHJcbn1cclxuIl19