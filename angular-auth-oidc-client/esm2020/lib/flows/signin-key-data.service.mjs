import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../storage/storage-persistence.service";
import * as i2 from "../logging/logger.service";
import * as i3 from "../api/data.service";
export class SigninKeyDataService {
    constructor(storagePersistenceService, loggerService, dataService) {
        this.storagePersistenceService = storagePersistenceService;
        this.loggerService = loggerService;
        this.dataService = dataService;
    }
    getSigningKeys(currentConfiguration) {
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints', currentConfiguration);
        const jwksUri = authWellKnownEndPoints?.jwksUri;
        if (!jwksUri) {
            const error = `getSigningKeys: authWellKnownEndpoints.jwksUri is: '${jwksUri}'`;
            this.loggerService.logWarning(currentConfiguration, error);
            return throwError(() => new Error(error));
        }
        this.loggerService.logDebug(currentConfiguration, 'Getting signinkeys from ', jwksUri);
        return this.dataService.get(jwksUri, currentConfiguration).pipe(retry(2), catchError((e) => this.handleErrorGetSigningKeys(e, currentConfiguration)));
    }
    handleErrorGetSigningKeys(errorResponse, currentConfiguration) {
        let errMsg = '';
        if (errorResponse instanceof HttpResponse) {
            const body = errorResponse.body || {};
            const err = JSON.stringify(body);
            const { status, statusText } = errorResponse;
            errMsg = `${status || ''} - ${statusText || ''} ${err || ''}`;
        }
        else {
            const { message } = errorResponse;
            errMsg = !!message ? message : `${errorResponse}`;
        }
        this.loggerService.logError(currentConfiguration, errMsg);
        return throwError(() => new Error(errMsg));
    }
}
SigninKeyDataService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: SigninKeyDataService, deps: [{ token: i1.StoragePersistenceService }, { token: i2.LoggerService }, { token: i3.DataService }], target: i0.ɵɵFactoryTarget.Injectable });
SigninKeyDataService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: SigninKeyDataService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: SigninKeyDataService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.StoragePersistenceService }, { type: i2.LoggerService }, { type: i3.DataService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmluLWtleS1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9mbG93cy9zaWduaW4ta2V5LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDcEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7O0FBUW5ELE1BQU0sT0FBTyxvQkFBb0I7SUFDL0IsWUFDbUIseUJBQW9ELEVBQ3BELGFBQTRCLEVBQzVCLFdBQXdCO1FBRnhCLDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBMkI7UUFDcEQsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7SUFDeEMsQ0FBQztJQUVKLGNBQWMsQ0FBQyxvQkFBeUM7UUFDdEQsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDbkgsTUFBTSxPQUFPLEdBQUcsc0JBQXNCLEVBQUUsT0FBTyxDQUFDO1FBRWhELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixNQUFNLEtBQUssR0FBRyx1REFBdUQsT0FBTyxHQUFHLENBQUM7WUFFaEYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFM0QsT0FBTyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUMzQztRQUVELElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLG9CQUFvQixFQUFFLDBCQUEwQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXZGLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQVUsT0FBTyxFQUFFLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUN0RSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQ1IsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FDM0UsQ0FBQztJQUNKLENBQUM7SUFFTyx5QkFBeUIsQ0FBQyxhQUFzQyxFQUFFLG9CQUF5QztRQUNqSCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsSUFBSSxhQUFhLFlBQVksWUFBWSxFQUFFO1lBQ3pDLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakMsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxhQUFhLENBQUM7WUFFN0MsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLEVBQUUsTUFBTSxVQUFVLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQztTQUMvRDthQUFNO1lBQ0wsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLGFBQWEsQ0FBQztZQUVsQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsRUFBRSxDQUFDO1NBQ25EO1FBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFMUQsT0FBTyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDOztpSEE1Q1Usb0JBQW9CO3FIQUFwQixvQkFBb0I7MkZBQXBCLG9CQUFvQjtrQkFEaEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIHJldHJ5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBEYXRhU2VydmljZSB9IGZyb20gJy4uL2FwaS9kYXRhLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vY29uZmlnL29wZW5pZC1jb25maWd1cmF0aW9uJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlIH0gZnJvbSAnLi4vc3RvcmFnZS9zdG9yYWdlLXBlcnNpc3RlbmNlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBKd3RLZXlzIH0gZnJvbSAnLi4vdmFsaWRhdGlvbi9qd3RrZXlzJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFNpZ25pbktleURhdGFTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZTogU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlXHJcbiAgKSB7fVxyXG5cclxuICBnZXRTaWduaW5nS2V5cyhjdXJyZW50Q29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbik6IE9ic2VydmFibGU8Snd0S2V5cz4ge1xyXG4gICAgY29uc3QgYXV0aFdlbGxLbm93bkVuZFBvaW50cyA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoV2VsbEtub3duRW5kUG9pbnRzJywgY3VycmVudENvbmZpZ3VyYXRpb24pO1xyXG4gICAgY29uc3Qgandrc1VyaSA9IGF1dGhXZWxsS25vd25FbmRQb2ludHM/Lmp3a3NVcmk7XHJcblxyXG4gICAgaWYgKCFqd2tzVXJpKSB7XHJcbiAgICAgIGNvbnN0IGVycm9yID0gYGdldFNpZ25pbmdLZXlzOiBhdXRoV2VsbEtub3duRW5kcG9pbnRzLmp3a3NVcmkgaXM6ICcke2p3a3NVcml9J2A7XHJcblxyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyhjdXJyZW50Q29uZmlndXJhdGlvbiwgZXJyb3IpO1xyXG5cclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKGVycm9yKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGN1cnJlbnRDb25maWd1cmF0aW9uLCAnR2V0dGluZyBzaWduaW5rZXlzIGZyb20gJywgandrc1VyaSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcnZpY2UuZ2V0PEp3dEtleXM+KGp3a3NVcmksIGN1cnJlbnRDb25maWd1cmF0aW9uKS5waXBlKFxyXG4gICAgICByZXRyeSgyKSxcclxuICAgICAgY2F0Y2hFcnJvcigoZSkgPT4gdGhpcy5oYW5kbGVFcnJvckdldFNpZ25pbmdLZXlzKGUsIGN1cnJlbnRDb25maWd1cmF0aW9uKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhhbmRsZUVycm9yR2V0U2lnbmluZ0tleXMoZXJyb3JSZXNwb25zZTogSHR0cFJlc3BvbnNlPGFueT4gfCBhbnksIGN1cnJlbnRDb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uKTogT2JzZXJ2YWJsZTxuZXZlcj4ge1xyXG4gICAgbGV0IGVyck1zZyA9ICcnO1xyXG5cclxuICAgIGlmIChlcnJvclJlc3BvbnNlIGluc3RhbmNlb2YgSHR0cFJlc3BvbnNlKSB7XHJcbiAgICAgIGNvbnN0IGJvZHkgPSBlcnJvclJlc3BvbnNlLmJvZHkgfHwge307XHJcbiAgICAgIGNvbnN0IGVyciA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xyXG4gICAgICBjb25zdCB7IHN0YXR1cywgc3RhdHVzVGV4dCB9ID0gZXJyb3JSZXNwb25zZTtcclxuXHJcbiAgICAgIGVyck1zZyA9IGAke3N0YXR1cyB8fCAnJ30gLSAke3N0YXR1c1RleHQgfHwgJyd9ICR7ZXJyIHx8ICcnfWA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCB7IG1lc3NhZ2UgfSA9IGVycm9yUmVzcG9uc2U7XHJcblxyXG4gICAgICBlcnJNc2cgPSAhIW1lc3NhZ2UgPyBtZXNzYWdlIDogYCR7ZXJyb3JSZXNwb25zZX1gO1xyXG4gICAgfVxyXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGN1cnJlbnRDb25maWd1cmF0aW9uLCBlcnJNc2cpO1xyXG5cclxuICAgIHJldHVybiB0aHJvd0Vycm9yKCgpID0+IG5ldyBFcnJvcihlcnJNc2cpKTtcclxuICB9XHJcbn1cclxuIl19