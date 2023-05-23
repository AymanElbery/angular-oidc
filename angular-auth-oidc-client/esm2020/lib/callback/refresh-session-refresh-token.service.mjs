import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../logging/logger.service";
import * as i2 from "../flows/reset-auth-data.service";
import * as i3 from "../flows/flows.service";
import * as i4 from "./interval.service";
export class RefreshSessionRefreshTokenService {
    constructor(loggerService, resetAuthDataService, flowsService, intervalService) {
        this.loggerService = loggerService;
        this.resetAuthDataService = resetAuthDataService;
        this.flowsService = flowsService;
        this.intervalService = intervalService;
    }
    refreshSessionWithRefreshTokens(config, allConfigs, customParamsRefresh) {
        this.loggerService.logDebug(config, 'BEGIN refresh session Authorize');
        let refreshTokenFailed = false;
        return this.flowsService.processRefreshToken(config, allConfigs, customParamsRefresh).pipe(catchError((error) => {
            this.resetAuthDataService.resetAuthorizationData(config, allConfigs);
            refreshTokenFailed = true;
            return throwError(() => new Error(error));
        }), finalize(() => refreshTokenFailed && this.intervalService.stopPeriodicTokenCheck()));
    }
}
RefreshSessionRefreshTokenService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RefreshSessionRefreshTokenService, deps: [{ token: i1.LoggerService }, { token: i2.ResetAuthDataService }, { token: i3.FlowsService }, { token: i4.IntervalService }], target: i0.ɵɵFactoryTarget.Injectable });
RefreshSessionRefreshTokenService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RefreshSessionRefreshTokenService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RefreshSessionRefreshTokenService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.LoggerService }, { type: i2.ResetAuthDataService }, { type: i3.FlowsService }, { type: i4.IntervalService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcmVzaC1zZXNzaW9uLXJlZnJlc2gtdG9rZW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL2NhbGxiYWNrL3JlZnJlc2gtc2Vzc2lvbi1yZWZyZXNoLXRva2VuLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7OztBQVN0RCxNQUFNLE9BQU8saUNBQWlDO0lBQzVDLFlBQ21CLGFBQTRCLEVBQzVCLG9CQUEwQyxFQUMxQyxZQUEwQixFQUMxQixlQUFnQztRQUhoQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1Qix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtJQUNoRCxDQUFDO0lBRUosK0JBQStCLENBQzdCLE1BQTJCLEVBQzNCLFVBQWlDLEVBQ2pDLG1CQUFrRTtRQUVsRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztRQUN2RSxJQUFJLGtCQUFrQixHQUFHLEtBQUssQ0FBQztRQUUvQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLElBQUksQ0FDeEYsVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDbkIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNyRSxrQkFBa0IsR0FBRyxJQUFJLENBQUM7WUFFMUIsT0FBTyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsRUFDRixRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQ3BGLENBQUM7SUFDSixDQUFDOzs4SEF6QlUsaUNBQWlDO2tJQUFqQyxpQ0FBaUMsY0FEcEIsTUFBTTsyRkFDbkIsaUNBQWlDO2tCQUQ3QyxVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBjYXRjaEVycm9yLCBmaW5hbGl6ZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IENhbGxiYWNrQ29udGV4dCB9IGZyb20gJy4uL2Zsb3dzL2NhbGxiYWNrLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBGbG93c1NlcnZpY2UgfSBmcm9tICcuLi9mbG93cy9mbG93cy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVzZXRBdXRoRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9mbG93cy9yZXNldC1hdXRoLWRhdGEuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSW50ZXJ2YWxTZXJ2aWNlIH0gZnJvbSAnLi9pbnRlcnZhbC5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBSZWZyZXNoU2Vzc2lvblJlZnJlc2hUb2tlblNlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSByZXNldEF1dGhEYXRhU2VydmljZTogUmVzZXRBdXRoRGF0YVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dzU2VydmljZTogRmxvd3NTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBpbnRlcnZhbFNlcnZpY2U6IEludGVydmFsU2VydmljZVxyXG4gICkge31cclxuXHJcbiAgcmVmcmVzaFNlc3Npb25XaXRoUmVmcmVzaFRva2VucyhcclxuICAgIGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbixcclxuICAgIGFsbENvbmZpZ3M6IE9wZW5JZENvbmZpZ3VyYXRpb25bXSxcclxuICAgIGN1c3RvbVBhcmFtc1JlZnJlc2g/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfVxyXG4gICk6IE9ic2VydmFibGU8Q2FsbGJhY2tDb250ZXh0PiB7XHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlnLCAnQkVHSU4gcmVmcmVzaCBzZXNzaW9uIEF1dGhvcml6ZScpO1xyXG4gICAgbGV0IHJlZnJlc2hUb2tlbkZhaWxlZCA9IGZhbHNlO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmZsb3dzU2VydmljZS5wcm9jZXNzUmVmcmVzaFRva2VuKGNvbmZpZywgYWxsQ29uZmlncywgY3VzdG9tUGFyYW1zUmVmcmVzaCkucGlwZShcclxuICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcclxuICAgICAgICB0aGlzLnJlc2V0QXV0aERhdGFTZXJ2aWNlLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoY29uZmlnLCBhbGxDb25maWdzKTtcclxuICAgICAgICByZWZyZXNoVG9rZW5GYWlsZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcigoKSA9PiBuZXcgRXJyb3IoZXJyb3IpKTtcclxuICAgICAgfSksXHJcbiAgICAgIGZpbmFsaXplKCgpID0+IHJlZnJlc2hUb2tlbkZhaWxlZCAmJiB0aGlzLmludGVydmFsU2VydmljZS5zdG9wUGVyaW9kaWNUb2tlbkNoZWNrKCkpXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=