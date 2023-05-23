import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../flows/flows.service";
import * as i2 from "../flows/flows-data.service";
import * as i3 from "./interval.service";
import * as i4 from "@angular/router";
export class CodeFlowCallbackService {
    constructor(flowsService, flowsDataService, intervalService, router) {
        this.flowsService = flowsService;
        this.flowsDataService = flowsDataService;
        this.intervalService = intervalService;
        this.router = router;
    }
    authenticatedCallbackWithCode(urlToCheck, config, allConfigs) {
        const isRenewProcess = this.flowsDataService.isSilentRenewRunning(config);
        const { triggerAuthorizationResultEvent, postLoginRoute, unauthorizedRoute } = config;
        return this.flowsService.processCodeFlowCallback(urlToCheck, config, allConfigs).pipe(tap((callbackContext) => {
            this.flowsDataService.resetCodeFlowInProgress(config);
            if (!triggerAuthorizationResultEvent && !callbackContext.isRenewProcess) {
                this.router.navigateByUrl(postLoginRoute);
            }
        }), catchError((error) => {
            this.flowsDataService.resetSilentRenewRunning(config);
            this.flowsDataService.resetCodeFlowInProgress(config);
            this.intervalService.stopPeriodicTokenCheck();
            if (!triggerAuthorizationResultEvent && !isRenewProcess) {
                this.router.navigateByUrl(unauthorizedRoute);
            }
            return throwError(() => new Error(error));
        }));
    }
}
CodeFlowCallbackService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CodeFlowCallbackService, deps: [{ token: i1.FlowsService }, { token: i2.FlowsDataService }, { token: i3.IntervalService }, { token: i4.Router }], target: i0.ɵɵFactoryTarget.Injectable });
CodeFlowCallbackService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CodeFlowCallbackService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CodeFlowCallbackService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.FlowsService }, { type: i2.FlowsDataService }, { type: i3.IntervalService }, { type: i4.Router }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS1mbG93LWNhbGxiYWNrLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9jYWxsYmFjay9jb2RlLWZsb3ctY2FsbGJhY2suc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBYyxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7O0FBUWpELE1BQU0sT0FBTyx1QkFBdUI7SUFDbEMsWUFDbUIsWUFBMEIsRUFDMUIsZ0JBQWtDLEVBQ2xDLGVBQWdDLEVBQ2hDLE1BQWM7UUFIZCxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQzlCLENBQUM7SUFFSiw2QkFBNkIsQ0FDM0IsVUFBa0IsRUFDbEIsTUFBMkIsRUFDM0IsVUFBaUM7UUFFakMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFFLE1BQU0sRUFBRSwrQkFBK0IsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxNQUFNLENBQUM7UUFFdEYsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUNuRixHQUFHLENBQUMsQ0FBQyxlQUFlLEVBQUUsRUFBRTtZQUN0QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLCtCQUErQixJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRTtnQkFDdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7YUFDM0M7UUFDSCxDQUFDLENBQUMsRUFDRixVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNuQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QyxJQUFJLENBQUMsK0JBQStCLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7YUFDOUM7WUFFRCxPQUFPLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDOztvSEFsQ1UsdUJBQXVCO3dIQUF2Qix1QkFBdUIsY0FEVixNQUFNOzJGQUNuQix1QkFBdUI7a0JBRG5DLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IENhbGxiYWNrQ29udGV4dCB9IGZyb20gJy4uL2Zsb3dzL2NhbGxiYWNrLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBGbG93c0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZmxvd3MvZmxvd3MtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmxvd3NTZXJ2aWNlIH0gZnJvbSAnLi4vZmxvd3MvZmxvd3Muc2VydmljZSc7XHJcbmltcG9ydCB7IEludGVydmFsU2VydmljZSB9IGZyb20gJy4vaW50ZXJ2YWwuc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgQ29kZUZsb3dDYWxsYmFja1NlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBmbG93c1NlcnZpY2U6IEZsb3dzU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmxvd3NEYXRhU2VydmljZTogRmxvd3NEYXRhU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgaW50ZXJ2YWxTZXJ2aWNlOiBJbnRlcnZhbFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlcjogUm91dGVyXHJcbiAgKSB7fVxyXG5cclxuICBhdXRoZW50aWNhdGVkQ2FsbGJhY2tXaXRoQ29kZShcclxuICAgIHVybFRvQ2hlY2s6IHN0cmluZyxcclxuICAgIGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIGFsbENvbmZpZ3M6IE9wZW5JZENvbmZpZ3VyYXRpb25bXVxyXG4gICk6IE9ic2VydmFibGU8Q2FsbGJhY2tDb250ZXh0PiB7XHJcbiAgICBjb25zdCBpc1JlbmV3UHJvY2VzcyA9IHRoaXMuZmxvd3NEYXRhU2VydmljZS5pc1NpbGVudFJlbmV3UnVubmluZyhjb25maWcpO1xyXG4gICAgY29uc3QgeyB0cmlnZ2VyQXV0aG9yaXphdGlvblJlc3VsdEV2ZW50LCBwb3N0TG9naW5Sb3V0ZSwgdW5hdXRob3JpemVkUm91dGUgfSA9IGNvbmZpZztcclxuXHJcbiAgICByZXR1cm4gdGhpcy5mbG93c1NlcnZpY2UucHJvY2Vzc0NvZGVGbG93Q2FsbGJhY2sodXJsVG9DaGVjaywgY29uZmlnLCBhbGxDb25maWdzKS5waXBlKFxyXG4gICAgICB0YXAoKGNhbGxiYWNrQ29udGV4dCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZmxvd3NEYXRhU2VydmljZS5yZXNldENvZGVGbG93SW5Qcm9ncmVzcyhjb25maWcpO1xyXG4gICAgICAgIGlmICghdHJpZ2dlckF1dGhvcml6YXRpb25SZXN1bHRFdmVudCAmJiAhY2FsbGJhY2tDb250ZXh0LmlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHBvc3RMb2dpblJvdXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG4gICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4ge1xyXG4gICAgICAgIHRoaXMuZmxvd3NEYXRhU2VydmljZS5yZXNldFNpbGVudFJlbmV3UnVubmluZyhjb25maWcpO1xyXG4gICAgICAgIHRoaXMuZmxvd3NEYXRhU2VydmljZS5yZXNldENvZGVGbG93SW5Qcm9ncmVzcyhjb25maWcpO1xyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWxTZXJ2aWNlLnN0b3BQZXJpb2RpY1Rva2VuQ2hlY2soKTtcclxuICAgICAgICBpZiAoIXRyaWdnZXJBdXRob3JpemF0aW9uUmVzdWx0RXZlbnQgJiYgIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHVuYXV0aG9yaXplZFJvdXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKCgpID0+IG5ldyBFcnJvcihlcnJvcikpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19