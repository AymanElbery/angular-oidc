import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { EventTypes } from '../public-events/event-types';
import * as i0 from "@angular/core";
import * as i1 from "../storage/storage-persistence.service";
import * as i2 from "../logging/logger.service";
import * as i3 from "./existing-iframe.service";
import * as i4 from "../public-events/public-events.service";
const IFRAME_FOR_CHECK_SESSION_IDENTIFIER = 'myiFrameForCheckSession';
// http://openid.net/specs/openid-connect-session-1_0-ID4.html
export class CheckSessionService {
    constructor(storagePersistenceService, loggerService, iFrameService, eventService, zone, document) {
        this.storagePersistenceService = storagePersistenceService;
        this.loggerService = loggerService;
        this.iFrameService = iFrameService;
        this.eventService = eventService;
        this.zone = zone;
        this.document = document;
        this.checkSessionReceived = false;
        this.lastIFrameRefresh = 0;
        this.outstandingMessages = 0;
        this.heartBeatInterval = 3000;
        this.iframeRefreshInterval = 60000;
        this.checkSessionChangedInternal$ = new BehaviorSubject(false);
    }
    get checkSessionChanged$() {
        return this.checkSessionChangedInternal$.asObservable();
    }
    isCheckSessionConfigured(configuration) {
        const { startCheckSession } = configuration;
        return startCheckSession;
    }
    start(configuration) {
        if (!!this.scheduledHeartBeatRunning) {
            return;
        }
        const { clientId } = configuration;
        this.pollServerSession(clientId, configuration);
    }
    stop() {
        if (!this.scheduledHeartBeatRunning) {
            return;
        }
        this.clearScheduledHeartBeat();
        this.checkSessionReceived = false;
    }
    serverStateChanged(configuration) {
        const { startCheckSession } = configuration;
        return startCheckSession && this.checkSessionReceived;
    }
    getExistingIframe() {
        return this.iFrameService.getExistingIFrame(IFRAME_FOR_CHECK_SESSION_IDENTIFIER);
    }
    init(configuration) {
        if (this.lastIFrameRefresh + this.iframeRefreshInterval > Date.now()) {
            return of(undefined);
        }
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints', configuration);
        if (!authWellKnownEndPoints) {
            this.loggerService.logWarning(configuration, 'CheckSession - init check session: authWellKnownEndpoints is undefined. Returning.');
            return of();
        }
        const existingIframe = this.getOrCreateIframe(configuration);
        const checkSessionIframe = authWellKnownEndPoints.checkSessionIframe;
        if (checkSessionIframe) {
            existingIframe.contentWindow.location.replace(checkSessionIframe);
        }
        else {
            this.loggerService.logWarning(configuration, 'CheckSession - init check session: checkSessionIframe is not configured to run');
        }
        return new Observable((observer) => {
            existingIframe.onload = () => {
                this.lastIFrameRefresh = Date.now();
                observer.next();
                observer.complete();
            };
        });
    }
    pollServerSession(clientId, configuration) {
        this.outstandingMessages = 0;
        const pollServerSessionRecur = () => {
            this.init(configuration)
                .pipe(take(1))
                .subscribe(() => {
                const existingIframe = this.getExistingIframe();
                if (existingIframe && clientId) {
                    this.loggerService.logDebug(configuration, `CheckSession - clientId : '${clientId}' - existingIframe: '${existingIframe}'`);
                    const sessionState = this.storagePersistenceService.read('session_state', configuration);
                    const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints', configuration);
                    if (sessionState && authWellKnownEndPoints?.checkSessionIframe) {
                        const iframeOrigin = new URL(authWellKnownEndPoints.checkSessionIframe)?.origin;
                        this.outstandingMessages++;
                        existingIframe.contentWindow.postMessage(clientId + ' ' + sessionState, iframeOrigin);
                    }
                    else {
                        this.loggerService.logDebug(configuration, `CheckSession - session_state is '${sessionState}' - AuthWellKnownEndPoints is '${JSON.stringify(authWellKnownEndPoints, null, 2)}'`);
                        this.checkSessionChangedInternal$.next(true);
                    }
                }
                else {
                    this.loggerService.logWarning(configuration, `CheckSession - OidcSecurityCheckSession pollServerSession checkSession IFrame does not exist:
               clientId : '${clientId}' - existingIframe: '${existingIframe}'`);
                }
                // after sending three messages with no response, fail.
                if (this.outstandingMessages > 3) {
                    this.loggerService.logError(configuration, `CheckSession - OidcSecurityCheckSession not receiving check session response messages.
                            Outstanding messages: '${this.outstandingMessages}'. Server unreachable?`);
                }
                this.zone.runOutsideAngular(() => {
                    this.scheduledHeartBeatRunning = setTimeout(() => this.zone.run(pollServerSessionRecur), this.heartBeatInterval);
                });
            });
        };
        pollServerSessionRecur();
    }
    clearScheduledHeartBeat() {
        clearTimeout(this.scheduledHeartBeatRunning);
        this.scheduledHeartBeatRunning = null;
    }
    messageHandler(configuration, e) {
        const existingIFrame = this.getExistingIframe();
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints', configuration);
        const startsWith = !!authWellKnownEndPoints?.checkSessionIframe?.startsWith(e.origin);
        this.outstandingMessages = 0;
        if (existingIFrame && startsWith && e.source === existingIFrame.contentWindow) {
            if (e.data === 'error') {
                this.loggerService.logWarning(configuration, 'CheckSession - error from check session messageHandler');
            }
            else if (e.data === 'changed') {
                this.loggerService.logDebug(configuration, `CheckSession - ${e} from check session messageHandler`);
                this.checkSessionReceived = true;
                this.eventService.fireEvent(EventTypes.CheckSessionReceived, e.data);
                this.checkSessionChangedInternal$.next(true);
            }
            else {
                this.eventService.fireEvent(EventTypes.CheckSessionReceived, e.data);
                this.loggerService.logDebug(configuration, `CheckSession - ${e.data} from check session messageHandler`);
            }
        }
    }
    bindMessageEventToIframe(configuration) {
        const iframeMessageEvent = this.messageHandler.bind(this, configuration);
        this.document.defaultView.addEventListener('message', iframeMessageEvent, false);
    }
    getOrCreateIframe(configuration) {
        const existingIframe = this.getExistingIframe();
        if (!existingIframe) {
            const frame = this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_CHECK_SESSION_IDENTIFIER, configuration);
            this.bindMessageEventToIframe(configuration);
            return frame;
        }
        return existingIframe;
    }
}
CheckSessionService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CheckSessionService, deps: [{ token: i1.StoragePersistenceService }, { token: i2.LoggerService }, { token: i3.IFrameService }, { token: i4.PublicEventsService }, { token: i0.NgZone }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
CheckSessionService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CheckSessionService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CheckSessionService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.StoragePersistenceService }, { type: i2.LoggerService }, { type: i3.IFrameService }, { type: i4.PublicEventsService }, { type: i0.NgZone }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stc2Vzc2lvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy9saWIvaWZyYW1lL2NoZWNrLXNlc3Npb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3ZELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sOEJBQThCLENBQUM7Ozs7OztBQU0xRCxNQUFNLG1DQUFtQyxHQUFHLHlCQUF5QixDQUFDO0FBRXRFLDhEQUE4RDtBQUc5RCxNQUFNLE9BQU8sbUJBQW1CO0lBbUI5QixZQUNtQix5QkFBb0QsRUFDcEQsYUFBNEIsRUFDNUIsYUFBNEIsRUFDNUIsWUFBaUMsRUFDakMsSUFBWSxFQUNNLFFBQWtCO1FBTHBDLDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBMkI7UUFDcEQsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsaUJBQVksR0FBWixZQUFZLENBQXFCO1FBQ2pDLFNBQUksR0FBSixJQUFJLENBQVE7UUFDTSxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBeEIvQyx5QkFBb0IsR0FBRyxLQUFLLENBQUM7UUFJN0Isc0JBQWlCLEdBQUcsQ0FBQyxDQUFDO1FBRXRCLHdCQUFtQixHQUFHLENBQUMsQ0FBQztRQUVmLHNCQUFpQixHQUFHLElBQUksQ0FBQztRQUV6QiwwQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFFOUIsaUNBQTRC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SyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsbUNBQW1DLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFFM0csSUFBSSxDQUFDLHdCQUF3QixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTdDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDOztnSEFuTVUsbUJBQW1CLDhLQXlCcEIsUUFBUTtvSEF6QlAsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBRC9CLFVBQVU7OzBCQTBCTixNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFdmVudFR5cGVzIH0gZnJvbSAnLi4vcHVibGljLWV2ZW50cy9ldmVudC10eXBlcyc7XHJcbmltcG9ydCB7IFB1YmxpY0V2ZW50c1NlcnZpY2UgfSBmcm9tICcuLi9wdWJsaWMtZXZlbnRzL3B1YmxpYy1ldmVudHMuc2VydmljZSc7XHJcbmltcG9ydCB7IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UgfSBmcm9tICcuLi9zdG9yYWdlL3N0b3JhZ2UtcGVyc2lzdGVuY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IElGcmFtZVNlcnZpY2UgfSBmcm9tICcuL2V4aXN0aW5nLWlmcmFtZS5zZXJ2aWNlJztcclxuXHJcbmNvbnN0IElGUkFNRV9GT1JfQ0hFQ0tfU0VTU0lPTl9JREVOVElGSUVSID0gJ215aUZyYW1lRm9yQ2hlY2tTZXNzaW9uJztcclxuXHJcbi8vIGh0dHA6Ly9vcGVuaWQubmV0L3NwZWNzL29wZW5pZC1jb25uZWN0LXNlc3Npb24tMV8wLUlENC5odG1sXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDaGVja1Nlc3Npb25TZXJ2aWNlIHtcclxuICBwcml2YXRlIGNoZWNrU2Vzc2lvblJlY2VpdmVkID0gZmFsc2U7XHJcblxyXG4gIHByaXZhdGUgc2NoZWR1bGVkSGVhcnRCZWF0UnVubmluZzogYW55O1xyXG5cclxuICBwcml2YXRlIGxhc3RJRnJhbWVSZWZyZXNoID0gMDtcclxuXHJcbiAgcHJpdmF0ZSBvdXRzdGFuZGluZ01lc3NhZ2VzID0gMDtcclxuXHJcbiAgcHJpdmF0ZSByZWFkb25seSBoZWFydEJlYXRJbnRlcnZhbCA9IDMwMDA7XHJcblxyXG4gIHByaXZhdGUgcmVhZG9ubHkgaWZyYW1lUmVmcmVzaEludGVydmFsID0gNjAwMDA7XHJcblxyXG4gIHByaXZhdGUgcmVhZG9ubHkgY2hlY2tTZXNzaW9uQ2hhbmdlZEludGVybmFsJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xyXG5cclxuICBnZXQgY2hlY2tTZXNzaW9uQ2hhbmdlZCQoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XHJcbiAgICByZXR1cm4gdGhpcy5jaGVja1Nlc3Npb25DaGFuZ2VkSW50ZXJuYWwkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2U6IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGlGcmFtZVNlcnZpY2U6IElGcmFtZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGV2ZW50U2VydmljZTogUHVibGljRXZlbnRzU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgem9uZTogTmdab25lLFxyXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSByZWFkb25seSBkb2N1bWVudDogRG9jdW1lbnRcclxuICApIHt9XHJcblxyXG4gIGlzQ2hlY2tTZXNzaW9uQ29uZmlndXJlZChjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCB7IHN0YXJ0Q2hlY2tTZXNzaW9uIH0gPSBjb25maWd1cmF0aW9uO1xyXG5cclxuICAgIHJldHVybiBzdGFydENoZWNrU2Vzc2lvbjtcclxuICB9XHJcblxyXG4gIHN0YXJ0KGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiB2b2lkIHtcclxuICAgIGlmICghIXRoaXMuc2NoZWR1bGVkSGVhcnRCZWF0UnVubmluZykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgeyBjbGllbnRJZCB9ID0gY29uZmlndXJhdGlvbjtcclxuXHJcbiAgICB0aGlzLnBvbGxTZXJ2ZXJTZXNzaW9uKGNsaWVudElkLCBjb25maWd1cmF0aW9uKTtcclxuICB9XHJcblxyXG4gIHN0b3AoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuc2NoZWR1bGVkSGVhcnRCZWF0UnVubmluZykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jbGVhclNjaGVkdWxlZEhlYXJ0QmVhdCgpO1xyXG4gICAgdGhpcy5jaGVja1Nlc3Npb25SZWNlaXZlZCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgc2VydmVyU3RhdGVDaGFuZ2VkKGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHsgc3RhcnRDaGVja1Nlc3Npb24gfSA9IGNvbmZpZ3VyYXRpb247XHJcblxyXG4gICAgcmV0dXJuIHN0YXJ0Q2hlY2tTZXNzaW9uICYmIHRoaXMuY2hlY2tTZXNzaW9uUmVjZWl2ZWQ7XHJcbiAgfVxyXG5cclxuICBnZXRFeGlzdGluZ0lmcmFtZSgpOiBIVE1MSUZyYW1lRWxlbWVudCB7XHJcbiAgICByZXR1cm4gdGhpcy5pRnJhbWVTZXJ2aWNlLmdldEV4aXN0aW5nSUZyYW1lKElGUkFNRV9GT1JfQ0hFQ0tfU0VTU0lPTl9JREVOVElGSUVSKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdChjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGlmICh0aGlzLmxhc3RJRnJhbWVSZWZyZXNoICsgdGhpcy5pZnJhbWVSZWZyZXNoSW50ZXJ2YWwgPiBEYXRlLm5vdygpKSB7XHJcbiAgICAgIHJldHVybiBvZih1bmRlZmluZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGF1dGhXZWxsS25vd25FbmRQb2ludHMgPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnYXV0aFdlbGxLbm93bkVuZFBvaW50cycsIGNvbmZpZ3VyYXRpb24pO1xyXG5cclxuICAgIGlmICghYXV0aFdlbGxLbm93bkVuZFBvaW50cykge1xyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyhjb25maWd1cmF0aW9uLCAnQ2hlY2tTZXNzaW9uIC0gaW5pdCBjaGVjayBzZXNzaW9uOiBhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZC4gUmV0dXJuaW5nLicpO1xyXG5cclxuICAgICAgcmV0dXJuIG9mKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZXhpc3RpbmdJZnJhbWUgPSB0aGlzLmdldE9yQ3JlYXRlSWZyYW1lKGNvbmZpZ3VyYXRpb24pO1xyXG4gICAgY29uc3QgY2hlY2tTZXNzaW9uSWZyYW1lID0gYXV0aFdlbGxLbm93bkVuZFBvaW50cy5jaGVja1Nlc3Npb25JZnJhbWU7XHJcblxyXG4gICAgaWYgKGNoZWNrU2Vzc2lvbklmcmFtZSkge1xyXG4gICAgICBleGlzdGluZ0lmcmFtZS5jb250ZW50V2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2hlY2tTZXNzaW9uSWZyYW1lKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKGNvbmZpZ3VyYXRpb24sICdDaGVja1Nlc3Npb24gLSBpbml0IGNoZWNrIHNlc3Npb246IGNoZWNrU2Vzc2lvbklmcmFtZSBpcyBub3QgY29uZmlndXJlZCB0byBydW4nKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyKSA9PiB7XHJcbiAgICAgIGV4aXN0aW5nSWZyYW1lLm9ubG9hZCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICB0aGlzLmxhc3RJRnJhbWVSZWZyZXNoID0gRGF0ZS5ub3coKTtcclxuICAgICAgICBvYnNlcnZlci5uZXh0KCk7XHJcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwb2xsU2VydmVyU2Vzc2lvbihjbGllbnRJZDogc3RyaW5nLCBjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uKTogdm9pZCB7XHJcbiAgICB0aGlzLm91dHN0YW5kaW5nTWVzc2FnZXMgPSAwO1xyXG5cclxuICAgIGNvbnN0IHBvbGxTZXJ2ZXJTZXNzaW9uUmVjdXIgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuaW5pdChjb25maWd1cmF0aW9uKVxyXG4gICAgICAgIC5waXBlKHRha2UoMSkpXHJcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBleGlzdGluZ0lmcmFtZSA9IHRoaXMuZ2V0RXhpc3RpbmdJZnJhbWUoKTtcclxuXHJcbiAgICAgICAgICBpZiAoZXhpc3RpbmdJZnJhbWUgJiYgY2xpZW50SWQpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZ3VyYXRpb24sIGBDaGVja1Nlc3Npb24gLSBjbGllbnRJZCA6ICcke2NsaWVudElkfScgLSBleGlzdGluZ0lmcmFtZTogJyR7ZXhpc3RpbmdJZnJhbWV9J2ApO1xyXG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uU3RhdGUgPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnc2Vzc2lvbl9zdGF0ZScsIGNvbmZpZ3VyYXRpb24pO1xyXG4gICAgICAgICAgICBjb25zdCBhdXRoV2VsbEtub3duRW5kUG9pbnRzID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnLCBjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZXNzaW9uU3RhdGUgJiYgYXV0aFdlbGxLbm93bkVuZFBvaW50cz8uY2hlY2tTZXNzaW9uSWZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgaWZyYW1lT3JpZ2luID0gbmV3IFVSTChhdXRoV2VsbEtub3duRW5kUG9pbnRzLmNoZWNrU2Vzc2lvbklmcmFtZSk/Lm9yaWdpbjtcclxuXHJcbiAgICAgICAgICAgICAgdGhpcy5vdXRzdGFuZGluZ01lc3NhZ2VzKys7XHJcbiAgICAgICAgICAgICAgZXhpc3RpbmdJZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZShjbGllbnRJZCArICcgJyArIHNlc3Npb25TdGF0ZSwgaWZyYW1lT3JpZ2luKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uLFxyXG4gICAgICAgICAgICAgICAgYENoZWNrU2Vzc2lvbiAtIHNlc3Npb25fc3RhdGUgaXMgJyR7c2Vzc2lvblN0YXRlfScgLSBBdXRoV2VsbEtub3duRW5kUG9pbnRzIGlzICcke0pTT04uc3RyaW5naWZ5KFxyXG4gICAgICAgICAgICAgICAgICBhdXRoV2VsbEtub3duRW5kUG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAyXHJcbiAgICAgICAgICAgICAgICApfSdgXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICB0aGlzLmNoZWNrU2Vzc2lvbkNoYW5nZWRJbnRlcm5hbCQubmV4dCh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoXHJcbiAgICAgICAgICAgICAgY29uZmlndXJhdGlvbixcclxuICAgICAgICAgICAgICBgQ2hlY2tTZXNzaW9uIC0gT2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uIHBvbGxTZXJ2ZXJTZXNzaW9uIGNoZWNrU2Vzc2lvbiBJRnJhbWUgZG9lcyBub3QgZXhpc3Q6XHJcbiAgICAgICAgICAgICAgIGNsaWVudElkIDogJyR7Y2xpZW50SWR9JyAtIGV4aXN0aW5nSWZyYW1lOiAnJHtleGlzdGluZ0lmcmFtZX0nYFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIGFmdGVyIHNlbmRpbmcgdGhyZWUgbWVzc2FnZXMgd2l0aCBubyByZXNwb25zZSwgZmFpbC5cclxuICAgICAgICAgIGlmICh0aGlzLm91dHN0YW5kaW5nTWVzc2FnZXMgPiAzKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihcclxuICAgICAgICAgICAgICBjb25maWd1cmF0aW9uLFxyXG4gICAgICAgICAgICAgIGBDaGVja1Nlc3Npb24gLSBPaWRjU2VjdXJpdHlDaGVja1Nlc3Npb24gbm90IHJlY2VpdmluZyBjaGVjayBzZXNzaW9uIHJlc3BvbnNlIG1lc3NhZ2VzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT3V0c3RhbmRpbmcgbWVzc2FnZXM6ICcke3RoaXMub3V0c3RhbmRpbmdNZXNzYWdlc30nLiBTZXJ2ZXIgdW5yZWFjaGFibGU/YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkSGVhcnRCZWF0UnVubmluZyA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy56b25lLnJ1bihwb2xsU2VydmVyU2Vzc2lvblJlY3VyKSwgdGhpcy5oZWFydEJlYXRJbnRlcnZhbCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgcG9sbFNlcnZlclNlc3Npb25SZWN1cigpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjbGVhclNjaGVkdWxlZEhlYXJ0QmVhdCgpOiB2b2lkIHtcclxuICAgIGNsZWFyVGltZW91dCh0aGlzLnNjaGVkdWxlZEhlYXJ0QmVhdFJ1bm5pbmcpO1xyXG4gICAgdGhpcy5zY2hlZHVsZWRIZWFydEJlYXRSdW5uaW5nID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWVzc2FnZUhhbmRsZXIoY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbiwgZTogYW55KTogdm9pZCB7XHJcbiAgICBjb25zdCBleGlzdGluZ0lGcmFtZSA9IHRoaXMuZ2V0RXhpc3RpbmdJZnJhbWUoKTtcclxuICAgIGNvbnN0IGF1dGhXZWxsS25vd25FbmRQb2ludHMgPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnYXV0aFdlbGxLbm93bkVuZFBvaW50cycsIGNvbmZpZ3VyYXRpb24pO1xyXG4gICAgY29uc3Qgc3RhcnRzV2l0aCA9ICEhYXV0aFdlbGxLbm93bkVuZFBvaW50cz8uY2hlY2tTZXNzaW9uSWZyYW1lPy5zdGFydHNXaXRoKGUub3JpZ2luKTtcclxuXHJcbiAgICB0aGlzLm91dHN0YW5kaW5nTWVzc2FnZXMgPSAwO1xyXG5cclxuICAgIGlmIChleGlzdGluZ0lGcmFtZSAmJiBzdGFydHNXaXRoICYmIGUuc291cmNlID09PSBleGlzdGluZ0lGcmFtZS5jb250ZW50V2luZG93KSB7XHJcbiAgICAgIGlmIChlLmRhdGEgPT09ICdlcnJvcicpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyhjb25maWd1cmF0aW9uLCAnQ2hlY2tTZXNzaW9uIC0gZXJyb3IgZnJvbSBjaGVjayBzZXNzaW9uIG1lc3NhZ2VIYW5kbGVyJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZS5kYXRhID09PSAnY2hhbmdlZCcpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlndXJhdGlvbiwgYENoZWNrU2Vzc2lvbiAtICR7ZX0gZnJvbSBjaGVjayBzZXNzaW9uIG1lc3NhZ2VIYW5kbGVyYCk7XHJcbiAgICAgICAgdGhpcy5jaGVja1Nlc3Npb25SZWNlaXZlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ldmVudFNlcnZpY2UuZmlyZUV2ZW50KEV2ZW50VHlwZXMuQ2hlY2tTZXNzaW9uUmVjZWl2ZWQsIGUuZGF0YSk7XHJcbiAgICAgICAgdGhpcy5jaGVja1Nlc3Npb25DaGFuZ2VkSW50ZXJuYWwkLm5leHQodHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5ldmVudFNlcnZpY2UuZmlyZUV2ZW50KEV2ZW50VHlwZXMuQ2hlY2tTZXNzaW9uUmVjZWl2ZWQsIGUuZGF0YSk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZ3VyYXRpb24sIGBDaGVja1Nlc3Npb24gLSAke2UuZGF0YX0gZnJvbSBjaGVjayBzZXNzaW9uIG1lc3NhZ2VIYW5kbGVyYCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYmluZE1lc3NhZ2VFdmVudFRvSWZyYW1lKGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiB2b2lkIHtcclxuICAgIGNvbnN0IGlmcmFtZU1lc3NhZ2VFdmVudCA9IHRoaXMubWVzc2FnZUhhbmRsZXIuYmluZCh0aGlzLCBjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBpZnJhbWVNZXNzYWdlRXZlbnQsIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0T3JDcmVhdGVJZnJhbWUoY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbik6IEhUTUxJRnJhbWVFbGVtZW50IHtcclxuICAgIGNvbnN0IGV4aXN0aW5nSWZyYW1lID0gdGhpcy5nZXRFeGlzdGluZ0lmcmFtZSgpO1xyXG5cclxuICAgIGlmICghZXhpc3RpbmdJZnJhbWUpIHtcclxuICAgICAgY29uc3QgZnJhbWUgPSB0aGlzLmlGcmFtZVNlcnZpY2UuYWRkSUZyYW1lVG9XaW5kb3dCb2R5KElGUkFNRV9GT1JfQ0hFQ0tfU0VTU0lPTl9JREVOVElGSUVSLCBjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICAgIHRoaXMuYmluZE1lc3NhZ2VFdmVudFRvSWZyYW1lKGNvbmZpZ3VyYXRpb24pO1xyXG5cclxuICAgICAgcmV0dXJuIGZyYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBleGlzdGluZ0lmcmFtZTtcclxuICB9XHJcbn1cclxuIl19