import { CryptoService } from '../utils/crypto/crypto.service';
import * as i0 from "@angular/core";
export declare class JwkWindowCryptoService {
    private readonly cryptoService;
    constructor(cryptoService: CryptoService);
    importVerificationKey(key: JsonWebKey, algorithm: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | AesKeyAlgorithm): Promise<CryptoKey>;
    verifyKey(verifyAlgorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams, cryptoKey: CryptoKey, signature: BufferSource, signingInput: string): Promise<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<JwkWindowCryptoService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JwkWindowCryptoService>;
}
