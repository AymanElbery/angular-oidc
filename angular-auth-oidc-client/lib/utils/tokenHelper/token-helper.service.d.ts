import { OpenIdConfiguration } from '../../config/openid-configuration';
import { LoggerService } from '../../logging/logger.service';
import * as i0 from "@angular/core";
export declare class TokenHelperService {
    private readonly loggerService;
    private readonly document;
    constructor(loggerService: LoggerService, document: Document);
    getTokenExpirationDate(dataIdToken: any): Date;
    getSigningInputFromToken(token: any, encoded: boolean, configuration: OpenIdConfiguration): string;
    getHeaderFromToken(token: any, encoded: boolean, configuration: OpenIdConfiguration): any;
    getPayloadFromToken(token: any, encoded: boolean, configuration: OpenIdConfiguration): any;
    getSignatureFromToken(token: any, encoded: boolean, configuration: OpenIdConfiguration): any;
    private getPartOfToken;
    private urlBase64Decode;
    private tokenIsValid;
    private extractPartOfToken;
    static ɵfac: i0.ɵɵFactoryDeclaration<TokenHelperService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TokenHelperService>;
}
