import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../api/data.service";
import * as i2 from "../../logging/logger.service";
const WELL_KNOWN_SUFFIX = `/.well-known/openid-configuration`;
export class AuthWellKnownDataService {
    constructor(http, loggerService) {
        this.http = http;
        this.loggerService = loggerService;
    }
    getWellKnownEndPointsForConfig(config) {
        const { authWellknownEndpointUrl } = config;
        if (!authWellknownEndpointUrl) {
            const errorMessage = 'no authWellknownEndpoint given!';
            this.loggerService.logError(config, errorMessage);
            return throwError(() => new Error(errorMessage));
        }
        return this.getWellKnownDocument(authWellknownEndpointUrl, config).pipe(map((wellKnownEndpoints) => ({
            issuer: wellKnownEndpoints.issuer,
            jwksUri: wellKnownEndpoints.jwks_uri,
            authorizationEndpoint: wellKnownEndpoints.authorization_endpoint,
            tokenEndpoint: wellKnownEndpoints.token_endpoint,
            userInfoEndpoint: wellKnownEndpoints.userinfo_endpoint,
            endSessionEndpoint: wellKnownEndpoints.end_session_endpoint,
            checkSessionIframe: wellKnownEndpoints.check_session_iframe,
            revocationEndpoint: wellKnownEndpoints.revocation_endpoint,
            introspectionEndpoint: wellKnownEndpoints.introspection_endpoint,
            parEndpoint: wellKnownEndpoints.pushed_authorization_request_endpoint,
        })));
    }
    getWellKnownDocument(wellKnownEndpoint, config) {
        let url = wellKnownEndpoint;
        if (!wellKnownEndpoint.includes(WELL_KNOWN_SUFFIX)) {
            url = `${wellKnownEndpoint}${WELL_KNOWN_SUFFIX}`;
        }
        return this.http.get(url, config).pipe(retry(2));
    }
}
AuthWellKnownDataService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AuthWellKnownDataService, deps: [{ token: i1.DataService }, { token: i2.LoggerService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthWellKnownDataService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AuthWellKnownDataService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AuthWellKnownDataService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.DataService }, { type: i2.LoggerService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC13ZWxsLWtub3duLWRhdGEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL2NvbmZpZy9hdXRoLXdlbGwta25vd24vYXV0aC13ZWxsLWtub3duLWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQU01QyxNQUFNLGlCQUFpQixHQUFHLG1DQUFtQyxDQUFDO0FBRzlELE1BQU0sT0FBTyx3QkFBd0I7SUFDbkMsWUFBNkIsSUFBaUIsRUFBbUIsYUFBNEI7UUFBaEUsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFtQixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUFHLENBQUM7SUFFakcsOEJBQThCLENBQUMsTUFBMkI7UUFDeEQsTUFBTSxFQUFFLHdCQUF3QixFQUFFLEdBQUcsTUFBTSxDQUFDO1FBRTVDLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtZQUM3QixNQUFNLFlBQVksR0FBRyxpQ0FBaUMsQ0FBQztZQUV2RCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFbEQsT0FBTyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztTQUNsRDtRQUVELE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLHdCQUF3QixFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FDckUsR0FBRyxDQUNELENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUNyQixDQUFDO1lBQ0MsTUFBTSxFQUFFLGtCQUFrQixDQUFDLE1BQU07WUFDakMsT0FBTyxFQUFFLGtCQUFrQixDQUFDLFFBQVE7WUFDcEMscUJBQXFCLEVBQUUsa0JBQWtCLENBQUMsc0JBQXNCO1lBQ2hFLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjO1lBQ2hELGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLGlCQUFpQjtZQUN0RCxrQkFBa0IsRUFBRSxrQkFBa0IsQ0FBQyxvQkFBb0I7WUFDM0Qsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsb0JBQW9CO1lBQzNELGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLG1CQUFtQjtZQUMxRCxxQkFBcUIsRUFBRSxrQkFBa0IsQ0FBQyxzQkFBc0I7WUFDaEUsV0FBVyxFQUFFLGtCQUFrQixDQUFDLHFDQUFxQztTQUMzQyxDQUFBLENBQy9CLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFTyxvQkFBb0IsQ0FBQyxpQkFBeUIsRUFBRSxNQUEyQjtRQUNqRixJQUFJLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQztRQUU1QixJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7WUFDbEQsR0FBRyxHQUFHLEdBQUcsaUJBQWlCLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQztTQUNsRDtRQUVELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQU0sR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDOztxSEF6Q1Usd0JBQXdCO3lIQUF4Qix3QkFBd0I7MkZBQXhCLHdCQUF3QjtrQkFEcEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAsIHJldHJ5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBEYXRhU2VydmljZSB9IGZyb20gJy4uLy4uL2FwaS9kYXRhLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IEF1dGhXZWxsS25vd25FbmRwb2ludHMgfSBmcm9tICcuL2F1dGgtd2VsbC1rbm93bi1lbmRwb2ludHMnO1xyXG5cclxuY29uc3QgV0VMTF9LTk9XTl9TVUZGSVggPSBgLy53ZWxsLWtub3duL29wZW5pZC1jb25maWd1cmF0aW9uYDtcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEF1dGhXZWxsS25vd25EYXRhU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBodHRwOiBEYXRhU2VydmljZSwgcHJpdmF0ZSByZWFkb25seSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlKSB7fVxyXG5cclxuICBnZXRXZWxsS25vd25FbmRQb2ludHNGb3JDb25maWcoY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uKTogT2JzZXJ2YWJsZTxBdXRoV2VsbEtub3duRW5kcG9pbnRzPiB7XHJcbiAgICBjb25zdCB7IGF1dGhXZWxsa25vd25FbmRwb2ludFVybCB9ID0gY29uZmlnO1xyXG5cclxuICAgIGlmICghYXV0aFdlbGxrbm93bkVuZHBvaW50VXJsKSB7XHJcbiAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9ICdubyBhdXRoV2VsbGtub3duRW5kcG9pbnQgZ2l2ZW4hJztcclxuXHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWcsIGVycm9yTWVzc2FnZSk7XHJcblxyXG4gICAgICByZXR1cm4gdGhyb3dFcnJvcigoKSA9PiBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2V0V2VsbEtub3duRG9jdW1lbnQoYXV0aFdlbGxrbm93bkVuZHBvaW50VXJsLCBjb25maWcpLnBpcGUoXHJcbiAgICAgIG1hcChcclxuICAgICAgICAod2VsbEtub3duRW5kcG9pbnRzKSA9PlxyXG4gICAgICAgICAgKHtcclxuICAgICAgICAgICAgaXNzdWVyOiB3ZWxsS25vd25FbmRwb2ludHMuaXNzdWVyLFxyXG4gICAgICAgICAgICBqd2tzVXJpOiB3ZWxsS25vd25FbmRwb2ludHMuandrc191cmksXHJcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb25FbmRwb2ludDogd2VsbEtub3duRW5kcG9pbnRzLmF1dGhvcml6YXRpb25fZW5kcG9pbnQsXHJcbiAgICAgICAgICAgIHRva2VuRW5kcG9pbnQ6IHdlbGxLbm93bkVuZHBvaW50cy50b2tlbl9lbmRwb2ludCxcclxuICAgICAgICAgICAgdXNlckluZm9FbmRwb2ludDogd2VsbEtub3duRW5kcG9pbnRzLnVzZXJpbmZvX2VuZHBvaW50LFxyXG4gICAgICAgICAgICBlbmRTZXNzaW9uRW5kcG9pbnQ6IHdlbGxLbm93bkVuZHBvaW50cy5lbmRfc2Vzc2lvbl9lbmRwb2ludCxcclxuICAgICAgICAgICAgY2hlY2tTZXNzaW9uSWZyYW1lOiB3ZWxsS25vd25FbmRwb2ludHMuY2hlY2tfc2Vzc2lvbl9pZnJhbWUsXHJcbiAgICAgICAgICAgIHJldm9jYXRpb25FbmRwb2ludDogd2VsbEtub3duRW5kcG9pbnRzLnJldm9jYXRpb25fZW5kcG9pbnQsXHJcbiAgICAgICAgICAgIGludHJvc3BlY3Rpb25FbmRwb2ludDogd2VsbEtub3duRW5kcG9pbnRzLmludHJvc3BlY3Rpb25fZW5kcG9pbnQsXHJcbiAgICAgICAgICAgIHBhckVuZHBvaW50OiB3ZWxsS25vd25FbmRwb2ludHMucHVzaGVkX2F1dGhvcml6YXRpb25fcmVxdWVzdF9lbmRwb2ludCxcclxuICAgICAgICAgIH0gYXMgQXV0aFdlbGxLbm93bkVuZHBvaW50cylcclxuICAgICAgKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0V2VsbEtub3duRG9jdW1lbnQod2VsbEtub3duRW5kcG9pbnQ6IHN0cmluZywgY29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCB1cmwgPSB3ZWxsS25vd25FbmRwb2ludDtcclxuXHJcbiAgICBpZiAoIXdlbGxLbm93bkVuZHBvaW50LmluY2x1ZGVzKFdFTExfS05PV05fU1VGRklYKSkge1xyXG4gICAgICB1cmwgPSBgJHt3ZWxsS25vd25FbmRwb2ludH0ke1dFTExfS05PV05fU1VGRklYfWA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8YW55Pih1cmwsIGNvbmZpZykucGlwZShyZXRyeSgyKSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==