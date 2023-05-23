import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map, retry, switchMap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../utils/url/url.service";
import * as i3 from "../../api/data.service";
import * as i4 from "../../storage/storage-persistence.service";
export class ParService {
    constructor(loggerService, urlService, dataService, storagePersistenceService) {
        this.loggerService = loggerService;
        this.urlService = urlService;
        this.dataService = dataService;
        this.storagePersistenceService = storagePersistenceService;
    }
    postParRequest(configuration, customParams) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        headers = headers.set('X-OAUTH-IDENTITY-DOMAIN-NAME', 'StudentServicesDomain');
        const authWellKnownEndpoints = this.storagePersistenceService.read('authWellKnownEndPoints', configuration);
        if (!authWellKnownEndpoints) {
            return throwError(() => new Error('Could not read PAR endpoint because authWellKnownEndPoints are not given'));
        }
        const parEndpoint = authWellKnownEndpoints.parEndpoint;
        if (!parEndpoint) {
            return throwError(() => new Error('Could not read PAR endpoint from authWellKnownEndpoints'));
        }
        return this.urlService.createBodyForParCodeFlowRequest(configuration, customParams).pipe(switchMap((data) => {
            return this.dataService.post(parEndpoint, data, configuration, headers).pipe(retry(2), map((response) => {
                this.loggerService.logDebug(configuration, 'par response: ', response);
                return {
                    expiresIn: response.expires_in,
                    requestUri: response.request_uri,
                };
            }), catchError((error) => {
                const errorMessage = `There was an error on ParService postParRequest`;
                this.loggerService.logError(configuration, errorMessage, error);
                return throwError(() => new Error(errorMessage));
            }));
        }));
    }
}
ParService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ParService, deps: [{ token: i1.LoggerService }, { token: i2.UrlService }, { token: i3.DataService }, { token: i4.StoragePersistenceService }], target: i0.ɵɵFactoryTarget.Injectable });
ParService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ParService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ParService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LoggerService }, { type: i2.UrlService }, { type: i3.DataService }, { type: i4.StoragePersistenceService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9sb2dpbi9wYXIvcGFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7OztBQVNuRSxNQUFNLE9BQU8sVUFBVTtJQUNyQixZQUNtQixhQUE0QixFQUM1QixVQUFzQixFQUN0QixXQUF3QixFQUN4Qix5QkFBb0Q7UUFIcEQsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qiw4QkFBeUIsR0FBekIseUJBQXlCLENBQTJCO0lBQ3BFLENBQUM7SUFFSixjQUFjLENBQUMsYUFBa0MsRUFBRSxZQUEyRDtRQUM1RyxJQUFJLE9BQU8sR0FBZ0IsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUU3QyxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztRQUUzRSxNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFNUcsSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQzNCLE9BQU8sVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLDBFQUEwRSxDQUFDLENBQUMsQ0FBQztTQUNoSDtRQUVELE1BQU0sV0FBVyxHQUFHLHNCQUFzQixDQUFDLFdBQVcsQ0FBQztRQUV2RCxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hCLE9BQU8sVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUMsQ0FBQztTQUMvRjtRQUVELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQywrQkFBK0IsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUN0RixTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDMUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUNSLEdBQUcsQ0FBQyxDQUFDLFFBQWEsRUFBRSxFQUFFO2dCQUNwQixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRXZFLE9BQU87b0JBQ0wsU0FBUyxFQUFFLFFBQVEsQ0FBQyxVQUFVO29CQUM5QixVQUFVLEVBQUUsUUFBUSxDQUFDLFdBQVc7aUJBQ2pDLENBQUM7WUFDSixDQUFDLENBQUMsRUFDRixVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDbkIsTUFBTSxZQUFZLEdBQUcsaURBQWlELENBQUM7Z0JBRXZFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRWhFLE9BQU8sVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDbkQsQ0FBQyxDQUFDLENBQ0gsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDOzt1R0EvQ1UsVUFBVTsyR0FBVixVQUFVOzJGQUFWLFVBQVU7a0JBRHRCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1hcCwgcmV0cnksIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgRGF0YVNlcnZpY2UgfSBmcm9tICcuLi8uLi9hcGkvZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4uLy4uL3N0b3JhZ2Uvc3RvcmFnZS1wZXJzaXN0ZW5jZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXJsU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3VybC91cmwuc2VydmljZSc7XHJcbmltcG9ydCB7IFBhclJlc3BvbnNlIH0gZnJvbSAnLi9wYXItcmVzcG9uc2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUGFyU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHVybFNlcnZpY2U6IFVybFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRhdGFTZXJ2aWNlOiBEYXRhU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZTogU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZVxyXG4gICkge31cclxuXHJcbiAgcG9zdFBhclJlcXVlc3QoY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbiwgY3VzdG9tUGFyYW1zPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH0pOiBPYnNlcnZhYmxlPFBhclJlc3BvbnNlPiB7XHJcbiAgICBsZXQgaGVhZGVyczogSHR0cEhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuXHJcbiAgICBoZWFkZXJzID0gaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuXHJcbiAgICBjb25zdCBhdXRoV2VsbEtub3duRW5kcG9pbnRzID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnLCBjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICBpZiAoIWF1dGhXZWxsS25vd25FbmRwb2ludHMpIHtcclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKCdDb3VsZCBub3QgcmVhZCBQQVIgZW5kcG9pbnQgYmVjYXVzZSBhdXRoV2VsbEtub3duRW5kUG9pbnRzIGFyZSBub3QgZ2l2ZW4nKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGFyRW5kcG9pbnQgPSBhdXRoV2VsbEtub3duRW5kcG9pbnRzLnBhckVuZHBvaW50O1xyXG5cclxuICAgIGlmICghcGFyRW5kcG9pbnQpIHtcclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKCdDb3VsZCBub3QgcmVhZCBQQVIgZW5kcG9pbnQgZnJvbSBhdXRoV2VsbEtub3duRW5kcG9pbnRzJykpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnVybFNlcnZpY2UuY3JlYXRlQm9keUZvclBhckNvZGVGbG93UmVxdWVzdChjb25maWd1cmF0aW9uLCBjdXN0b21QYXJhbXMpLnBpcGUoXHJcbiAgICAgIHN3aXRjaE1hcCgoZGF0YSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTZXJ2aWNlLnBvc3QocGFyRW5kcG9pbnQsIGRhdGEsIGNvbmZpZ3VyYXRpb24sIGhlYWRlcnMpLnBpcGUoXHJcbiAgICAgICAgICByZXRyeSgyKSxcclxuICAgICAgICAgIG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlndXJhdGlvbiwgJ3BhciByZXNwb25zZTogJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICBleHBpcmVzSW46IHJlc3BvbnNlLmV4cGlyZXNfaW4sXHJcbiAgICAgICAgICAgICAgcmVxdWVzdFVyaTogcmVzcG9uc2UucmVxdWVzdF91cmksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBUaGVyZSB3YXMgYW4gZXJyb3Igb24gUGFyU2VydmljZSBwb3N0UGFyUmVxdWVzdGA7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoY29uZmlndXJhdGlvbiwgZXJyb3JNZXNzYWdlLCBlcnJvcik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcigoKSA9PiBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=