import { RendererFactory2 } from '@angular/core';
import { Observable } from 'rxjs';
import { OpenIdConfiguration } from '../config/openid-configuration';
import { LoggerService } from '../logging/logger.service';
import { UrlService } from '../utils/url/url.service';
import { SilentRenewService } from './silent-renew.service';
import * as i0 from "@angular/core";
export declare class RefreshSessionIframeService {
    private readonly document;
    private readonly loggerService;
    private readonly urlService;
    private readonly silentRenewService;
    private readonly renderer;
    constructor(document: Document, loggerService: LoggerService, urlService: UrlService, silentRenewService: SilentRenewService, rendererFactory: RendererFactory2);
    refreshSessionWithIframe(config: OpenIdConfiguration, allConfigs: OpenIdConfiguration[], customParams?: {
        [key: string]: string | number | boolean;
    }): Observable<boolean>;
    private sendAuthorizeRequestUsingSilentRenew;
    private initSilentRenewRequest;
    static ɵfac: i0.ɵɵFactoryDeclaration<RefreshSessionIframeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RefreshSessionIframeService>;
}
