import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export class IntervalService {
    constructor(zone) {
        this.zone = zone;
        this.runTokenValidationRunning = null;
    }
    isTokenValidationRunning() {
        return !!this.runTokenValidationRunning;
    }
    stopPeriodicTokenCheck() {
        if (this.runTokenValidationRunning) {
            this.runTokenValidationRunning.unsubscribe();
            this.runTokenValidationRunning = null;
        }
    }
    startPeriodicTokenCheck(repeatAfterSeconds) {
        const millisecondsDelayBetweenTokenCheck = repeatAfterSeconds * 1000;
        return new Observable((subscriber) => {
            let intervalId;
            this.zone.runOutsideAngular(() => {
                intervalId = setInterval(() => this.zone.run(() => subscriber.next()), millisecondsDelayBetweenTokenCheck);
            });
            return () => {
                clearInterval(intervalId);
            };
        });
    }
}
IntervalService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: IntervalService, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
IntervalService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: IntervalService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: IntervalService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL2NhbGxiYWNrL2ludGVydmFsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUdsQyxNQUFNLE9BQU8sZUFBZTtJQUcxQixZQUE2QixJQUFZO1FBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtRQUZ6Qyw4QkFBeUIsR0FBRyxJQUFJLENBQUM7SUFFVyxDQUFDO0lBRTdDLHdCQUF3QjtRQUN0QixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUM7SUFDMUMsQ0FBQztJQUVELHNCQUFzQjtRQUNwQixJQUFJLElBQUksQ0FBQyx5QkFBeUIsRUFBRTtZQUNsQyxJQUFJLENBQUMseUJBQXlCLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQztTQUN2QztJQUNILENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxrQkFBMEI7UUFDaEQsTUFBTSxrQ0FBa0MsR0FBRyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7UUFFckUsT0FBTyxJQUFJLFVBQVUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQ25DLElBQUksVUFBVSxDQUFDO1lBRWYsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQy9CLFVBQVUsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztZQUM3RyxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sR0FBUyxFQUFFO2dCQUNoQixhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzs0R0E5QlUsZUFBZTtnSEFBZixlQUFlLGNBREYsTUFBTTsyRkFDbkIsZUFBZTtrQkFEM0IsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIEludGVydmFsU2VydmljZSB7XHJcbiAgcnVuVG9rZW5WYWxpZGF0aW9uUnVubmluZyA9IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgem9uZTogTmdab25lKSB7fVxyXG5cclxuICBpc1Rva2VuVmFsaWRhdGlvblJ1bm5pbmcoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gISF0aGlzLnJ1blRva2VuVmFsaWRhdGlvblJ1bm5pbmc7XHJcbiAgfVxyXG5cclxuICBzdG9wUGVyaW9kaWNUb2tlbkNoZWNrKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMucnVuVG9rZW5WYWxpZGF0aW9uUnVubmluZykge1xyXG4gICAgICB0aGlzLnJ1blRva2VuVmFsaWRhdGlvblJ1bm5pbmcudW5zdWJzY3JpYmUoKTtcclxuICAgICAgdGhpcy5ydW5Ub2tlblZhbGlkYXRpb25SdW5uaW5nID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXJ0UGVyaW9kaWNUb2tlbkNoZWNrKHJlcGVhdEFmdGVyU2Vjb25kczogbnVtYmVyKTogT2JzZXJ2YWJsZTx1bmtub3duPiB7XHJcbiAgICBjb25zdCBtaWxsaXNlY29uZHNEZWxheUJldHdlZW5Ub2tlbkNoZWNrID0gcmVwZWF0QWZ0ZXJTZWNvbmRzICogMTAwMDtcclxuXHJcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcclxuICAgICAgbGV0IGludGVydmFsSWQ7XHJcblxyXG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICAgIGludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB0aGlzLnpvbmUucnVuKCgpID0+IHN1YnNjcmliZXIubmV4dCgpKSwgbWlsbGlzZWNvbmRzRGVsYXlCZXR3ZWVuVG9rZW5DaGVjayk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuICgpOiB2b2lkID0+IHtcclxuICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSWQpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==