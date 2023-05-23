import { Observable } from 'rxjs';
import { DataService } from '../../api/data.service';
import { LoggerService } from '../../logging/logger.service';
import { OpenIdConfiguration } from '../openid-configuration';
import { AuthWellKnownEndpoints } from './auth-well-known-endpoints';
import * as i0 from "@angular/core";
export declare class AuthWellKnownDataService {
    private readonly http;
    private readonly loggerService;
    constructor(http: DataService, loggerService: LoggerService);
    getWellKnownEndPointsForConfig(config: OpenIdConfiguration): Observable<AuthWellKnownEndpoints>;
    private getWellKnownDocument;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthWellKnownDataService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthWellKnownDataService>;
}
