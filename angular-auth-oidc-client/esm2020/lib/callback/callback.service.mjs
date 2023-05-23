import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../utils/url/url.service";
import * as i2 from "../utils/flowHelper/flow-helper.service";
import * as i3 from "./implicit-flow-callback.service";
import * as i4 from "./code-flow-callback.service";
export class CallbackService {
    constructor(urlService, flowHelper, implicitFlowCallbackService, codeFlowCallbackService) {
        this.urlService = urlService;
        this.flowHelper = flowHelper;
        this.implicitFlowCallbackService = implicitFlowCallbackService;
        this.codeFlowCallbackService = codeFlowCallbackService;
        this.stsCallbackInternal$ = new Subject();
    }
    get stsCallback$() {
        return this.stsCallbackInternal$.asObservable();
    }
    isCallback(currentUrl) {
        return this.urlService.isCallbackFromSts(currentUrl);
    }
    handleCallbackAndFireEvents(currentCallbackUrl, config, allConfigs) {
        let callback$;
        if (this.flowHelper.isCurrentFlowCodeFlow(config)) {
            callback$ = this.codeFlowCallbackService.authenticatedCallbackWithCode(currentCallbackUrl, config, allConfigs);
        }
        else if (this.flowHelper.isCurrentFlowAnyImplicitFlow(config)) {
            if (currentCallbackUrl?.includes('#')) {
                let hash = currentCallbackUrl.substring(currentCallbackUrl.indexOf('#') + 1);
                callback$ = this.implicitFlowCallbackService.authenticatedImplicitFlowCallback(config, allConfigs, hash);
            }
            else {
                callback$ = this.implicitFlowCallbackService.authenticatedImplicitFlowCallback(config, allConfigs);
            }
        }
        return callback$.pipe(tap(() => this.stsCallbackInternal$.next()));
    }
}
CallbackService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CallbackService, deps: [{ token: i1.UrlService }, { token: i2.FlowHelper }, { token: i3.ImplicitFlowCallbackService }, { token: i4.CodeFlowCallbackService }], target: i0.ɵɵFactoryTarget.Injectable });
CallbackService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CallbackService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: CallbackService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.UrlService }, { type: i2.FlowHelper }, { type: i3.ImplicitFlowCallbackService }, { type: i4.CodeFlowCallbackService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsbGJhY2suc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL2NhbGxiYWNrL2NhbGxiYWNrLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7O0FBU3JDLE1BQU0sT0FBTyxlQUFlO0lBTzFCLFlBQ21CLFVBQXNCLEVBQ3RCLFVBQXNCLEVBQ3RCLDJCQUF3RCxFQUN4RCx1QkFBZ0Q7UUFIaEQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGdDQUEyQixHQUEzQiwyQkFBMkIsQ0FBNkI7UUFDeEQsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtRQVZsRCx5QkFBb0IsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO0lBV3pELENBQUM7SUFUSixJQUFJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNsRCxDQUFDO0lBU0QsVUFBVSxDQUFDLFVBQWtCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsMkJBQTJCLENBQ3pCLGtCQUEwQixFQUMxQixNQUEyQixFQUMzQixVQUFpQztRQUVqQyxJQUFJLFNBQTBCLENBQUM7UUFFL0IsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2pELFNBQVMsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsNkJBQTZCLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ2hIO2FBQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQy9ELElBQUksa0JBQWtCLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNyQyxJQUFJLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUU3RSxTQUFTLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLGlDQUFpQyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDMUc7aUJBQU07Z0JBQ0wsU0FBUyxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxpQ0FBaUMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7YUFDcEc7U0FDRjtRQUVELE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyRSxDQUFDOzs0R0F0Q1UsZUFBZTtnSEFBZixlQUFlLGNBREYsTUFBTTsyRkFDbkIsZUFBZTtrQkFEM0IsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vY29uZmlnL29wZW5pZC1jb25maWd1cmF0aW9uJztcclxuaW1wb3J0IHsgQ2FsbGJhY2tDb250ZXh0IH0gZnJvbSAnLi4vZmxvd3MvY2FsbGJhY2stY29udGV4dCc7XHJcbmltcG9ydCB7IEZsb3dIZWxwZXIgfSBmcm9tICcuLi91dGlscy9mbG93SGVscGVyL2Zsb3ctaGVscGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVcmxTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbHMvdXJsL3VybC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29kZUZsb3dDYWxsYmFja1NlcnZpY2UgfSBmcm9tICcuL2NvZGUtZmxvdy1jYWxsYmFjay5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSW1wbGljaXRGbG93Q2FsbGJhY2tTZXJ2aWNlIH0gZnJvbSAnLi9pbXBsaWNpdC1mbG93LWNhbGxiYWNrLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIENhbGxiYWNrU2VydmljZSB7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBzdHNDYWxsYmFja0ludGVybmFsJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XHJcblxyXG4gIGdldCBzdHNDYWxsYmFjayQoKTogT2JzZXJ2YWJsZTx1bmtub3duPiB7XHJcbiAgICByZXR1cm4gdGhpcy5zdHNDYWxsYmFja0ludGVybmFsJC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSB1cmxTZXJ2aWNlOiBVcmxTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBmbG93SGVscGVyOiBGbG93SGVscGVyLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBpbXBsaWNpdEZsb3dDYWxsYmFja1NlcnZpY2U6IEltcGxpY2l0Rmxvd0NhbGxiYWNrU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29kZUZsb3dDYWxsYmFja1NlcnZpY2U6IENvZGVGbG93Q2FsbGJhY2tTZXJ2aWNlXHJcbiAgKSB7fVxyXG5cclxuICBpc0NhbGxiYWNrKGN1cnJlbnRVcmw6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMudXJsU2VydmljZS5pc0NhbGxiYWNrRnJvbVN0cyhjdXJyZW50VXJsKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNhbGxiYWNrQW5kRmlyZUV2ZW50cyhcclxuICAgIGN1cnJlbnRDYWxsYmFja1VybDogc3RyaW5nLFxyXG4gICAgY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uLFxyXG4gICAgYWxsQ29uZmlnczogT3BlbklkQ29uZmlndXJhdGlvbltdXHJcbiAgKTogT2JzZXJ2YWJsZTxDYWxsYmFja0NvbnRleHQ+IHtcclxuICAgIGxldCBjYWxsYmFjayQ6IE9ic2VydmFibGU8YW55PjtcclxuXHJcbiAgICBpZiAodGhpcy5mbG93SGVscGVyLmlzQ3VycmVudEZsb3dDb2RlRmxvdyhjb25maWcpKSB7XHJcbiAgICAgIGNhbGxiYWNrJCA9IHRoaXMuY29kZUZsb3dDYWxsYmFja1NlcnZpY2UuYXV0aGVudGljYXRlZENhbGxiYWNrV2l0aENvZGUoY3VycmVudENhbGxiYWNrVXJsLCBjb25maWcsIGFsbENvbmZpZ3MpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmZsb3dIZWxwZXIuaXNDdXJyZW50Rmxvd0FueUltcGxpY2l0Rmxvdyhjb25maWcpKSB7XHJcbiAgICAgIGlmIChjdXJyZW50Q2FsbGJhY2tVcmw/LmluY2x1ZGVzKCcjJykpIHtcclxuICAgICAgICBsZXQgaGFzaCA9IGN1cnJlbnRDYWxsYmFja1VybC5zdWJzdHJpbmcoY3VycmVudENhbGxiYWNrVXJsLmluZGV4T2YoJyMnKSArIDEpO1xyXG5cclxuICAgICAgICBjYWxsYmFjayQgPSB0aGlzLmltcGxpY2l0Rmxvd0NhbGxiYWNrU2VydmljZS5hdXRoZW50aWNhdGVkSW1wbGljaXRGbG93Q2FsbGJhY2soY29uZmlnLCBhbGxDb25maWdzLCBoYXNoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayQgPSB0aGlzLmltcGxpY2l0Rmxvd0NhbGxiYWNrU2VydmljZS5hdXRoZW50aWNhdGVkSW1wbGljaXRGbG93Q2FsbGJhY2soY29uZmlnLCBhbGxDb25maWdzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYWxsYmFjayQucGlwZSh0YXAoKCkgPT4gdGhpcy5zdHNDYWxsYmFja0ludGVybmFsJC5uZXh0KCkpKTtcclxuICB9XHJcbn1cclxuIl19