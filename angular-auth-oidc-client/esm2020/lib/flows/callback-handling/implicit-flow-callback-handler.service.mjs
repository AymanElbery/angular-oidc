import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../reset-auth-data.service";
import * as i2 from "../../logging/logger.service";
import * as i3 from "../flows-data.service";
export class ImplicitFlowCallbackHandlerService {
    constructor(resetAuthDataService, loggerService, flowsDataService, document) {
        this.resetAuthDataService = resetAuthDataService;
        this.loggerService = loggerService;
        this.flowsDataService = flowsDataService;
        this.document = document;
    }
    // STEP 1 Code Flow
    // STEP 1 Implicit Flow
    implicitFlowCallback(config, allConfigs, hash) {
        const isRenewProcessData = this.flowsDataService.isSilentRenewRunning(config);
        this.loggerService.logDebug(config, 'BEGIN callback, no auth data');
        if (!isRenewProcessData) {
            this.resetAuthDataService.resetAuthorizationData(config, allConfigs);
        }
        hash = hash || this.document.location.hash.substring(1);
        const authResult = hash.split('&').reduce((resultData, item) => {
            const parts = item.split('=');
            resultData[parts.shift()] = parts.join('=');
            return resultData;
        }, {});
        const callbackContext = {
            code: null,
            refreshToken: null,
            state: null,
            sessionState: null,
            authResult,
            isRenewProcess: isRenewProcessData,
            jwtKeys: null,
            validationResult: null,
            existingIdToken: null,
        };
        return of(callbackContext);
    }
}
ImplicitFlowCallbackHandlerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ImplicitFlowCallbackHandlerService, deps: [{ token: i1.ResetAuthDataService }, { token: i2.LoggerService }, { token: i3.FlowsDataService }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
ImplicitFlowCallbackHandlerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ImplicitFlowCallbackHandlerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ImplicitFlowCallbackHandlerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.ResetAuthDataService }, { type: i2.LoggerService }, { type: i3.FlowsDataService }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wbGljaXQtZmxvdy1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy9pbXBsaWNpdC1mbG93LWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFjLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7Ozs7QUFRdEMsTUFBTSxPQUFPLGtDQUFrQztJQUM3QyxZQUNtQixvQkFBMEMsRUFDMUMsYUFBNEIsRUFDNUIsZ0JBQWtDLEVBQ2hCLFFBQWtCO1FBSHBDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNoQixhQUFRLEdBQVIsUUFBUSxDQUFVO0lBQ3BELENBQUM7SUFFSixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLG9CQUFvQixDQUFDLE1BQTJCLEVBQUUsVUFBaUMsRUFBRSxJQUFhO1FBQ2hHLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUN2QixJQUFJLENBQUMsb0JBQW9CLENBQUMsc0JBQXNCLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhELE1BQU0sVUFBVSxHQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBZSxFQUFFLElBQVksRUFBRSxFQUFFO1lBQy9FLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFOUIsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQVksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFdEQsT0FBTyxVQUFVLENBQUM7UUFDcEIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRVAsTUFBTSxlQUFlLEdBQUc7WUFDdEIsSUFBSSxFQUFFLElBQUk7WUFDVixZQUFZLEVBQUUsSUFBSTtZQUNsQixLQUFLLEVBQUUsSUFBSTtZQUNYLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFVBQVU7WUFDVixjQUFjLEVBQUUsa0JBQWtCO1lBQ2xDLE9BQU8sRUFBRSxJQUFJO1lBQ2IsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixlQUFlLEVBQUUsSUFBSTtTQUN0QixDQUFDO1FBRUYsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDN0IsQ0FBQzs7K0hBekNVLGtDQUFrQyxtSEFLbkMsUUFBUTttSUFMUCxrQ0FBa0M7MkZBQWxDLGtDQUFrQztrQkFEOUMsVUFBVTs7MEJBTU4sTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FsbGJhY2tDb250ZXh0IH0gZnJvbSAnLi4vY2FsbGJhY2stY29udGV4dCc7XHJcbmltcG9ydCB7IEZsb3dzRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9mbG93cy1kYXRhLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZXNldEF1dGhEYXRhU2VydmljZSB9IGZyb20gJy4uL3Jlc2V0LWF1dGgtZGF0YS5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEltcGxpY2l0Rmxvd0NhbGxiYWNrSGFuZGxlclNlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSByZXNldEF1dGhEYXRhU2VydmljZTogUmVzZXRBdXRoRGF0YVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2UsXHJcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIHJlYWRvbmx5IGRvY3VtZW50OiBEb2N1bWVudFxyXG4gICkge31cclxuXHJcbiAgLy8gU1RFUCAxIENvZGUgRmxvd1xyXG4gIC8vIFNURVAgMSBJbXBsaWNpdCBGbG93XHJcbiAgaW1wbGljaXRGbG93Q2FsbGJhY2soY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uLCBhbGxDb25maWdzOiBPcGVuSWRDb25maWd1cmF0aW9uW10sIGhhc2g/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPENhbGxiYWNrQ29udGV4dD4ge1xyXG4gICAgY29uc3QgaXNSZW5ld1Byb2Nlc3NEYXRhID0gdGhpcy5mbG93c0RhdGFTZXJ2aWNlLmlzU2lsZW50UmVuZXdSdW5uaW5nKGNvbmZpZyk7XHJcblxyXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZywgJ0JFR0lOIGNhbGxiYWNrLCBubyBhdXRoIGRhdGEnKTtcclxuICAgIGlmICghaXNSZW5ld1Byb2Nlc3NEYXRhKSB7XHJcbiAgICAgIHRoaXMucmVzZXRBdXRoRGF0YVNlcnZpY2UucmVzZXRBdXRob3JpemF0aW9uRGF0YShjb25maWcsIGFsbENvbmZpZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc2ggPSBoYXNoIHx8IHRoaXMuZG9jdW1lbnQubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSk7XHJcblxyXG4gICAgY29uc3QgYXV0aFJlc3VsdDogYW55ID0gaGFzaC5zcGxpdCgnJicpLnJlZHVjZSgocmVzdWx0RGF0YTogYW55LCBpdGVtOiBzdHJpbmcpID0+IHtcclxuICAgICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCc9Jyk7XHJcblxyXG4gICAgICByZXN1bHREYXRhW3BhcnRzLnNoaWZ0KCkgYXMgc3RyaW5nXSA9IHBhcnRzLmpvaW4oJz0nKTtcclxuXHJcbiAgICAgIHJldHVybiByZXN1bHREYXRhO1xyXG4gICAgfSwge30pO1xyXG5cclxuICAgIGNvbnN0IGNhbGxiYWNrQ29udGV4dCA9IHtcclxuICAgICAgY29kZTogbnVsbCxcclxuICAgICAgcmVmcmVzaFRva2VuOiBudWxsLFxyXG4gICAgICBzdGF0ZTogbnVsbCxcclxuICAgICAgc2Vzc2lvblN0YXRlOiBudWxsLFxyXG4gICAgICBhdXRoUmVzdWx0LFxyXG4gICAgICBpc1JlbmV3UHJvY2VzczogaXNSZW5ld1Byb2Nlc3NEYXRhLFxyXG4gICAgICBqd3RLZXlzOiBudWxsLFxyXG4gICAgICB2YWxpZGF0aW9uUmVzdWx0OiBudWxsLFxyXG4gICAgICBleGlzdGluZ0lkVG9rZW46IG51bGwsXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBvZihjYWxsYmFja0NvbnRleHQpO1xyXG4gIH1cclxufVxyXG4iXX0=