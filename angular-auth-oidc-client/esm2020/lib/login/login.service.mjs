import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./par/par-login.service";
import * as i2 from "./popup/popup-login.service";
import * as i3 from "./standard/standard-login.service";
import * as i4 from "../storage/storage-persistence.service";
import * as i5 from "./popup/popup.service";
export class LoginService {
    constructor(parLoginService, popUpLoginService, standardLoginService, storagePersistenceService, popupService) {
        this.parLoginService = parLoginService;
        this.popUpLoginService = popUpLoginService;
        this.standardLoginService = standardLoginService;
        this.storagePersistenceService = storagePersistenceService;
        this.popupService = popupService;
    }
    login(configuration, authOptions) {
        const { usePushedAuthorisationRequests } = configuration;
        if (authOptions?.customParams) {
            this.storagePersistenceService.write('storageCustomParamsAuthRequest', authOptions.customParams, configuration);
        }
        if (usePushedAuthorisationRequests) {
            return this.parLoginService.loginPar(configuration, authOptions);
        }
        else {
            return this.standardLoginService.loginStandard(configuration, authOptions);
        }
    }
    loginWithPopUp(configuration, allConfigs, authOptions, popupOptions) {
        const isAlreadyInPopUp = this.popupService.isCurrentlyInPopup(configuration);
        if (isAlreadyInPopUp) {
            return of({ errorMessage: 'There is already a popup open.' });
        }
        const { usePushedAuthorisationRequests } = configuration;
        if (authOptions?.customParams) {
            this.storagePersistenceService.write('storageCustomParamsAuthRequest', authOptions.customParams, configuration);
        }
        if (usePushedAuthorisationRequests) {
            return this.parLoginService.loginWithPopUpPar(configuration, allConfigs, authOptions, popupOptions);
        }
        return this.popUpLoginService.loginWithPopUpStandard(configuration, allConfigs, authOptions, popupOptions);
    }
}
LoginService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: LoginService, deps: [{ token: i1.ParLoginService }, { token: i2.PopUpLoginService }, { token: i3.StandardLoginService }, { token: i4.StoragePersistenceService }, { token: i5.PopUpService }], target: i0.ɵɵFactoryTarget.Injectable });
LoginService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: LoginService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: LoginService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.ParLoginService }, { type: i2.PopUpLoginService }, { type: i3.StandardLoginService }, { type: i4.StoragePersistenceService }, { type: i5.PopUpService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL2xvZ2luL2xvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7Ozs7O0FBWXRDLE1BQU0sT0FBTyxZQUFZO0lBQ3ZCLFlBQ21CLGVBQWdDLEVBQ2hDLGlCQUFvQyxFQUNwQyxvQkFBMEMsRUFDMUMseUJBQW9ELEVBQ3BELFlBQTBCO1FBSjFCLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQ3BDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtRQUNwRCxpQkFBWSxHQUFaLFlBQVksQ0FBYztJQUMxQyxDQUFDO0lBRUosS0FBSyxDQUFDLGFBQWtDLEVBQUUsV0FBeUI7UUFDakUsTUFBTSxFQUFFLDhCQUE4QixFQUFFLEdBQUcsYUFBYSxDQUFDO1FBRXpELElBQUksV0FBVyxFQUFFLFlBQVksRUFBRTtZQUM3QixJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxFQUFFLFdBQVcsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDakg7UUFFRCxJQUFJLDhCQUE4QixFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ2xFO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQzVFO0lBQ0gsQ0FBQztJQUVELGNBQWMsQ0FDWixhQUFrQyxFQUNsQyxVQUFpQyxFQUNqQyxXQUF5QixFQUN6QixZQUEyQjtRQUUzQixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFN0UsSUFBSSxnQkFBZ0IsRUFBRTtZQUNwQixPQUFPLEVBQUUsQ0FBQyxFQUFFLFlBQVksRUFBRSxnQ0FBZ0MsRUFBbUIsQ0FBQyxDQUFDO1NBQ2hGO1FBRUQsTUFBTSxFQUFFLDhCQUE4QixFQUFFLEdBQUcsYUFBYSxDQUFDO1FBRXpELElBQUksV0FBVyxFQUFFLFlBQVksRUFBRTtZQUM3QixJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxFQUFFLFdBQVcsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDakg7UUFFRCxJQUFJLDhCQUE4QixFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztTQUNyRztRQUVELE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLHNCQUFzQixDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzdHLENBQUM7O3lHQTlDVSxZQUFZOzZHQUFaLFlBQVk7MkZBQVosWUFBWTtrQkFEeEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQXV0aE9wdGlvbnMgfSBmcm9tICcuLi9hdXRoLW9wdGlvbnMnO1xyXG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vY29uZmlnL29wZW5pZC1jb25maWd1cmF0aW9uJztcclxuaW1wb3J0IHsgU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4uL3N0b3JhZ2Uvc3RvcmFnZS1wZXJzaXN0ZW5jZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9naW5SZXNwb25zZSB9IGZyb20gJy4vbG9naW4tcmVzcG9uc2UnO1xyXG5pbXBvcnQgeyBQYXJMb2dpblNlcnZpY2UgfSBmcm9tICcuL3Bhci9wYXItbG9naW4uc2VydmljZSc7XHJcbmltcG9ydCB7IFBvcFVwTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi9wb3B1cC9wb3B1cC1sb2dpbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUG9wdXBPcHRpb25zIH0gZnJvbSAnLi9wb3B1cC9wb3B1cC1vcHRpb25zJztcclxuaW1wb3J0IHsgUG9wVXBTZXJ2aWNlIH0gZnJvbSAnLi9wb3B1cC9wb3B1cC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RhbmRhcmRMb2dpblNlcnZpY2UgfSBmcm9tICcuL3N0YW5kYXJkL3N0YW5kYXJkLWxvZ2luLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTG9naW5TZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGFyTG9naW5TZXJ2aWNlOiBQYXJMb2dpblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBvcFVwTG9naW5TZXJ2aWNlOiBQb3BVcExvZ2luU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RhbmRhcmRMb2dpblNlcnZpY2U6IFN0YW5kYXJkTG9naW5TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlOiBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBwb3B1cFNlcnZpY2U6IFBvcFVwU2VydmljZVxyXG4gICkge31cclxuXHJcbiAgbG9naW4oY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbiwgYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgY29uc3QgeyB1c2VQdXNoZWRBdXRob3Jpc2F0aW9uUmVxdWVzdHMgfSA9IGNvbmZpZ3VyYXRpb247XHJcblxyXG4gICAgaWYgKGF1dGhPcHRpb25zPy5jdXN0b21QYXJhbXMpIHtcclxuICAgICAgdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLndyaXRlKCdzdG9yYWdlQ3VzdG9tUGFyYW1zQXV0aFJlcXVlc3QnLCBhdXRoT3B0aW9ucy5jdXN0b21QYXJhbXMsIGNvbmZpZ3VyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh1c2VQdXNoZWRBdXRob3Jpc2F0aW9uUmVxdWVzdHMpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucGFyTG9naW5TZXJ2aWNlLmxvZ2luUGFyKGNvbmZpZ3VyYXRpb24sIGF1dGhPcHRpb25zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnN0YW5kYXJkTG9naW5TZXJ2aWNlLmxvZ2luU3RhbmRhcmQoY29uZmlndXJhdGlvbiwgYXV0aE9wdGlvbnMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9naW5XaXRoUG9wVXAoXHJcbiAgICBjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uLFxyXG4gICAgYWxsQ29uZmlnczogT3BlbklkQ29uZmlndXJhdGlvbltdLFxyXG4gICAgYXV0aE9wdGlvbnM/OiBBdXRoT3B0aW9ucyxcclxuICAgIHBvcHVwT3B0aW9ucz86IFBvcHVwT3B0aW9uc1xyXG4gICk6IE9ic2VydmFibGU8TG9naW5SZXNwb25zZT4ge1xyXG4gICAgY29uc3QgaXNBbHJlYWR5SW5Qb3BVcCA9IHRoaXMucG9wdXBTZXJ2aWNlLmlzQ3VycmVudGx5SW5Qb3B1cChjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICBpZiAoaXNBbHJlYWR5SW5Qb3BVcCkge1xyXG4gICAgICByZXR1cm4gb2YoeyBlcnJvck1lc3NhZ2U6ICdUaGVyZSBpcyBhbHJlYWR5IGEgcG9wdXAgb3Blbi4nIH0gYXMgTG9naW5SZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgeyB1c2VQdXNoZWRBdXRob3Jpc2F0aW9uUmVxdWVzdHMgfSA9IGNvbmZpZ3VyYXRpb247XHJcblxyXG4gICAgaWYgKGF1dGhPcHRpb25zPy5jdXN0b21QYXJhbXMpIHtcclxuICAgICAgdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLndyaXRlKCdzdG9yYWdlQ3VzdG9tUGFyYW1zQXV0aFJlcXVlc3QnLCBhdXRoT3B0aW9ucy5jdXN0b21QYXJhbXMsIGNvbmZpZ3VyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh1c2VQdXNoZWRBdXRob3Jpc2F0aW9uUmVxdWVzdHMpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucGFyTG9naW5TZXJ2aWNlLmxvZ2luV2l0aFBvcFVwUGFyKGNvbmZpZ3VyYXRpb24sIGFsbENvbmZpZ3MsIGF1dGhPcHRpb25zLCBwb3B1cE9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnBvcFVwTG9naW5TZXJ2aWNlLmxvZ2luV2l0aFBvcFVwU3RhbmRhcmQoY29uZmlndXJhdGlvbiwgYWxsQ29uZmlncywgYXV0aE9wdGlvbnMsIHBvcHVwT3B0aW9ucyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==