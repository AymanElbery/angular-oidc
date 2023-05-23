import { LoggerService } from '../../logging/logger.service';
import { CryptoService } from '../../utils/crypto/crypto.service';
import { OpenIdConfiguration } from './../../config/openid-configuration';
import * as i0 from "@angular/core";
export declare class RandomService {
    private readonly cryptoService;
    private readonly loggerService;
    constructor(cryptoService: CryptoService, loggerService: LoggerService);
    createRandom(requiredLength: number, configuration: OpenIdConfiguration): string;
    private toHex;
    private randomString;
    static ɵfac: i0.ɵɵFactoryDeclaration<RandomService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RandomService>;
}
