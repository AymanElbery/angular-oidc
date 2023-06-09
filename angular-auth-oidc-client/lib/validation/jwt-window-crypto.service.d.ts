import { Observable } from 'rxjs';
import { CryptoService } from '../utils/crypto/crypto.service';
import * as i0 from "@angular/core";
export declare class JwtWindowCryptoService {
    private readonly cryptoService;
    constructor(cryptoService: CryptoService);
    generateCodeChallenge(codeVerifier: string): Observable<string>;
    generateAtHash(accessToken: string, algorithm: string): Observable<string>;
    private calcHash;
    private toHashString;
    private base64UrlEncode;
    static ɵfac: i0.ɵɵFactoryDeclaration<JwtWindowCryptoService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JwtWindowCryptoService>;
}
