import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { HttpBaseService } from './http-base.service';
import * as i0 from "@angular/core";
export declare class DataService {
    private readonly httpClient;
    constructor(httpClient: HttpBaseService);
    get<T>(url: string, config: OpenIdConfiguration, token?: string): Observable<T>;
    post<T>(url: string, body: any, config: OpenIdConfiguration, headersParams?: HttpHeaders): Observable<T>;
    private prepareHeaders;
    private prepareParams;
    static ɵfac: i0.ɵɵFactoryDeclaration<DataService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DataService>;
}
