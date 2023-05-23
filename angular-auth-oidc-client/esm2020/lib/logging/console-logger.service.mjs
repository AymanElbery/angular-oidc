import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class ConsoleLoggerService {
    logError(message, ...args) {
        console.error(message, ...args);
    }
    logWarning(message, ...args) {
        console.warn(message, ...args);
    }
    logDebug(message, ...args) {
        console.debug(message, ...args);
    }
}
ConsoleLoggerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ConsoleLoggerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ConsoleLoggerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ConsoleLoggerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ConsoleLoggerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZS1sb2dnZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL2xvZ2dpbmcvY29uc29sZS1sb2dnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUkzQyxNQUFNLE9BQU8sb0JBQW9CO0lBQy9CLFFBQVEsQ0FBQyxPQUFhLEVBQUUsR0FBRyxJQUFXO1FBQ3BDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELFVBQVUsQ0FBQyxPQUFhLEVBQUUsR0FBRyxJQUFXO1FBQ3RDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELFFBQVEsQ0FBQyxPQUFhLEVBQUUsR0FBRyxJQUFXO1FBQ3BDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7aUhBWFUsb0JBQW9CO3FIQUFwQixvQkFBb0I7MkZBQXBCLG9CQUFvQjtrQkFEaEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQWJzdHJhY3RMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi9hYnN0cmFjdC1sb2dnZXIuc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb25zb2xlTG9nZ2VyU2VydmljZSBpbXBsZW1lbnRzIEFic3RyYWN0TG9nZ2VyU2VydmljZSB7XHJcbiAgbG9nRXJyb3IobWVzc2FnZT86IGFueSwgLi4uYXJnczogYW55W10pOiB2b2lkIHtcclxuICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSwgLi4uYXJncyk7XHJcbiAgfVxyXG5cclxuICBsb2dXYXJuaW5nKG1lc3NhZ2U/OiBhbnksIC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLndhcm4obWVzc2FnZSwgLi4uYXJncyk7XHJcbiAgfVxyXG5cclxuICBsb2dEZWJ1ZyhtZXNzYWdlPzogYW55LCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgY29uc29sZS5kZWJ1ZyhtZXNzYWdlLCAuLi5hcmdzKTtcclxuICB9XHJcbn1cclxuIl19