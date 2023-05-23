import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../logging/logger.service";
export class IFrameService {
    constructor(document, loggerService) {
        this.document = document;
        this.loggerService = loggerService;
    }
    getExistingIFrame(identifier) {
        const iFrameOnParent = this.getIFrameFromParentWindow(identifier);
        if (this.isIFrameElement(iFrameOnParent)) {
            return iFrameOnParent;
        }
        const iFrameOnSelf = this.getIFrameFromWindow(identifier);
        if (this.isIFrameElement(iFrameOnSelf)) {
            return iFrameOnSelf;
        }
        return null;
    }
    addIFrameToWindowBody(identifier, config) {
        const sessionIframe = this.document.createElement('iframe');
        sessionIframe.id = identifier;
        sessionIframe.title = identifier;
        this.loggerService.logDebug(config, sessionIframe);
        sessionIframe.style.display = 'none';
        this.document.body.appendChild(sessionIframe);
        return sessionIframe;
    }
    getIFrameFromParentWindow(identifier) {
        try {
            const iFrameElement = this.document.defaultView.parent.document.getElementById(identifier);
            if (this.isIFrameElement(iFrameElement)) {
                return iFrameElement;
            }
            return null;
        }
        catch (e) {
            return null;
        }
    }
    getIFrameFromWindow(identifier) {
        const iFrameElement = this.document.getElementById(identifier);
        if (this.isIFrameElement(iFrameElement)) {
            return iFrameElement;
        }
        return null;
    }
    isIFrameElement(element) {
        return !!element && element instanceof HTMLIFrameElement;
    }
}
IFrameService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: IFrameService, deps: [{ token: DOCUMENT }, { token: i1.LoggerService }], target: i0.ɵɵFactoryTarget.Injectable });
IFrameService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: IFrameService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: IFrameService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.LoggerService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhpc3RpbmctaWZyYW1lLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9pZnJhbWUvZXhpc3RpbmctaWZyYW1lLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFLbkQsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFBK0MsUUFBa0IsRUFBbUIsYUFBNEI7UUFBakUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUFtQixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUFHLENBQUM7SUFFcEgsaUJBQWlCLENBQUMsVUFBa0I7UUFDbEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWxFLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUN4QyxPQUFPLGNBQWMsQ0FBQztTQUN2QjtRQUVELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUxRCxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDdEMsT0FBTyxZQUFZLENBQUM7U0FDckI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxVQUFrQixFQUFFLE1BQTJCO1FBQ25FLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTVELGFBQWEsQ0FBQyxFQUFFLEdBQUcsVUFBVSxDQUFDO1FBQzlCLGFBQWEsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNuRCxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTlDLE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFFTyx5QkFBeUIsQ0FBQyxVQUFrQjtRQUNsRCxJQUFJO1lBQ0YsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFM0YsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUN2QyxPQUFPLGFBQWEsQ0FBQzthQUN0QjtZQUVELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sSUFBSSxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRU8sbUJBQW1CLENBQUMsVUFBa0I7UUFDNUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFL0QsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ3ZDLE9BQU8sYUFBYSxDQUFDO1NBQ3RCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sZUFBZSxDQUFDLE9BQTJCO1FBQ2pELE9BQU8sQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLFlBQVksaUJBQWlCLENBQUM7SUFDM0QsQ0FBQzs7MEdBekRVLGFBQWEsa0JBQ0osUUFBUTs4R0FEakIsYUFBYTsyRkFBYixhQUFhO2tCQUR6QixVQUFVOzswQkFFSSxNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vY29uZmlnL29wZW5pZC1jb25maWd1cmF0aW9uJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgSUZyYW1lU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSByZWFkb25seSBkb2N1bWVudDogRG9jdW1lbnQsIHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSkge31cclxuXHJcbiAgZ2V0RXhpc3RpbmdJRnJhbWUoaWRlbnRpZmllcjogc3RyaW5nKTogSFRNTElGcmFtZUVsZW1lbnQgfCBudWxsIHtcclxuICAgIGNvbnN0IGlGcmFtZU9uUGFyZW50ID0gdGhpcy5nZXRJRnJhbWVGcm9tUGFyZW50V2luZG93KGlkZW50aWZpZXIpO1xyXG5cclxuICAgIGlmICh0aGlzLmlzSUZyYW1lRWxlbWVudChpRnJhbWVPblBhcmVudCkpIHtcclxuICAgICAgcmV0dXJuIGlGcmFtZU9uUGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGlGcmFtZU9uU2VsZiA9IHRoaXMuZ2V0SUZyYW1lRnJvbVdpbmRvdyhpZGVudGlmaWVyKTtcclxuXHJcbiAgICBpZiAodGhpcy5pc0lGcmFtZUVsZW1lbnQoaUZyYW1lT25TZWxmKSkge1xyXG4gICAgICByZXR1cm4gaUZyYW1lT25TZWxmO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgYWRkSUZyYW1lVG9XaW5kb3dCb2R5KGlkZW50aWZpZXI6IHN0cmluZywgY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uKTogSFRNTElGcmFtZUVsZW1lbnQge1xyXG4gICAgY29uc3Qgc2Vzc2lvbklmcmFtZSA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XHJcblxyXG4gICAgc2Vzc2lvbklmcmFtZS5pZCA9IGlkZW50aWZpZXI7XHJcbiAgICBzZXNzaW9uSWZyYW1lLnRpdGxlID0gaWRlbnRpZmllcjtcclxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWcsIHNlc3Npb25JZnJhbWUpO1xyXG4gICAgc2Vzc2lvbklmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgdGhpcy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNlc3Npb25JZnJhbWUpO1xyXG5cclxuICAgIHJldHVybiBzZXNzaW9uSWZyYW1lO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRJRnJhbWVGcm9tUGFyZW50V2luZG93KGlkZW50aWZpZXI6IHN0cmluZyk6IEhUTUxJRnJhbWVFbGVtZW50IHwgbnVsbCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBpRnJhbWVFbGVtZW50ID0gdGhpcy5kb2N1bWVudC5kZWZhdWx0Vmlldy5wYXJlbnQuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRlbnRpZmllcik7XHJcblxyXG4gICAgICBpZiAodGhpcy5pc0lGcmFtZUVsZW1lbnQoaUZyYW1lRWxlbWVudCkpIHtcclxuICAgICAgICByZXR1cm4gaUZyYW1lRWxlbWVudDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRJRnJhbWVGcm9tV2luZG93KGlkZW50aWZpZXI6IHN0cmluZyk6IEhUTUxJRnJhbWVFbGVtZW50IHwgbnVsbCB7XHJcbiAgICBjb25zdCBpRnJhbWVFbGVtZW50ID0gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZGVudGlmaWVyKTtcclxuXHJcbiAgICBpZiAodGhpcy5pc0lGcmFtZUVsZW1lbnQoaUZyYW1lRWxlbWVudCkpIHtcclxuICAgICAgcmV0dXJuIGlGcmFtZUVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzSUZyYW1lRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwpOiBlbGVtZW50IGlzIEhUTUxJRnJhbWVFbGVtZW50IHtcclxuICAgIHJldHVybiAhIWVsZW1lbnQgJiYgZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJRnJhbWVFbGVtZW50O1xyXG4gIH1cclxufVxyXG4iXX0=