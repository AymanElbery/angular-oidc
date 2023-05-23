import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class IntervalService {
    private readonly zone;
    runTokenValidationRunning: any;
    constructor(zone: NgZone);
    isTokenValidationRunning(): boolean;
    stopPeriodicTokenCheck(): void;
    startPeriodicTokenCheck(repeatAfterSeconds: number): Observable<unknown>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IntervalService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IntervalService>;
}
