import * as i0 from "@angular/core";
export declare class JwkExtractor {
    static InvalidArgumentError: {
        name: string;
        message: string;
    };
    static NoMatchingKeysError: {
        name: string;
        message: string;
    };
    static SeveralMatchingKeysError: {
        name: string;
        message: string;
    };
    private static buildErrorName;
    extractJwk(keys: JsonWebKey[], spec?: {
        kid?: string;
        use?: string;
        kty?: string;
    }, throwOnEmpty?: boolean): JsonWebKey[];
    static ɵfac: i0.ɵɵFactoryDeclaration<JwkExtractor, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JwkExtractor>;
}
