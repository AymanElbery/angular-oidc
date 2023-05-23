import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../logging/logger.service";
import * as i2 from "./abstract-security-storage";
export class BrowserStorageService {
    constructor(loggerService, abstractSecurityStorage) {
        this.loggerService = loggerService;
        this.abstractSecurityStorage = abstractSecurityStorage;
    }
    read(key, configuration) {
        const { configId } = configuration;
        if (!this.hasStorage()) {
            this.loggerService.logDebug(configuration, `Wanted to read '${key}' but Storage was undefined`);
            return null;
        }
        const storedConfig = this.abstractSecurityStorage.read(configId);
        if (!storedConfig) {
            return null;
        }
        return JSON.parse(storedConfig);
    }
    write(value, configuration) {
        const { configId } = configuration;
        if (!this.hasStorage()) {
            this.loggerService.logDebug(configuration, `Wanted to write '${value}' but Storage was falsy`);
            return false;
        }
        value = value || null;
        this.abstractSecurityStorage.write(configId, JSON.stringify(value));
        return true;
    }
    remove(key, configuration) {
        if (!this.hasStorage()) {
            this.loggerService.logDebug(configuration, `Wanted to remove '${key}' but Storage was falsy`);
            return false;
        }
        // const storage = this.getStorage(configuration);
        // if (!storage) {
        //   this.loggerService.logDebug(configuration, `Wanted to write '${key}' but Storage was falsy`);
        //   return false;
        // }
        this.abstractSecurityStorage.remove(key);
        return true;
    }
    // TODO THIS STORAGE WANTS AN ID BUT CLEARS EVERYTHING
    clear(configuration) {
        if (!this.hasStorage()) {
            this.loggerService.logDebug(configuration, `Wanted to clear storage but Storage was falsy`);
            return false;
        }
        // const storage = this.getStorage(configuration);
        // if (!storage) {
        //   this.loggerService.logDebug(configuration, `Wanted to clear storage but Storage was falsy`);
        //   return false;
        // }
        this.abstractSecurityStorage.clear();
        return true;
    }
    hasStorage() {
        return typeof Storage !== 'undefined';
    }
}
BrowserStorageService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: BrowserStorageService, deps: [{ token: i1.LoggerService }, { token: i2.AbstractSecurityStorage }], target: i0.ɵɵFactoryTarget.Injectable });
BrowserStorageService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: BrowserStorageService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: BrowserStorageService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LoggerService }, { type: i2.AbstractSecurityStorage }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci1zdG9yYWdlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9zdG9yYWdlL2Jyb3dzZXItc3RvcmFnZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFNM0MsTUFBTSxPQUFPLHFCQUFxQjtJQUNoQyxZQUE2QixhQUE0QixFQUFtQix1QkFBZ0Q7UUFBL0Ysa0JBQWEsR0FBYixhQUFhLENBQWU7UUFBbUIsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtJQUFHLENBQUM7SUFFaEksSUFBSSxDQUFDLEdBQVcsRUFBRSxhQUFrQztRQUNsRCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsYUFBYSxDQUFDO1FBRW5DLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLG1CQUFtQixHQUFHLDZCQUE2QixDQUFDLENBQUM7WUFFaEcsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFakUsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBVSxFQUFFLGFBQWtDO1FBQ2xELE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxhQUFhLENBQUM7UUFFbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLEtBQUsseUJBQXlCLENBQUMsQ0FBQztZQUUvRixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsS0FBSyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUM7UUFFdEIsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXBFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFXLEVBQUUsYUFBa0M7UUFDcEQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUscUJBQXFCLEdBQUcseUJBQXlCLENBQUMsQ0FBQztZQUU5RixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsa0RBQWtEO1FBQ2xELGtCQUFrQjtRQUNsQixrR0FBa0c7UUFFbEcsa0JBQWtCO1FBQ2xCLElBQUk7UUFFSixJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXpDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHNEQUFzRDtJQUN0RCxLQUFLLENBQUMsYUFBa0M7UUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsK0NBQStDLENBQUMsQ0FBQztZQUU1RixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsa0RBQWtEO1FBQ2xELGtCQUFrQjtRQUNsQixpR0FBaUc7UUFFakcsa0JBQWtCO1FBQ2xCLElBQUk7UUFFSixJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFckMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sVUFBVTtRQUNoQixPQUFPLE9BQU8sT0FBTyxLQUFLLFdBQVcsQ0FBQztJQUN4QyxDQUFDOztrSEE5RVUscUJBQXFCO3NIQUFyQixxQkFBcUI7MkZBQXJCLHFCQUFxQjtrQkFEakMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQWJzdHJhY3RTZWN1cml0eVN0b3JhZ2UgfSBmcm9tICcuL2Fic3RyYWN0LXNlY3VyaXR5LXN0b3JhZ2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQnJvd3NlclN0b3JhZ2VTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsIHByaXZhdGUgcmVhZG9ubHkgYWJzdHJhY3RTZWN1cml0eVN0b3JhZ2U6IEFic3RyYWN0U2VjdXJpdHlTdG9yYWdlKSB7fVxyXG5cclxuICByZWFkKGtleTogc3RyaW5nLCBjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uKTogYW55IHtcclxuICAgIGNvbnN0IHsgY29uZmlnSWQgfSA9IGNvbmZpZ3VyYXRpb247XHJcblxyXG4gICAgaWYgKCF0aGlzLmhhc1N0b3JhZ2UoKSkge1xyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlndXJhdGlvbiwgYFdhbnRlZCB0byByZWFkICcke2tleX0nIGJ1dCBTdG9yYWdlIHdhcyB1bmRlZmluZWRgKTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHN0b3JlZENvbmZpZyA9IHRoaXMuYWJzdHJhY3RTZWN1cml0eVN0b3JhZ2UucmVhZChjb25maWdJZCk7XHJcblxyXG4gICAgaWYgKCFzdG9yZWRDb25maWcpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RvcmVkQ29uZmlnKTtcclxuICB9XHJcblxyXG4gIHdyaXRlKHZhbHVlOiBhbnksIGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHsgY29uZmlnSWQgfSA9IGNvbmZpZ3VyYXRpb247XHJcblxyXG4gICAgaWYgKCF0aGlzLmhhc1N0b3JhZ2UoKSkge1xyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlndXJhdGlvbiwgYFdhbnRlZCB0byB3cml0ZSAnJHt2YWx1ZX0nIGJ1dCBTdG9yYWdlIHdhcyBmYWxzeWApO1xyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHZhbHVlID0gdmFsdWUgfHwgbnVsbDtcclxuXHJcbiAgICB0aGlzLmFic3RyYWN0U2VjdXJpdHlTdG9yYWdlLndyaXRlKGNvbmZpZ0lkLCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlKGtleTogc3RyaW5nLCBjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXRoaXMuaGFzU3RvcmFnZSgpKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWd1cmF0aW9uLCBgV2FudGVkIHRvIHJlbW92ZSAnJHtrZXl9JyBidXQgU3RvcmFnZSB3YXMgZmFsc3lgKTtcclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25zdCBzdG9yYWdlID0gdGhpcy5nZXRTdG9yYWdlKGNvbmZpZ3VyYXRpb24pO1xyXG4gICAgLy8gaWYgKCFzdG9yYWdlKSB7XHJcbiAgICAvLyAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWd1cmF0aW9uLCBgV2FudGVkIHRvIHdyaXRlICcke2tleX0nIGJ1dCBTdG9yYWdlIHdhcyBmYWxzeWApO1xyXG5cclxuICAgIC8vICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHRoaXMuYWJzdHJhY3RTZWN1cml0eVN0b3JhZ2UucmVtb3ZlKGtleSk7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPIFRISVMgU1RPUkFHRSBXQU5UUyBBTiBJRCBCVVQgQ0xFQVJTIEVWRVJZVEhJTkdcclxuICBjbGVhcihjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXRoaXMuaGFzU3RvcmFnZSgpKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWd1cmF0aW9uLCBgV2FudGVkIHRvIGNsZWFyIHN0b3JhZ2UgYnV0IFN0b3JhZ2Ugd2FzIGZhbHN5YCk7XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uc3Qgc3RvcmFnZSA9IHRoaXMuZ2V0U3RvcmFnZShjb25maWd1cmF0aW9uKTtcclxuICAgIC8vIGlmICghc3RvcmFnZSkge1xyXG4gICAgLy8gICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlndXJhdGlvbiwgYFdhbnRlZCB0byBjbGVhciBzdG9yYWdlIGJ1dCBTdG9yYWdlIHdhcyBmYWxzeWApO1xyXG5cclxuICAgIC8vICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHRoaXMuYWJzdHJhY3RTZWN1cml0eVN0b3JhZ2UuY2xlYXIoKTtcclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaGFzU3RvcmFnZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0eXBlb2YgU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCc7XHJcbiAgfVxyXG59XHJcbiJdfQ==