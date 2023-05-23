import { OpenIdConfiguration } from '../config/openid-configuration';
import { AbstractLoggerService } from './abstract-logger.service';
import * as i0 from "@angular/core";
export declare class LoggerService {
    private readonly abstractLoggerService;
    constructor(abstractLoggerService: AbstractLoggerService);
    logError(configuration: OpenIdConfiguration, message: any, ...args: any[]): void;
    logWarning(configuration: OpenIdConfiguration, message: any, ...args: any[]): void;
    logDebug(configuration: OpenIdConfiguration, message: any, ...args: any[]): void;
    private currentLogLevelIsEqualOrSmallerThan;
    private logLevelIsSet;
    private loggingIsTurnedOff;
    private isObject;
    static ɵfac: i0.ɵɵFactoryDeclaration<LoggerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LoggerService>;
}
