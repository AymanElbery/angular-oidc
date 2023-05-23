import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./http-base.service";
const NGSW_CUSTOM_PARAM = 'ngsw-bypass';
export class DataService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    get(url, config, token) {
        const headers = this.prepareHeaders(token);
        const params = this.prepareParams(config);
        return this.httpClient.get(url, {
            headers,
            params,
        });
    }
    post(url, body, config, headersParams) {
        const headers = headersParams || this.prepareHeaders();
        const params = this.prepareParams(config);
        return this.httpClient.post(url, body, { headers, params });
    }
    prepareHeaders(token) {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        headers = headers.set('X-OAUTH-IDENTITY-DOMAIN-NAME', 'StudentServicesDomain');
        if (!!token) {
            headers = headers.set('Authorization', 'Bearer ' + decodeURIComponent(token));
        }
        return headers;
    }
    prepareParams(config) {
        let params = new HttpParams();
        const { ngswBypass } = config;
        if (ngswBypass) {
            params = params.set(NGSW_CUSTOM_PARAM, '');
        }
        return params;
    }
}
DataService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: DataService, deps: [{ token: i1.HttpBaseService }], target: i0.ɵɵFactoryTarget.Injectable });
DataService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: DataService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: DataService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.HttpBaseService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy9saWIvYXBpL2RhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUszQyxNQUFNLGlCQUFpQixHQUFHLGFBQWEsQ0FBQztBQUd4QyxNQUFNLE9BQU8sV0FBVztJQUN0QixZQUE2QixVQUEyQjtRQUEzQixlQUFVLEdBQVYsVUFBVSxDQUFpQjtJQUFHLENBQUM7SUFFNUQsR0FBRyxDQUFJLEdBQVcsRUFBRSxNQUEyQixFQUFFLEtBQWM7UUFDN0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTFDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUksR0FBRyxFQUFFO1lBQ2pDLE9BQU87WUFDUCxNQUFNO1NBQ1AsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksQ0FBSSxHQUFXLEVBQUUsSUFBUyxFQUFFLE1BQTJCLEVBQUUsYUFBMkI7UUFDdEYsTUFBTSxPQUFPLEdBQUcsYUFBYSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTFDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUksR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFTyxjQUFjLENBQUMsS0FBYztRQUNuQyxJQUFJLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBRWhDLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBRXBELElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNYLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxTQUFTLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUMvRTtRQUVELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxhQUFhLENBQUMsTUFBMkI7UUFDL0MsSUFBSSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUU5QixNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBRTlCLElBQUksVUFBVSxFQUFFO1lBQ2QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDNUM7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOzt3R0ExQ1UsV0FBVzs0R0FBWCxXQUFXOzJGQUFYLFdBQVc7a0JBRHZCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwSGVhZGVycywgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9jb25maWcvb3BlbmlkLWNvbmZpZ3VyYXRpb24nO1xyXG5pbXBvcnQgeyBIdHRwQmFzZVNlcnZpY2UgfSBmcm9tICcuL2h0dHAtYmFzZS5zZXJ2aWNlJztcclxuXHJcbmNvbnN0IE5HU1dfQ1VTVE9NX1BBUkFNID0gJ25nc3ctYnlwYXNzJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIERhdGFTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGh0dHBDbGllbnQ6IEh0dHBCYXNlU2VydmljZSkge31cclxuXHJcbiAgZ2V0PFQ+KHVybDogc3RyaW5nLCBjb25maWc6IE9wZW5JZENvbmZpZ3VyYXRpb24sIHRva2VuPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5wcmVwYXJlSGVhZGVycyh0b2tlbik7XHJcbiAgICBjb25zdCBwYXJhbXMgPSB0aGlzLnByZXBhcmVQYXJhbXMoY29uZmlnKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5odHRwQ2xpZW50LmdldDxUPih1cmwsIHtcclxuICAgICAgaGVhZGVycyxcclxuICAgICAgcGFyYW1zLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwb3N0PFQ+KHVybDogc3RyaW5nLCBib2R5OiBhbnksIGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbiwgaGVhZGVyc1BhcmFtcz86IEh0dHBIZWFkZXJzKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICBjb25zdCBoZWFkZXJzID0gaGVhZGVyc1BhcmFtcyB8fCB0aGlzLnByZXBhcmVIZWFkZXJzKCk7XHJcbiAgICBjb25zdCBwYXJhbXMgPSB0aGlzLnByZXBhcmVQYXJhbXMoY29uZmlnKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5odHRwQ2xpZW50LnBvc3Q8VD4odXJsLCBib2R5LCB7IGhlYWRlcnMsIHBhcmFtcyB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcHJlcGFyZUhlYWRlcnModG9rZW4/OiBzdHJpbmcpOiBIdHRwSGVhZGVycyB7XHJcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xyXG5cclxuICAgIGhlYWRlcnMgPSBoZWFkZXJzLnNldCgnQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuXHJcbiAgICBpZiAoISF0b2tlbikge1xyXG4gICAgICBoZWFkZXJzID0gaGVhZGVycy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyBkZWNvZGVVUklDb21wb25lbnQodG9rZW4pKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaGVhZGVycztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcHJlcGFyZVBhcmFtcyhjb25maWc6IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBIdHRwUGFyYW1zIHtcclxuICAgIGxldCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcygpO1xyXG5cclxuICAgIGNvbnN0IHsgbmdzd0J5cGFzcyB9ID0gY29uZmlnO1xyXG5cclxuICAgIGlmIChuZ3N3QnlwYXNzKSB7XHJcbiAgICAgIHBhcmFtcyA9IHBhcmFtcy5zZXQoTkdTV19DVVNUT01fUEFSQU0sICcnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGFyYW1zO1xyXG4gIH1cclxufVxyXG4iXX0=