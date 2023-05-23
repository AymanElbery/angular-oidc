import { AbstractLoggerService } from './abstract-logger.service';
import * as i0 from "@angular/core";
export declare class ConsoleLoggerService implements AbstractLoggerService {
    logError(message?: any, ...args: any[]): void;
    logWarning(message?: any, ...args: any[]): void;
    logDebug(message?: any, ...args: any[]): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConsoleLoggerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ConsoleLoggerService>;
}
