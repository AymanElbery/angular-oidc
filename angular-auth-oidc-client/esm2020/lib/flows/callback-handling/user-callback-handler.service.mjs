import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../auth-state/auth-state.service";
import * as i3 from "../flows-data.service";
import * as i4 from "../../user-data/user.service";
import * as i5 from "../reset-auth-data.service";
export class UserCallbackHandlerService {
    constructor(loggerService, authStateService, flowsDataService, userService, resetAuthDataService) {
        this.loggerService = loggerService;
        this.authStateService = authStateService;
        this.flowsDataService = flowsDataService;
        this.userService = userService;
        this.resetAuthDataService = resetAuthDataService;
    }
    // STEP 5 userData
    callbackUser(callbackContext, configuration, allConfigs) {
        const { isRenewProcess, validationResult, authResult, refreshToken } = callbackContext;
        const { autoUserInfo, renewUserInfoAfterTokenRenew } = configuration;
        if (!autoUserInfo) {
            if (!isRenewProcess || renewUserInfoAfterTokenRenew) {
                // userData is set to the id_token decoded, auto get user data set to false
                if (validationResult.decodedIdToken) {
                    this.userService.setUserDataToStore(validationResult.decodedIdToken, configuration, allConfigs);
                }
            }
            if (!isRenewProcess && !refreshToken) {
                this.flowsDataService.setSessionState(authResult.session_state, configuration);
            }
            this.publishAuthState(validationResult, isRenewProcess);
            return of(callbackContext);
        }
        return this.userService
            .getAndPersistUserDataInStore(configuration, allConfigs, isRenewProcess, validationResult.idToken, validationResult.decodedIdToken)
            .pipe(switchMap((userData) => {
            if (!!userData) {
                if (!refreshToken) {
                    this.flowsDataService.setSessionState(authResult.session_state, configuration);
                }
                this.publishAuthState(validationResult, isRenewProcess);
                return of(callbackContext);
            }
            else {
                this.resetAuthDataService.resetAuthorizationData(configuration, allConfigs);
                this.publishUnauthenticatedState(validationResult, isRenewProcess);
                const errorMessage = `Called for userData but they were ${userData}`;
                this.loggerService.logWarning(configuration, errorMessage);
                return throwError(() => new Error(errorMessage));
            }
        }), catchError((err) => {
            const errorMessage = `Failed to retrieve user info with error:  ${err}`;
            this.loggerService.logWarning(configuration, errorMessage);
            return throwError(() => new Error(errorMessage));
        }));
    }
    publishAuthState(stateValidationResult, isRenewProcess) {
        this.authStateService.updateAndPublishAuthState({
            isAuthenticated: true,
            validationResult: stateValidationResult.state,
            isRenewProcess,
        });
    }
    publishUnauthenticatedState(stateValidationResult, isRenewProcess) {
        this.authStateService.updateAndPublishAuthState({
            isAuthenticated: false,
            validationResult: stateValidationResult.state,
            isRenewProcess,
        });
    }
}
UserCallbackHandlerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: UserCallbackHandlerService, deps: [{ token: i1.LoggerService }, { token: i2.AuthStateService }, { token: i3.FlowsDataService }, { token: i4.UserService }, { token: i5.ResetAuthDataService }], target: i0.ɵɵFactoryTarget.Injectable });
UserCallbackHandlerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: UserCallbackHandlerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: UserCallbackHandlerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LoggerService }, { type: i2.AuthStateService }, { type: i3.FlowsDataService }, { type: i4.UserService }, { type: i5.ResetAuthDataService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy91c2VyLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7Ozs7QUFXdkQsTUFBTSxPQUFPLDBCQUEwQjtJQUNyQyxZQUNtQixhQUE0QixFQUM1QixnQkFBa0MsRUFDbEMsZ0JBQWtDLEVBQ2xDLFdBQXdCLEVBQ3hCLG9CQUEwQztRQUoxQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtJQUMxRCxDQUFDO0lBRUosa0JBQWtCO0lBQ2xCLFlBQVksQ0FDVixlQUFnQyxFQUNoQyxhQUFrQyxFQUNsQyxVQUFpQztRQUVqQyxNQUFNLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsR0FBRyxlQUFlLENBQUM7UUFDdkYsTUFBTSxFQUFFLFlBQVksRUFBRSw0QkFBNEIsRUFBRSxHQUFHLGFBQWEsQ0FBQztRQUVyRSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxjQUFjLElBQUksNEJBQTRCLEVBQUU7Z0JBQ25ELDJFQUEyRTtnQkFDM0UsSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUU7b0JBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztpQkFDakc7YUFDRjtZQUVELElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQzthQUNoRjtZQUVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUV4RCxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUM1QjtRQUVELE9BQU8sSUFBSSxDQUFDLFdBQVc7YUFDcEIsNEJBQTRCLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLGNBQWMsQ0FBQzthQUNsSSxJQUFJLENBQ0gsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDckIsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFO2dCQUNkLElBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztpQkFDaEY7Z0JBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUV4RCxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUM1QjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsb0JBQW9CLENBQUMsc0JBQXNCLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUM1RSxJQUFJLENBQUMsMkJBQTJCLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQ25FLE1BQU0sWUFBWSxHQUFHLHFDQUFxQyxRQUFRLEVBQUUsQ0FBQztnQkFFckUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUUzRCxPQUFPLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2FBQ2xEO1FBQ0gsQ0FBQyxDQUFDLEVBQ0YsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDakIsTUFBTSxZQUFZLEdBQUcsNkNBQTZDLEdBQUcsRUFBRSxDQUFDO1lBRXhFLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUUzRCxPQUFPLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUNILENBQUM7SUFDTixDQUFDO0lBRU8sZ0JBQWdCLENBQUMscUJBQTRDLEVBQUUsY0FBdUI7UUFDNUYsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDO1lBQzlDLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGdCQUFnQixFQUFFLHFCQUFxQixDQUFDLEtBQUs7WUFDN0MsY0FBYztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTywyQkFBMkIsQ0FBQyxxQkFBNEMsRUFBRSxjQUF1QjtRQUN2RyxJQUFJLENBQUMsZ0JBQWdCLENBQUMseUJBQXlCLENBQUM7WUFDOUMsZUFBZSxFQUFFLEtBQUs7WUFDdEIsZ0JBQWdCLEVBQUUscUJBQXFCLENBQUMsS0FBSztZQUM3QyxjQUFjO1NBQ2YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7dUhBakZVLDBCQUEwQjsySEFBMUIsMEJBQTBCOzJGQUExQiwwQkFBMEI7a0JBRHRDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQXV0aFN0YXRlU2VydmljZSB9IGZyb20gJy4uLy4uL2F1dGgtc3RhdGUvYXV0aC1zdGF0ZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuLi8uLi91c2VyLWRhdGEvdXNlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RhdGVWYWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnLi4vLi4vdmFsaWRhdGlvbi9zdGF0ZS12YWxpZGF0aW9uLXJlc3VsdCc7XHJcbmltcG9ydCB7IENhbGxiYWNrQ29udGV4dCB9IGZyb20gJy4uL2NhbGxiYWNrLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBGbG93c0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZmxvd3MtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVzZXRBdXRoRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9yZXNldC1hdXRoLWRhdGEuc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyQ2FsbGJhY2tIYW5kbGVyU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGF1dGhTdGF0ZVNlcnZpY2U6IEF1dGhTdGF0ZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZsb3dzRGF0YVNlcnZpY2U6IEZsb3dzRGF0YVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVzZXRBdXRoRGF0YVNlcnZpY2U6IFJlc2V0QXV0aERhdGFTZXJ2aWNlXHJcbiAgKSB7fVxyXG5cclxuICAvLyBTVEVQIDUgdXNlckRhdGFcclxuICBjYWxsYmFja1VzZXIoXHJcbiAgICBjYWxsYmFja0NvbnRleHQ6IENhbGxiYWNrQ29udGV4dCxcclxuICAgIGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24sXHJcbiAgICBhbGxDb25maWdzOiBPcGVuSWRDb25maWd1cmF0aW9uW11cclxuICApOiBPYnNlcnZhYmxlPENhbGxiYWNrQ29udGV4dD4ge1xyXG4gICAgY29uc3QgeyBpc1JlbmV3UHJvY2VzcywgdmFsaWRhdGlvblJlc3VsdCwgYXV0aFJlc3VsdCwgcmVmcmVzaFRva2VuIH0gPSBjYWxsYmFja0NvbnRleHQ7XHJcbiAgICBjb25zdCB7IGF1dG9Vc2VySW5mbywgcmVuZXdVc2VySW5mb0FmdGVyVG9rZW5SZW5ldyB9ID0gY29uZmlndXJhdGlvbjtcclxuXHJcbiAgICBpZiAoIWF1dG9Vc2VySW5mbykge1xyXG4gICAgICBpZiAoIWlzUmVuZXdQcm9jZXNzIHx8IHJlbmV3VXNlckluZm9BZnRlclRva2VuUmVuZXcpIHtcclxuICAgICAgICAvLyB1c2VyRGF0YSBpcyBzZXQgdG8gdGhlIGlkX3Rva2VuIGRlY29kZWQsIGF1dG8gZ2V0IHVzZXIgZGF0YSBzZXQgdG8gZmFsc2VcclxuICAgICAgICBpZiAodmFsaWRhdGlvblJlc3VsdC5kZWNvZGVkSWRUb2tlbikge1xyXG4gICAgICAgICAgdGhpcy51c2VyU2VydmljZS5zZXRVc2VyRGF0YVRvU3RvcmUodmFsaWRhdGlvblJlc3VsdC5kZWNvZGVkSWRUb2tlbiwgY29uZmlndXJhdGlvbiwgYWxsQ29uZmlncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWlzUmVuZXdQcm9jZXNzICYmICFyZWZyZXNoVG9rZW4pIHtcclxuICAgICAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2Uuc2V0U2Vzc2lvblN0YXRlKGF1dGhSZXN1bHQuc2Vzc2lvbl9zdGF0ZSwgY29uZmlndXJhdGlvbik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMucHVibGlzaEF1dGhTdGF0ZSh2YWxpZGF0aW9uUmVzdWx0LCBpc1JlbmV3UHJvY2Vzcyk7XHJcblxyXG4gICAgICByZXR1cm4gb2YoY2FsbGJhY2tDb250ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy51c2VyU2VydmljZVxyXG4gICAgICAuZ2V0QW5kUGVyc2lzdFVzZXJEYXRhSW5TdG9yZShjb25maWd1cmF0aW9uLCBhbGxDb25maWdzLCBpc1JlbmV3UHJvY2VzcywgdmFsaWRhdGlvblJlc3VsdC5pZFRva2VuLCB2YWxpZGF0aW9uUmVzdWx0LmRlY29kZWRJZFRva2VuKVxyXG4gICAgICAucGlwZShcclxuICAgICAgICBzd2l0Y2hNYXAoKHVzZXJEYXRhKSA9PiB7XHJcbiAgICAgICAgICBpZiAoISF1c2VyRGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoIXJlZnJlc2hUb2tlbikge1xyXG4gICAgICAgICAgICAgIHRoaXMuZmxvd3NEYXRhU2VydmljZS5zZXRTZXNzaW9uU3RhdGUoYXV0aFJlc3VsdC5zZXNzaW9uX3N0YXRlLCBjb25maWd1cmF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5wdWJsaXNoQXV0aFN0YXRlKHZhbGlkYXRpb25SZXN1bHQsIGlzUmVuZXdQcm9jZXNzKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvZihjYWxsYmFja0NvbnRleHQpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNldEF1dGhEYXRhU2VydmljZS5yZXNldEF1dGhvcml6YXRpb25EYXRhKGNvbmZpZ3VyYXRpb24sIGFsbENvbmZpZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnB1Ymxpc2hVbmF1dGhlbnRpY2F0ZWRTdGF0ZSh2YWxpZGF0aW9uUmVzdWx0LCBpc1JlbmV3UHJvY2Vzcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBDYWxsZWQgZm9yIHVzZXJEYXRhIGJ1dCB0aGV5IHdlcmUgJHt1c2VyRGF0YX1gO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoY29uZmlndXJhdGlvbiwgZXJyb3JNZXNzYWdlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKCgpID0+IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBGYWlsZWQgdG8gcmV0cmlldmUgdXNlciBpbmZvIHdpdGggZXJyb3I6ICAke2Vycn1gO1xyXG5cclxuICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKGNvbmZpZ3VyYXRpb24sIGVycm9yTWVzc2FnZSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gbmV3IEVycm9yKGVycm9yTWVzc2FnZSkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHB1Ymxpc2hBdXRoU3RhdGUoc3RhdGVWYWxpZGF0aW9uUmVzdWx0OiBTdGF0ZVZhbGlkYXRpb25SZXN1bHQsIGlzUmVuZXdQcm9jZXNzOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UudXBkYXRlQW5kUHVibGlzaEF1dGhTdGF0ZSh7XHJcbiAgICAgIGlzQXV0aGVudGljYXRlZDogdHJ1ZSxcclxuICAgICAgdmFsaWRhdGlvblJlc3VsdDogc3RhdGVWYWxpZGF0aW9uUmVzdWx0LnN0YXRlLFxyXG4gICAgICBpc1JlbmV3UHJvY2VzcyxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwdWJsaXNoVW5hdXRoZW50aWNhdGVkU3RhdGUoc3RhdGVWYWxpZGF0aW9uUmVzdWx0OiBTdGF0ZVZhbGlkYXRpb25SZXN1bHQsIGlzUmVuZXdQcm9jZXNzOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UudXBkYXRlQW5kUHVibGlzaEF1dGhTdGF0ZSh7XHJcbiAgICAgIGlzQXV0aGVudGljYXRlZDogZmFsc2UsXHJcbiAgICAgIHZhbGlkYXRpb25SZXN1bHQ6IHN0YXRlVmFsaWRhdGlvblJlc3VsdC5zdGF0ZSxcclxuICAgICAgaXNSZW5ld1Byb2Nlc3MsXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19