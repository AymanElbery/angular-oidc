import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../flows/flows.service";
import * as i2 from "@angular/router";
import * as i3 from "../flows/flows-data.service";
import * as i4 from "./interval.service";
export class ImplicitFlowCallbackService {
    constructor(flowsService, router, flowsDataService, intervalService) {
        this.flowsService = flowsService;
        this.router = router;
        this.flowsDataService = flowsDataService;
        this.intervalService = intervalService;
    }
    authenticatedImplicitFlowCallback(config, allConfigs, hash) {
        const isRenewProcess = this.flowsDataService.isSilentRenewRunning(config);
        const { triggerAuthorizationResultEvent, postLoginRoute, unauthorizedRoute } = config;
        return this.flowsService.processImplicitFlowCallback(config, allConfigs, hash).pipe(tap((callbackContext) => {
            if (!triggerAuthorizationResultEvent && !callbackContext.isRenewProcess) {
                this.router.navigateByUrl(postLoginRoute);
            }
        }), catchError((error) => {
            this.flowsDataService.resetSilentRenewRunning(config);
            this.intervalService.stopPeriodicTokenCheck();
            if (!triggerAuthorizationResultEvent && !isRenewProcess) {
                this.router.navigateByUrl(unauthorizedRoute);
            }
            return throwError(() => new Error(error));
        }));
    }
}
ImplicitFlowCallbackService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ImplicitFlowCallbackService, deps: [{ token: i1.FlowsService }, { token: i2.Router }, { token: i3.FlowsDataService }, { token: i4.IntervalService }], target: i0.ɵɵFactoryTarget.Injectable });
ImplicitFlowCallbackService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ImplicitFlowCallbackService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ImplicitFlowCallbackService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.FlowsService }, { type: i2.Router }, { type: i3.FlowsDataService }, { type: i4.IntervalService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wbGljaXQtZmxvdy1jYWxsYmFjay5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy9saWIvY2FsbGJhY2svaW1wbGljaXQtZmxvdy1jYWxsYmFjay5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFjLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7QUFRakQsTUFBTSxPQUFPLDJCQUEyQjtJQUN0QyxZQUNtQixZQUEwQixFQUMxQixNQUFjLEVBQ2QsZ0JBQWtDLEVBQ2xDLGVBQWdDO1FBSGhDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtJQUNoRCxDQUFDO0lBRUosaUNBQWlDLENBQy9CLE1BQTJCLEVBQzNCLFVBQWlDLEVBQ2pDLElBQWE7UUFFYixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUUsTUFBTSxFQUFFLCtCQUErQixFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxHQUFHLE1BQU0sQ0FBQztRQUV0RixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsMkJBQTJCLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQ2pGLEdBQUcsQ0FBQyxDQUFDLGVBQWUsRUFBRSxFQUFFO1lBQ3RCLElBQUksQ0FBQywrQkFBK0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEVBQUU7Z0JBQ3ZFLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQzNDO1FBQ0gsQ0FBQyxDQUFDLEVBQ0YsVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDbkIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QyxJQUFJLENBQUMsK0JBQStCLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7YUFDOUM7WUFFRCxPQUFPLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDOzt3SEFoQ1UsMkJBQTJCOzRIQUEzQiwyQkFBMkIsY0FEZCxNQUFNOzJGQUNuQiwyQkFBMkI7a0JBRHZDLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IENhbGxiYWNrQ29udGV4dCB9IGZyb20gJy4uL2Zsb3dzL2NhbGxiYWNrLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBGbG93c0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZmxvd3MvZmxvd3MtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmxvd3NTZXJ2aWNlIH0gZnJvbSAnLi4vZmxvd3MvZmxvd3Muc2VydmljZSc7XHJcbmltcG9ydCB7IEludGVydmFsU2VydmljZSB9IGZyb20gJy4vaW50ZXJ2YWwuc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgSW1wbGljaXRGbG93Q2FsbGJhY2tTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmxvd3NTZXJ2aWNlOiBGbG93c1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlcjogUm91dGVyLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBmbG93c0RhdGFTZXJ2aWNlOiBGbG93c0RhdGFTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBpbnRlcnZhbFNlcnZpY2U6IEludGVydmFsU2VydmljZVxyXG4gICkge31cclxuXHJcbiAgYXV0aGVudGljYXRlZEltcGxpY2l0Rmxvd0NhbGxiYWNrKFxyXG4gICAgY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uLFxyXG4gICAgYWxsQ29uZmlnczogT3BlbklkQ29uZmlndXJhdGlvbltdLFxyXG4gICAgaGFzaD86IHN0cmluZ1xyXG4gICk6IE9ic2VydmFibGU8Q2FsbGJhY2tDb250ZXh0PiB7XHJcbiAgICBjb25zdCBpc1JlbmV3UHJvY2VzcyA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5pc1NpbGVudFJlbmV3UnVubmluZyhjb25maWcpO1xyXG4gICAgY29uc3QgeyB0cmlnZ2VyQXV0aG9yaXphdGlvblJlc3VsdEV2ZW50LCBwb3N0TG9naW5Sb3V0ZSwgdW5hdXRob3JpemVkUm91dGUgfSA9IGNvbmZpZztcclxuXHJcbiAgICByZXR1cm4gdGhpcy5mbG93c1NlcnZpY2UucHJvY2Vzc0ltcGxpY2l0Rmxvd0NhbGxiYWNrKGNvbmZpZywgYWxsQ29uZmlncywgaGFzaCkucGlwZShcclxuICAgICAgdGFwKChjYWxsYmFja0NvbnRleHQpID0+IHtcclxuICAgICAgICBpZiAoIXRyaWdnZXJBdXRob3JpemF0aW9uUmVzdWx0RXZlbnQgJiYgIWNhbGxiYWNrQ29udGV4dC5pc1JlbmV3UHJvY2Vzcykge1xyXG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybChwb3N0TG9naW5Sb3V0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KSxcclxuICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcclxuICAgICAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2UucmVzZXRTaWxlbnRSZW5ld1J1bm5pbmcoY29uZmlnKTtcclxuICAgICAgICB0aGlzLmludGVydmFsU2VydmljZS5zdG9wUGVyaW9kaWNUb2tlbkNoZWNrKCk7XHJcbiAgICAgICAgaWYgKCF0cmlnZ2VyQXV0aG9yaXphdGlvblJlc3VsdEV2ZW50ICYmICFpc1JlbmV3UHJvY2Vzcykge1xyXG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybCh1bmF1dGhvcml6ZWRSb3V0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcigoKSA9PiBuZXcgRXJyb3IoZXJyb3IpKTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiJdfQ==