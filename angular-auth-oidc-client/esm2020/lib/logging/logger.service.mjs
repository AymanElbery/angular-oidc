import { Injectable } from '@angular/core';
import { LogLevel } from './log-level';
import * as i0 from "@angular/core";
import * as i1 from "./abstract-logger.service";
export class LoggerService {
    constructor(abstractLoggerService) {
        this.abstractLoggerService = abstractLoggerService;
    }
    logError(configuration, message, ...args) {
        if (this.loggingIsTurnedOff(configuration)) {
            return;
        }
        const { configId } = configuration;
        const messageToLog = this.isObject(message) ? JSON.stringify(message) : message;
        if (!!args && !!args.length) {
            this.abstractLoggerService.logError(`[ERROR] ${configId} - ${messageToLog}`, ...args);
        }
        else {
            this.abstractLoggerService.logError(`[ERROR] ${configId} - ${messageToLog}`);
        }
    }
    logWarning(configuration, message, ...args) {
        if (!this.logLevelIsSet(configuration)) {
            return;
        }
        if (this.loggingIsTurnedOff(configuration)) {
            return;
        }
        if (!this.currentLogLevelIsEqualOrSmallerThan(configuration, LogLevel.Warn)) {
            return;
        }
        const { configId } = configuration;
        const messageToLog = this.isObject(message) ? JSON.stringify(message) : message;
        if (!!args && !!args.length) {
            this.abstractLoggerService.logWarning(`[WARN] ${configId} - ${messageToLog}`, ...args);
        }
        else {
            this.abstractLoggerService.logWarning(`[WARN] ${configId} - ${messageToLog}`);
        }
    }
    logDebug(configuration, message, ...args) {
        if (!this.logLevelIsSet(configuration)) {
            return;
        }
        if (this.loggingIsTurnedOff(configuration)) {
            return;
        }
        if (!this.currentLogLevelIsEqualOrSmallerThan(configuration, LogLevel.Debug)) {
            return;
        }
        const { configId } = configuration;
        const messageToLog = this.isObject(message) ? JSON.stringify(message) : message;
        if (!!args && !!args.length) {
            this.abstractLoggerService.logDebug(`[DEBUG] ${configId} - ${messageToLog}`, ...args);
        }
        else {
            this.abstractLoggerService.logDebug(`[DEBUG] ${configId} - ${messageToLog}`);
        }
    }
    currentLogLevelIsEqualOrSmallerThan(configuration, logLevelToCompare) {
        const { logLevel } = configuration || {};
        return logLevel <= logLevelToCompare;
    }
    logLevelIsSet(configuration) {
        const { logLevel } = configuration || {};
        if (logLevel === null) {
            return false;
        }
        if (logLevel === undefined) {
            return false;
        }
        return true;
    }
    loggingIsTurnedOff(configuration) {
        const { logLevel } = configuration || {};
        return logLevel === LogLevel.None;
    }
    isObject(possibleObject) {
        return Object.prototype.toString.call(possibleObject) === '[object Object]';
    }
}
LoggerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: LoggerService, deps: [{ token: i1.AbstractLoggerService }], target: i0.ɵɵFactoryTarget.Injectable });
LoggerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: LoggerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: LoggerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.AbstractLoggerService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7O0FBR3ZDLE1BQU0sT0FBTyxhQUFhO0lBQ3hCLFlBQTZCLHFCQUE0QztRQUE1QywwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO0lBQUcsQ0FBQztJQUU3RSxRQUFRLENBQUMsYUFBa0MsRUFBRSxPQUFZLEVBQUUsR0FBRyxJQUFXO1FBQ3ZFLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQzFDLE9BQU87U0FDUjtRQUVELE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxhQUFhLENBQUM7UUFDbkMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBRWhGLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUMzQixJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLFdBQVcsUUFBUSxNQUFNLFlBQVksRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDdkY7YUFBTTtZQUNMLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsV0FBVyxRQUFRLE1BQU0sWUFBWSxFQUFFLENBQUMsQ0FBQztTQUM5RTtJQUNILENBQUM7SUFFRCxVQUFVLENBQUMsYUFBa0MsRUFBRSxPQUFZLEVBQUUsR0FB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QUNsQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxpQkFBaUIsQ0FBQztJQUM5RSxDQUFDOzswR0E1RlUsYUFBYTs4R0FBYixhQUFhOzJGQUFiLGFBQWE7a0JBRHpCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9jb25maWcvb3BlbmlkLWNvbmZpZ3VyYXRpb24nO1xyXG5pbXBvcnQgeyBBYnN0cmFjdExvZ2dlclNlcnZpY2UgfSBmcm9tICcuL2Fic3RyYWN0LWxvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9nTGV2ZWwgfSBmcm9tICcuL2xvZy1sZXZlbCc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBMb2dnZXJTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFic3RyYWN0TG9nZ2VyU2VydmljZTogQWJzdHJhY3RMb2dnZXJTZXJ2aWNlKSB7fVxyXG5cclxuICBsb2dFcnJvcihjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uLCBtZXNzYWdlOiBhbnksIC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5sb2dnaW5nSXNUdXJuZWRPZmYoY29uZmlndXJhdGlvbikpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgY29uZmlnSWQgfSA9IGNvbmZpZ3VyYXRpb247XHJcbiAgICBjb25zdCBtZXNzYWdlVG9Mb2cgPSB0aGlzLmlzT2JqZWN0KG1lc3NhZ2UpID8gSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkgOiBtZXNzYWdlO1xyXG5cclxuICAgIGlmICghIWFyZ3MgJiYgISFhcmdzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmFic3RyYWN0TG9nZ2VyU2VydmljZS5sb2dFcnJvcihgW0VSUk9SXSAke2NvbmZpZ0lkfSAtICR7bWVzc2FnZVRvTG9nfWAsIC4uLmFyZ3MpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hYnN0cmFjdExvZ2dlclNlcnZpY2UubG9nRXJyb3IoYFtFUlJPUl0gJHtjb25maWdJZH0gLSAke21lc3NhZ2VUb0xvZ31gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvZ1dhcm5pbmcoY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbiwgbWVzc2FnZTogYW55LCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmxvZ0xldmVsSXNTZXQoY29uZmlndXJhdGlvbikpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmxvZ2dpbmdJc1R1cm5lZE9mZihjb25maWd1cmF0aW9uKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmN1cnJlbnRMb2dMZXZlbElzRXF1YWxPclNtYWxsZXJUaGFuKGNvbmZpZ3VyYXRpb24sIExvZ0xldmVsLldhcm4pKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7IGNvbmZpZ0lkIH0gPSBjb25maWd1cmF0aW9uO1xyXG4gICAgY29uc3QgbWVzc2FnZVRvTG9nID0gdGhpcy5pc09iamVjdChtZXNzYWdlKSA/IEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpIDogbWVzc2FnZTtcclxuXHJcbiAgICBpZiAoISFhcmdzICYmICEhYXJncy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5hYnN0cmFjdExvZ2dlclNlcnZpY2UubG9nV2FybmluZyhgW1dBUk5dICR7Y29uZmlnSWR9IC0gJHttZXNzYWdlVG9Mb2d9YCwgLi4uYXJncyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmFic3RyYWN0TG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKGBbV0FSTl0gJHtjb25maWdJZH0gLSAke21lc3NhZ2VUb0xvZ31gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvZ0RlYnVnKGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24sIG1lc3NhZ2U6IGFueSwgLi4uYXJnczogYW55W10pOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5sb2dMZXZlbElzU2V0KGNvbmZpZ3VyYXRpb24pKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5sb2dnaW5nSXNUdXJuZWRPZmYoY29uZmlndXJhdGlvbikpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5jdXJyZW50TG9nTGV2ZWxJc0VxdWFsT3JTbWFsbGVyVGhhbihjb25maWd1cmF0aW9uLCBMb2dMZXZlbC5EZWJ1ZykpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgY29uZmlnSWQgfSA9IGNvbmZpZ3VyYXRpb247XHJcbiAgICBjb25zdCBtZXNzYWdlVG9Mb2cgPSB0aGlzLmlzT2JqZWN0KG1lc3NhZ2UpID8gSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkgOiBtZXNzYWdlO1xyXG5cclxuICAgIGlmICghIWFyZ3MgJiYgISFhcmdzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmFic3RyYWN0TG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhgW0RFQlVHXSAke2NvbmZpZ0lkfSAtICR7bWVzc2FnZVRvTG9nfWAsIC4uLmFyZ3MpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hYnN0cmFjdExvZ2dlclNlcnZpY2UubG9nRGVidWcoYFtERUJVR10gJHtjb25maWdJZH0gLSAke21lc3NhZ2VUb0xvZ31gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3VycmVudExvZ0xldmVsSXNFcXVhbE9yU21hbGxlclRoYW4oY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbiwgbG9nTGV2ZWxUb0NvbXBhcmU6IExvZ0xldmVsKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCB7IGxvZ0xldmVsIH0gPSBjb25maWd1cmF0aW9uIHx8IHt9O1xyXG5cclxuICAgIHJldHVybiBsb2dMZXZlbCA8PSBsb2dMZXZlbFRvQ29tcGFyZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbG9nTGV2ZWxJc1NldChjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCB7IGxvZ0xldmVsIH0gPSBjb25maWd1cmF0aW9uIHx8IHt9O1xyXG5cclxuICAgIGlmIChsb2dMZXZlbCA9PT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGxvZ0xldmVsID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsb2dnaW5nSXNUdXJuZWRPZmYoY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbik6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgeyBsb2dMZXZlbCB9ID0gY29uZmlndXJhdGlvbiB8fCB7fTtcclxuXHJcbiAgICByZXR1cm4gbG9nTGV2ZWwgPT09IExvZ0xldmVsLk5vbmU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzT2JqZWN0KHBvc3NpYmxlT2JqZWN0OiBhbnkpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocG9zc2libGVPYmplY3QpID09PSAnW29iamVjdCBPYmplY3RdJztcclxuICB9XHJcbn1cclxuIl19