import * as i0 from "@angular/core";
/**
 * Implement this class-interface to create a custom logger service.
 */
export declare abstract class AbstractLoggerService {
    abstract logError(message: any, ...args: any[]): void;
    abstract logWarning(message: any, ...args: any[]): void;
    abstract logDebug(message: any, ...args: any[]): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AbstractLoggerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AbstractLoggerService>;
}
