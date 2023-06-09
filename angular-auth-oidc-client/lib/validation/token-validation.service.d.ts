import { Observable } from 'rxjs';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { JwkExtractor } from '../extractors/jwk.extractor';
import { LoggerService } from '../logging/logger.service';
import { TokenHelperService } from '../utils/tokenHelper/token-helper.service';
import { JwkWindowCryptoService } from './jwk-window-crypto.service';
import { JwtWindowCryptoService } from './jwt-window-crypto.service';
import * as i0 from "@angular/core";
export declare class TokenValidationService {
    private readonly tokenHelperService;
    private readonly loggerService;
    private readonly jwkExtractor;
    private readonly jwkWindowCryptoService;
    private readonly jwtWindowCryptoService;
    private readonly document;
    static refreshTokenNoncePlaceholder: string;
    keyAlgorithms: string[];
    constructor(tokenHelperService: TokenHelperService, loggerService: LoggerService, jwkExtractor: JwkExtractor, jwkWindowCryptoService: JwkWindowCryptoService, jwtWindowCryptoService: JwtWindowCryptoService, document: Document);
    hasIdTokenExpired(token: string, configuration: OpenIdConfiguration, offsetSeconds?: number): boolean;
    validateIdTokenExpNotExpired(decodedIdToken: string, configuration: OpenIdConfiguration, offsetSeconds?: number): boolean;
    validateAccessTokenNotExpired(accessTokenExpiresAt: Date, configuration: OpenIdConfiguration, offsetSeconds?: number): boolean;
    validateRequiredIdToken(dataIdToken: any, configuration: OpenIdConfiguration): boolean;
    validateIdTokenIatMaxOffset(dataIdToken: any, maxOffsetAllowedInSeconds: number, disableIatOffsetValidation: boolean, configuration: OpenIdConfiguration): boolean;
    validateIdTokenNonce(dataIdToken: any, localNonce: any, ignoreNonceAfterRefresh: boolean, configuration: OpenIdConfiguration): boolean;
    validateIdTokenIss(dataIdToken: any, authWellKnownEndpointsIssuer: any, configuration: OpenIdConfiguration): boolean;
    validateIdTokenAud(dataIdToken: any, aud: any, configuration: OpenIdConfiguration): boolean;
    validateIdTokenAzpExistsIfMoreThanOneAud(dataIdToken: any): boolean;
    validateIdTokenAzpValid(dataIdToken: any, clientId: string): boolean;
    validateStateFromHashCallback(state: any, localState: any, configuration: OpenIdConfiguration): boolean;
    validateSignatureIdToken(idToken: string, jwtkeys: any, configuration: OpenIdConfiguration): Observable<boolean>;
    validateIdTokenAtHash(accessToken: string, atHash: string, idTokenAlg: string, configuration: OpenIdConfiguration): Observable<boolean>;
    private millisToMinutesAndSeconds;
    private calculateNowWithOffset;
    static ɵfac: i0.ɵɵFactoryDeclaration<TokenValidationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TokenValidationService>;
}
