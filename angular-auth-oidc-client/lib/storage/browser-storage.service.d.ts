import { OpenIdConfiguration } from '../config/openid-configuration';
import { LoggerService } from '../logging/logger.service';
import { AbstractSecurityStorage } from './abstract-security-storage';
import * as i0 from "@angular/core";
export declare class BrowserStorageService {
    private readonly loggerService;
    private readonly abstractSecurityStorage;
    constructor(loggerService: LoggerService, abstractSecurityStorage: AbstractSecurityStorage);
    read(key: string, configuration: OpenIdConfiguration): any;
    write(value: any, configuration: OpenIdConfiguration): boolean;
    remove(key: string, configuration: OpenIdConfiguration): boolean;
    clear(configuration: OpenIdConfiguration): boolean;
    private hasStorage;
    static ɵfac: i0.ɵɵFactoryDeclaration<BrowserStorageService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BrowserStorageService>;
}
