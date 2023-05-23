import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TokenValidationService } from '../../validation/token-validation.service';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../auth-state/auth-state.service";
import * as i3 from "../flows-data.service";
export class RefreshSessionCallbackHandlerService {
    constructor(loggerService, authStateService, flowsDataService) {
        this.loggerService = loggerService;
        this.authStateService = authStateService;
        this.flowsDataService = flowsDataService;
    }
    // STEP 1 Refresh session
    refreshSessionWithRefreshTokens(config) {
        const stateData = this.flowsDataService.getExistingOrCreateAuthStateControl(config);
        this.loggerService.logDebug(config, 'RefreshSession created. Adding myautostate: ' + stateData);
        const refreshToken = this.authStateService.getRefreshToken(config);
        const idToken = this.authStateService.getIdToken(config);
        if (refreshToken) {
            const callbackContext = {
                code: null,
                refreshToken,
                state: stateData,
                sessionState: null,
                authResult: null,
                isRenewProcess: true,
                jwtKeys: null,
                validationResult: null,
                existingIdToken: idToken,
            };
            this.loggerService.logDebug(config, 'found refresh code, obtaining new credentials with refresh code');
            // Nonce is not used with refresh tokens; but Key cloak may send it anyway
            this.flowsDataService.setNonce(TokenValidationService.refreshTokenNoncePlaceholder, config);
            return of(callbackContext);
        }
        else {
            const errorMessage = 'no refresh token found, please login';
            this.loggerService.logError(config, errorMessage);
            return throwError(() => new Error(errorMessage));
        }
    }
}
RefreshSessionCallbackHandlerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RefreshSessionCallbackHandlerService, deps: [{ token: i1.LoggerService }, { token: i2.AuthStateService }, { token: i3.FlowsDataService }], target: i0.ɵɵFactoryTarget.Injectable });
RefreshSessionCallbackHandlerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RefreshSessionCallbackHandlerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RefreshSessionCallbackHandlerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LoggerService }, { type: i2.AuthStateService }, { type: i3.FlowsDataService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcmVzaC1zZXNzaW9uLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL3JlZnJlc2gtc2Vzc2lvbi1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUlsRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQzs7Ozs7QUFLbkYsTUFBTSxPQUFPLG9DQUFvQztJQUMvQyxZQUNtQixhQUE0QixFQUM1QixnQkFBa0MsRUFDbEMsZ0JBQWtDO1FBRmxDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtJQUNsRCxDQUFDO0lBRUoseUJBQXlCO0lBQ3pCLCtCQUErQixDQUFDLE1BQTJCO1FBQ3pELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQ0FBbUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVwRixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsOENBQThDLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFDaEcsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXpELElBQUksWUFBWSxFQUFFO1lBQ2hCLE1BQU0sZUFBZSxHQUFHO2dCQUN0QixJQUFJLEVBQUUsSUFBSTtnQkFDVixZQUFZO2dCQUNaLEtBQUssRUFBRSxTQUFTO2dCQUNoQixZQUFZLEVBQUUsSUFBSTtnQkFDbEIsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixPQUFPLEVBQUUsSUFBSTtnQkFDYixnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixlQUFlLEVBQUUsT0FBTzthQUN6QixDQUFDO1lBRUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLGlFQUFpRSxDQUFDLENBQUM7WUFDdkcsMEVBQTBFO1lBQzFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsNEJBQTRCLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFNUYsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDNUI7YUFBTTtZQUNMLE1BQU0sWUFBWSxHQUFHLHNDQUFzQyxDQUFDO1lBRTVELElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUVsRCxPQUFPLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0gsQ0FBQzs7aUlBeENVLG9DQUFvQztxSUFBcEMsb0NBQW9DOzJGQUFwQyxvQ0FBb0M7a0JBRGhELFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEF1dGhTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9hdXRoLXN0YXRlL2F1dGgtc3RhdGUuc2VydmljZSc7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi9jb25maWcvb3BlbmlkLWNvbmZpZ3VyYXRpb24nO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFRva2VuVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi92YWxpZGF0aW9uL3Rva2VuLXZhbGlkYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7IENhbGxiYWNrQ29udGV4dCB9IGZyb20gJy4uL2NhbGxiYWNrLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBGbG93c0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZmxvd3MtZGF0YS5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJlZnJlc2hTZXNzaW9uQ2FsbGJhY2tIYW5kbGVyU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2VcclxuICApIHt9XHJcblxyXG4gIC8vIFNURVAgMSBSZWZyZXNoIHNlc3Npb25cclxuICByZWZyZXNoU2Vzc2lvbldpdGhSZWZyZXNoVG9rZW5zKGNvbmZpZzogT3BlbklkQ29uZmlndXJhdGlvbik6IE9ic2VydmFibGU8Q2FsbGJhY2tDb250ZXh0PiB7XHJcbiAgICBjb25zdCBzdGF0ZURhdGEgPSB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuZ2V0RXhpc3RpbmdPckNyZWF0ZUF1dGhTdGF0ZUNvbnRyb2woY29uZmlnKTtcclxuXHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlnLCAnUmVmcmVzaFNlc3Npb24gY3JlYXRlZC4gQWRkaW5nIG15YXV0b3N0YXRlOiAnICsgc3RhdGVEYXRhKTtcclxuICAgIGNvbnN0IHJlZnJlc2hUb2tlbiA9IHRoaXMuYXV0aFN0YXRlU2VydmljZS5nZXRSZWZyZXNoVG9rZW4oY29uZmlnKTtcclxuICAgIGNvbnN0IGlkVG9rZW4gPSB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuZ2V0SWRUb2tlbihjb25maWcpO1xyXG5cclxuICAgIGlmIChyZWZyZXNoVG9rZW4pIHtcclxuICAgICAgY29uc3QgY2FsbGJhY2tDb250ZXh0ID0ge1xyXG4gICAgICAgIGNvZGU6IG51bGwsXHJcbiAgICAgICAgcmVmcmVzaFRva2VuLFxyXG4gICAgICAgIHN0YXRlOiBzdGF0ZURhdGEsXHJcbiAgICAgICAgc2Vzc2lvblN0YXRlOiBudWxsLFxyXG4gICAgICAgIGF1dGhSZXN1bHQ6IG51bGwsXHJcbiAgICAgICAgaXNSZW5ld1Byb2Nlc3M6IHRydWUsXHJcbiAgICAgICAgand0S2V5czogbnVsbCxcclxuICAgICAgICB2YWxpZGF0aW9uUmVzdWx0OiBudWxsLFxyXG4gICAgICAgIGV4aXN0aW5nSWRUb2tlbjogaWRUb2tlbixcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWcsICdmb3VuZCByZWZyZXNoIGNvZGUsIG9idGFpbmluZyBuZXcgY3JlZGVudGlhbHMgd2l0aCByZWZyZXNoIGNvZGUnKTtcclxuICAgICAgLy8gTm9uY2UgaXMgbm90IHVzZWQgd2l0aCByZWZyZXNoIHRva2VuczsgYnV0IEtleSBjbG9hayBtYXkgc2VuZCBpdCBhbnl3YXlcclxuICAgICAgdGhpcy5mbG93c0RhdGFTZXJ2aWNlLnNldE5vbmNlKFRva2VuVmFsaWRhdGlvblNlcnZpY2UucmVmcmVzaFRva2VuTm9uY2VQbGFjZWhvbGRlciwgY29uZmlnKTtcclxuXHJcbiAgICAgIHJldHVybiBvZihjYWxsYmFja0NvbnRleHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gJ25vIHJlZnJlc2ggdG9rZW4gZm91bmQsIHBsZWFzZSBsb2dpbic7XHJcblxyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoY29uZmlnLCBlcnJvck1lc3NhZ2UpO1xyXG5cclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKGVycm9yTWVzc2FnZSkpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=