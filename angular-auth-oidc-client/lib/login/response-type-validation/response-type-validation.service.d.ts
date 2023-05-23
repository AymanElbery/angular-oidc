import { OpenIdConfiguration } from '../../config/openid-configuration';
import { LoggerService } from '../../logging/logger.service';
import { FlowHelper } from '../../utils/flowHelper/flow-helper.service';
import * as i0 from "@angular/core";
export declare class ResponseTypeValidationService {
    private readonly loggerService;
    private readonly flowHelper;
    constructor(loggerService: LoggerService, flowHelper: FlowHelper);
    hasConfigValidResponseType(configuration: OpenIdConfiguration): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ResponseTypeValidationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ResponseTypeValidationService>;
}
