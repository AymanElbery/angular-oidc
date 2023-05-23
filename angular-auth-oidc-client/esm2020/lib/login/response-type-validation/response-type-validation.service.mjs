import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
import * as i2 from "../../utils/flowHelper/flow-helper.service";
export class ResponseTypeValidationService {
    constructor(loggerService, flowHelper) {
        this.loggerService = loggerService;
        this.flowHelper = flowHelper;
    }
    hasConfigValidResponseType(configuration) {
        if (this.flowHelper.isCurrentFlowAnyImplicitFlow(configuration)) {
            return true;
        }
        if (this.flowHelper.isCurrentFlowCodeFlow(configuration)) {
            return true;
        }
        this.loggerService.logWarning(configuration, 'module configured incorrectly, invalid response_type. Check the responseType in the config');
        return false;
    }
}
ResponseTypeValidationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ResponseTypeValidationService, deps: [{ token: i1.LoggerService }, { token: i2.FlowHelper }], target: i0.ɵɵFactoryTarget.Injectable });
ResponseTypeValidationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ResponseTypeValidationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ResponseTypeValidationService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LoggerService }, { type: i2.FlowHelper }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2UtdHlwZS12YWxpZGF0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9sb2dpbi9yZXNwb25zZS10eXBlLXZhbGlkYXRpb24vcmVzcG9uc2UtdHlwZS12YWxpZGF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQU0zQyxNQUFNLE9BQU8sNkJBQTZCO0lBQ3hDLFlBQTZCLGFBQTRCLEVBQW1CLFVBQXNCO1FBQXJFLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQW1CLGVBQVUsR0FBVixVQUFVLENBQVk7SUFBRyxDQUFDO0lBRXRHLDBCQUEwQixDQUFDLGFBQWtDO1FBQzNELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUMvRCxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ3hELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FDM0IsYUFBYSxFQUNiLDRGQUE0RixDQUM3RixDQUFDO1FBRUYsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOzswSEFsQlUsNkJBQTZCOzhIQUE3Qiw2QkFBNkI7MkZBQTdCLDZCQUE2QjtrQkFEekMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmxvd0hlbHBlciB9IGZyb20gJy4uLy4uL3V0aWxzL2Zsb3dIZWxwZXIvZmxvdy1oZWxwZXIuc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBSZXNwb25zZVR5cGVWYWxpZGF0aW9uU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLCBwcml2YXRlIHJlYWRvbmx5IGZsb3dIZWxwZXI6IEZsb3dIZWxwZXIpIHt9XHJcblxyXG4gIGhhc0NvbmZpZ1ZhbGlkUmVzcG9uc2VUeXBlKGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzLmZsb3dIZWxwZXIuaXNDdXJyZW50Rmxvd0FueUltcGxpY2l0Rmxvdyhjb25maWd1cmF0aW9uKSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5mbG93SGVscGVyLmlzQ3VycmVudEZsb3dDb2RlRmxvdyhjb25maWd1cmF0aW9uKSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyhcclxuICAgICAgY29uZmlndXJhdGlvbixcclxuICAgICAgJ21vZHVsZSBjb25maWd1cmVkIGluY29ycmVjdGx5LCBpbnZhbGlkIHJlc3BvbnNlX3R5cGUuIENoZWNrIHRoZSByZXNwb25zZVR5cGUgaW4gdGhlIGNvbmZpZydcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG4iXX0=