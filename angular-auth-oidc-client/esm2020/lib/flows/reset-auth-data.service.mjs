import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../auth-state/auth-state.service";
import * as i2 from "./flows-data.service";
import * as i3 from "../user-data/user.service";
import * as i4 from "../logging/logger.service";
export class ResetAuthDataService {
    constructor(authStateService, flowsDataService, userService, loggerService) {
        this.authStateService = authStateService;
        this.flowsDataService = flowsDataService;
        this.userService = userService;
        this.loggerService = loggerService;
    }
    resetAuthorizationData(currentConfiguration, allConfigs) {
        this.userService.resetUserDataInStore(currentConfiguration, allConfigs);
        this.flowsDataService.resetStorageFlowData(currentConfiguration);
        this.authStateService.setUnauthenticatedAndFireEvent(currentConfiguration, allConfigs);
        this.loggerService.logDebug(currentConfiguration, 'Local Login information cleaned up and event fired');
    }
}
ResetAuthDataService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ResetAuthDataService, deps: [{ token: i1.AuthStateService }, { token: i2.FlowsDataService }, { token: i3.UserService }, { token: i4.LoggerService }], target: i0.ɵɵFactoryTarget.Injectable });
ResetAuthDataService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ResetAuthDataService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ResetAuthDataService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.AuthStateService }, { type: i2.FlowsDataService }, { type: i3.UserService }, { type: i4.LoggerService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZXQtYXV0aC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9mbG93cy9yZXNldC1hdXRoLWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7QUFRM0MsTUFBTSxPQUFPLG9CQUFvQjtJQUMvQixZQUNtQixnQkFBa0MsRUFDbEMsZ0JBQWtDLEVBQ2xDLFdBQXdCLEVBQ3hCLGFBQTRCO1FBSDVCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUM1QyxDQUFDO0lBRUosc0JBQXNCLENBQUMsb0JBQXlDLEVBQUUsVUFBaUM7UUFDakcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxvQkFBb0IsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsOEJBQThCLENBQUMsb0JBQW9CLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFdkYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsb0RBQW9ELENBQUMsQ0FBQztJQUMxRyxDQUFDOztpSEFkVSxvQkFBb0I7cUhBQXBCLG9CQUFvQjsyRkFBcEIsb0JBQW9CO2tCQURoQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBdXRoU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vYXV0aC1zdGF0ZS9hdXRoLXN0YXRlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vY29uZmlnL29wZW5pZC1jb25maWd1cmF0aW9uJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4uL3VzZXItZGF0YS91c2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBGbG93c0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi9mbG93cy1kYXRhLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUmVzZXRBdXRoRGF0YVNlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhdXRoU3RhdGVTZXJ2aWNlOiBBdXRoU3RhdGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBmbG93c0RhdGFTZXJ2aWNlOiBGbG93c0RhdGFTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSB1c2VyU2VydmljZTogVXNlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2VcclxuICApIHt9XHJcblxyXG4gIHJlc2V0QXV0aG9yaXphdGlvbkRhdGEoY3VycmVudENvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24sIGFsbENvbmZpZ3M6IE9wZW5JZENvbmZpZ3VyYXRpb25bXSk6IHZvaWQge1xyXG4gICAgdGhpcy51c2VyU2VydmljZS5yZXNldFVzZXJEYXRhSW5TdG9yZShjdXJyZW50Q29uZmlndXJhdGlvbiwgYWxsQ29uZmlncyk7XHJcbiAgICB0aGlzLmZsb3dzRGF0YVNlcnZpY2UucmVzZXRTdG9yYWdlRmxvd0RhdGEoY3VycmVudENvbmZpZ3VyYXRpb24pO1xyXG4gICAgdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLnNldFVuYXV0aGVudGljYXRlZEFuZEZpcmVFdmVudChjdXJyZW50Q29uZmlndXJhdGlvbiwgYWxsQ29uZmlncyk7XHJcblxyXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGN1cnJlbnRDb25maWd1cmF0aW9uLCAnTG9jYWwgTG9naW4gaW5mb3JtYXRpb24gY2xlYW5lZCB1cCBhbmQgZXZlbnQgZmlyZWQnKTtcclxuICB9XHJcbn1cclxuIl19