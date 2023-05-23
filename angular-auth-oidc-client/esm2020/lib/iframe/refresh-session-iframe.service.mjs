import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../logging/logger.service";
import * as i2 from "../utils/url/url.service";
import * as i3 from "./silent-renew.service";
export class RefreshSessionIframeService {
    constructor(document, loggerService, urlService, silentRenewService, rendererFactory) {
        this.document = document;
        this.loggerService = loggerService;
        this.urlService = urlService;
        this.silentRenewService = silentRenewService;
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    refreshSessionWithIframe(config, allConfigs, customParams) {
        this.loggerService.logDebug(config, 'BEGIN refresh session Authorize Iframe renew');
        return this.urlService.getRefreshSessionSilentRenewUrl(config, customParams).pipe(switchMap((url) => {
            return this.sendAuthorizeRequestUsingSilentRenew(url, config, allConfigs);
        }));
    }
    sendAuthorizeRequestUsingSilentRenew(url, config, allConfigs) {
        const sessionIframe = this.silentRenewService.getOrCreateIframe(config);
        this.initSilentRenewRequest(config, allConfigs);
        this.loggerService.logDebug(config, 'sendAuthorizeRequestUsingSilentRenew for URL:' + url);
        return new Observable((observer) => {
            const onLoadHandler = () => {
                sessionIframe.removeEventListener('load', onLoadHandler);
                this.loggerService.logDebug(config, 'removed event listener from IFrame');
                observer.next(true);
                observer.complete();
            };
            sessionIframe.addEventListener('load', onLoadHandler);
            sessionIframe.contentWindow.location.replace(url);
        });
    }
    initSilentRenewRequest(config, allConfigs) {
        const instanceId = Math.random();
        const initDestroyHandler = this.renderer.listen('window', 'oidc-silent-renew-init', (e) => {
            if (e.detail !== instanceId) {
                initDestroyHandler();
                renewDestroyHandler();
            }
        });
        const renewDestroyHandler = this.renderer.listen('window', 'oidc-silent-renew-message', (e) => this.silentRenewService.silentRenewEventHandler(e, config, allConfigs));
        this.document.defaultView.dispatchEvent(new CustomEvent('oidc-silent-renew-init', {
            detail: instanceId,
        }));
    }
}
RefreshSessionIframeService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RefreshSessionIframeService, deps: [{ token: DOCUMENT }, { token: i1.LoggerService }, { token: i2.UrlService }, { token: i3.SilentRenewService }, { token: i0.RendererFactory2 }], target: i0.ɵɵFactoryTarget.Injectable });
RefreshSessionIframeService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RefreshSessionIframeService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RefreshSessionIframeService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.LoggerService }, { type: i2.UrlService }, { type: i3.SilentRenewService }, { type: i0.RendererFactory2 }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcmVzaC1zZXNzaW9uLWlmcmFtZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy9saWIvaWZyYW1lL3JlZnJlc2gtc2Vzc2lvbi1pZnJhbWUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQStCLE1BQU0sZUFBZSxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7OztBQU8zQyxNQUFNLE9BQU8sMkJBQTJCO0lBR3RDLFlBQ3FDLFFBQWtCLEVBQ3BDLGFBQTRCLEVBQzVCLFVBQXNCLEVBQ3RCLGtCQUFzQyxFQUN2RCxlQUFpQztRQUpFLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDcEMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBR3ZELElBQUksQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELHdCQUF3QixDQUN0QixNQUEyQixFQUMzQixVQUFpQyxFQUNqQyxZQUEyRDtRQUUzRCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsOENBQThDLENBQUMsQ0FBQztRQUVwRixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsK0JBQStCLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FDL0UsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDaEIsT0FBTyxJQUFJLENBQUMsb0NBQW9DLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVPLG9DQUFvQyxDQUMxQyxHQUFXLEVBQ1gsTUFBMkIsRUFDM0IsVUFBaUM7UUFFakMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXhFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLCtDQUErQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBRTNGLE9BQU8sSUFBSSxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNqQyxNQUFNLGFBQWEsR0FBRyxHQUFTLEVBQUU7Z0JBQy9CLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO2dCQUMxRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwQixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDO1lBRUYsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztZQUN0RCxhQUFhLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sc0JBQXNCLENBQUMsTUFBMkIsRUFBRSxVQUFpQztRQUMzRixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFakMsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQyxDQUFjLEVBQUUsRUFBRTtZQUNyRyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO2dCQUMzQixrQkFBa0IsRUFBRSxDQUFDO2dCQUNyQixtQkFBbUIsRUFBRSxDQUFDO2FBQ3ZCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSwyQkFBMkIsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQzVGLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUN2RSxDQUFDO1FBRUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUNyQyxJQUFJLFdBQVcsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4QyxNQUFNLEVBQUUsVUFBVTtTQUNuQixDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7O3dIQXBFVSwyQkFBMkIsa0JBSTVCLFFBQVE7NEhBSlAsMkJBQTJCLGNBRGQsTUFBTTsyRkFDbkIsMkJBQTJCO2tCQUR2QyxVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7MEJBSzdCLE1BQU07MkJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBSZW5kZXJlcjIsIFJlbmRlcmVyRmFjdG9yeTIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9jb25maWcvb3BlbmlkLWNvbmZpZ3VyYXRpb24nO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFVybFNlcnZpY2UgfSBmcm9tICcuLi91dGlscy91cmwvdXJsLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTaWxlbnRSZW5ld1NlcnZpY2UgfSBmcm9tICcuL3NpbGVudC1yZW5ldy5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBSZWZyZXNoU2Vzc2lvbklmcmFtZVNlcnZpY2Uge1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgcmVuZGVyZXI6IFJlbmRlcmVyMjtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIHJlYWRvbmx5IGRvY3VtZW50OiBEb2N1bWVudCxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgdXJsU2VydmljZTogVXJsU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2lsZW50UmVuZXdTZXJ2aWNlOiBTaWxlbnRSZW5ld1NlcnZpY2UsXHJcbiAgICByZW5kZXJlckZhY3Rvcnk6IFJlbmRlcmVyRmFjdG9yeTJcclxuICApIHtcclxuICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlckZhY3RvcnkuY3JlYXRlUmVuZGVyZXIobnVsbCwgbnVsbCk7XHJcbiAgfVxyXG5cclxuICByZWZyZXNoU2Vzc2lvbldpdGhJZnJhbWUoXHJcbiAgICBjb25maWc6IE9wZW5JZENvbmZpZ3VyYXRpb24sXHJcbiAgICBhbGxDb25maWdzOiBPcGVuSWRDb25maWd1cmF0aW9uW10sXHJcbiAgICBjdXN0b21QYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfVxyXG4gICk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZywgJ0JFR0lOIHJlZnJlc2ggc2Vzc2lvbiBBdXRob3JpemUgSWZyYW1lIHJlbmV3Jyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMudXJsU2VydmljZS5nZXRSZWZyZXNoU2Vzc2lvblNpbGVudFJlbmV3VXJsKGNvbmZpZywgY3VzdG9tUGFyYW1zKS5waXBlKFxyXG4gICAgICBzd2l0Y2hNYXAoKHVybCkgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlbmRBdXRob3JpemVSZXF1ZXN0VXNpbmdTaWxlbnRSZW5ldyh1cmwsIGNvbmZpZywgYWxsQ29uZmlncyk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZW5kQXV0aG9yaXplUmVxdWVzdFVzaW5nU2lsZW50UmVuZXcoXHJcbiAgICB1cmw6IHN0cmluZyxcclxuICAgIGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIGFsbENvbmZpZ3M6IE9wZW5JZENvbmZpZ3VyYXRpb25bXVxyXG4gICk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgY29uc3Qgc2Vzc2lvbklmcmFtZSA9IHRoaXMuc2lsZW50UmVuZXdTZXJ2aWNlLmdldE9yQ3JlYXRlSWZyYW1lKGNvbmZpZyk7XHJcblxyXG4gICAgdGhpcy5pbml0U2lsZW50UmVuZXdSZXF1ZXN0KGNvbmZpZywgYWxsQ29uZmlncyk7XHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlnLCAnc2VuZEF1dGhvcml6ZVJlcXVlc3RVc2luZ1NpbGVudFJlbmV3IGZvciBVUkw6JyArIHVybCk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcikgPT4ge1xyXG4gICAgICBjb25zdCBvbkxvYWRIYW5kbGVyID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIHNlc3Npb25JZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uTG9hZEhhbmRsZXIpO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWcsICdyZW1vdmVkIGV2ZW50IGxpc3RlbmVyIGZyb20gSUZyYW1lJyk7XHJcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCh0cnVlKTtcclxuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgc2Vzc2lvbklmcmFtZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkSGFuZGxlcik7XHJcbiAgICAgIHNlc3Npb25JZnJhbWUuY29udGVudFdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHVybCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdFNpbGVudFJlbmV3UmVxdWVzdChjb25maWc6IE9wZW5JZENvbmZpZ3VyYXRpb24sIGFsbENvbmZpZ3M6IE9wZW5JZENvbmZpZ3VyYXRpb25bXSk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2VJZCA9IE1hdGgucmFuZG9tKCk7XHJcblxyXG4gICAgY29uc3QgaW5pdERlc3Ryb3lIYW5kbGVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ3dpbmRvdycsICdvaWRjLXNpbGVudC1yZW5ldy1pbml0JywgKGU6IEN1c3RvbUV2ZW50KSA9PiB7XHJcbiAgICAgIGlmIChlLmRldGFpbCAhPT0gaW5zdGFuY2VJZCkge1xyXG4gICAgICAgIGluaXREZXN0cm95SGFuZGxlcigpO1xyXG4gICAgICAgIHJlbmV3RGVzdHJveUhhbmRsZXIoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCByZW5ld0Rlc3Ryb3lIYW5kbGVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ3dpbmRvdycsICdvaWRjLXNpbGVudC1yZW5ldy1tZXNzYWdlJywgKGUpID0+XHJcbiAgICAgIHRoaXMuc2lsZW50UmVuZXdTZXJ2aWNlLnNpbGVudFJlbmV3RXZlbnRIYW5kbGVyKGUsIGNvbmZpZywgYWxsQ29uZmlncylcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5kb2N1bWVudC5kZWZhdWx0Vmlldy5kaXNwYXRjaEV2ZW50KFxyXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoJ29pZGMtc2lsZW50LXJlbmV3LWluaXQnLCB7XHJcbiAgICAgICAgZGV0YWlsOiBpbnN0YW5jZUlkLFxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19