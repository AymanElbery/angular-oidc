import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, NgModule } from '@angular/core';
import { DataService } from './api/data.service';
import { HttpBaseService } from './api/http-base.service';
import { AuthStateService } from './auth-state/auth-state.service';
import { CheckAuthService } from './auth-state/check-auth.service';
import { AutoLoginService } from './auto-login/auto-login.service';
import { ImplicitFlowCallbackService } from './callback/implicit-flow-callback.service';
import { AuthWellKnownDataService } from './config/auth-well-known/auth-well-known-data.service';
import { AuthWellKnownService } from './config/auth-well-known/auth-well-known.service';
import { ConfigurationService } from './config/config.service';
import { StsConfigLoader, StsConfigStaticLoader } from './config/loader/config-loader';
import { ConfigValidationService } from './config/validation/config-validation.service';
import { JwkExtractor } from './extractors/jwk.extractor';
import { CodeFlowCallbackHandlerService } from './flows/callback-handling/code-flow-callback-handler.service';
import { HistoryJwtKeysCallbackHandlerService } from './flows/callback-handling/history-jwt-keys-callback-handler.service';
import { ImplicitFlowCallbackHandlerService } from './flows/callback-handling/implicit-flow-callback-handler.service';
import { RefreshSessionCallbackHandlerService } from './flows/callback-handling/refresh-session-callback-handler.service';
import { RefreshTokenCallbackHandlerService } from './flows/callback-handling/refresh-token-callback-handler.service';
import { StateValidationCallbackHandlerService } from './flows/callback-handling/state-validation-callback-handler.service';
import { UserCallbackHandlerService } from './flows/callback-handling/user-callback-handler.service';
import { FlowsDataService } from './flows/flows-data.service';
import { FlowsService } from './flows/flows.service';
import { RandomService } from './flows/random/random.service';
import { ResetAuthDataService } from './flows/reset-auth-data.service';
import { SigninKeyDataService } from './flows/signin-key-data.service';
import { CheckSessionService } from './iframe/check-session.service';
import { IFrameService } from './iframe/existing-iframe.service';
import { SilentRenewService } from './iframe/silent-renew.service';
import { ClosestMatchingRouteService } from './interceptor/closest-matching-route.service';
import { AbstractLoggerService } from './logging/abstract-logger.service';
import { ConsoleLoggerService } from './logging/console-logger.service';
import { LoggerService } from './logging/logger.service';
import { LoginService } from './login/login.service';
import { ParLoginService } from './login/par/par-login.service';
import { ParService } from './login/par/par.service';
import { PopUpLoginService } from './login/popup/popup-login.service';
import { ResponseTypeValidationService } from './login/response-type-validation/response-type-validation.service';
import { StandardLoginService } from './login/standard/standard-login.service';
import { LogoffRevocationService } from './logoff-revoke/logoff-revocation.service';
import { OidcSecurityService } from './oidc.security.service';
import { PublicEventsService } from './public-events/public-events.service';
import { AbstractSecurityStorage } from './storage/abstract-security-storage';
import { BrowserStorageService } from './storage/browser-storage.service';
import { DefaultSessionStorageService } from './storage/default-sessionstorage.service';
import { StoragePersistenceService } from './storage/storage-persistence.service';
import { UserService } from './user-data/user.service';
import { CryptoService } from './utils/crypto/crypto.service';
import { EqualityService } from './utils/equality/equality.service';
import { FlowHelper } from './utils/flowHelper/flow-helper.service';
import { PlatformProvider } from './utils/platform-provider/platform.provider';
import { TokenHelperService } from './utils/tokenHelper/token-helper.service';
import { CurrentUrlService } from './utils/url/current-url.service';
import { UrlService } from './utils/url/url.service';
import { JwkWindowCryptoService } from './validation/jwk-window-crypto.service';
import { JwtWindowCryptoService } from './validation/jwt-window-crypto.service';
import { StateValidationService } from './validation/state-validation.service';
import { TokenValidationService } from './validation/token-validation.service';
import * as i0 from "@angular/core";
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createStaticLoader(passedConfig) {
    return new StsConfigStaticLoader(passedConfig.config);
}
export const PASSED_CONFIG = new InjectionToken('PASSED_CONFIG');
export class AuthModule {
    static forRoot(passedConfig) {
        return {
            ngModule: AuthModule,
            providers: [
                // Make the PASSED_CONFIG available through injection
                { provide: PASSED_CONFIG, useValue: passedConfig },
                // Create the loader: Either the one getting passed or a static one
                passedConfig?.loader || { provide: StsConfigLoader, useFactory: createStaticLoader, deps: [PASSED_CONFIG] },
                ConfigurationService,
                PublicEventsService,
                FlowHelper,
                OidcSecurityService,
                TokenValidationService,
                PlatformProvider,
                CheckSessionService,
                FlowsDataService,
                FlowsService,
                SilentRenewService,
                LogoffRevocationService,
                UserService,
                RandomService,
                HttpBaseService,
                UrlService,
                AuthStateService,
                SigninKeyDataService,
                StoragePersistenceService,
                TokenHelperService,
                IFrameService,
                EqualityService,
                LoginService,
                ParService,
                AuthWellKnownDataService,
                AuthWellKnownService,
                DataService,
                StateValidationService,
                ConfigValidationService,
                CheckAuthService,
                ResetAuthDataService,
                ImplicitFlowCallbackService,
                HistoryJwtKeysCallbackHandlerService,
                ResponseTypeValidationService,
                UserCallbackHandlerService,
                StateValidationCallbackHandlerService,
                RefreshSessionCallbackHandlerService,
                RefreshTokenCallbackHandlerService,
                CodeFlowCallbackHandlerService,
                ImplicitFlowCallbackHandlerService,
                ParLoginService,
                PopUpLoginService,
                StandardLoginService,
                AutoLoginService,
                JwkExtractor,
                JwkWindowCryptoService,
                JwtWindowCryptoService,
                CurrentUrlService,
                ClosestMatchingRouteService,
                DefaultSessionStorageService,
                BrowserStorageService,
                CryptoService,
                LoggerService,
                { provide: AbstractSecurityStorage, useClass: DefaultSessionStorageService },
                { provide: AbstractLoggerService, useClass: ConsoleLoggerService },
            ],
        };
    }
}
AuthModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AuthModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AuthModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.0.0", ngImport: i0, type: AuthModule, imports: [CommonModule, HttpClientModule] });
AuthModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AuthModule, imports: [CommonModule, HttpClientModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: AuthModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, HttpClientModule],
                    declarations: [],
                    exports: [],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9hdXRoLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGNBQWMsRUFBdUIsUUFBUSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDbkUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDbkUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDbkUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDeEYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sdURBQXVELENBQUM7QUFDakcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDeEYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRXZGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUM5RyxPQUFPLEVB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QkFDdEIsdUJBQXVCO2dCQUN2QixnQkFBZ0I7Z0JBQ2hCLG9CQUFvQjtnQkFDcEIsMkJBQTJCO2dCQUMzQixvQ0FBb0M7Z0JBQ3BDLDZCQUE2QjtnQkFDN0IsMEJBQTBCO2dCQUMxQixxQ0FBcUM7Z0JBQ3JDLG9DQUFvQztnQkFDcEMsa0NBQWtDO2dCQUNsQyw4QkFBOEI7Z0JBQzlCLGtDQUFrQztnQkFDbEMsZUFBZTtnQkFDZixpQkFBaUI7Z0JBQ2pCLG9CQUFvQjtnQkFDcEIsZ0JBQWdCO2dCQUNoQixZQUFZO2dCQUNaLHNCQUFzQjtnQkFDdEIsc0JBQXNCO2dCQUN0QixpQkFBaUI7Z0JBQ2pCLDJCQUEyQjtnQkFDM0IsNEJBQTRCO2dCQUM1QixxQkFBcUI7Z0JBQ3JCLGFBQWE7Z0JBQ2IsYUFBYTtnQkFFYixFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsNEJBQTRCLEVBQUU7Z0JBQzVFLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxvQkFBb0IsRUFBRTthQUNuRTtTQUNGLENBQUM7SUFDSixDQUFDOzt1R0FuRVUsVUFBVTt3R0FBVixVQUFVLFlBSlgsWUFBWSxFQUFFLGdCQUFnQjt3R0FJN0IsVUFBVSxZQUpYLFlBQVksRUFBRSxnQkFBZ0I7MkZBSTdCLFVBQVU7a0JBTHRCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDO29CQUN6QyxZQUFZLEVBQUUsRUFBRTtvQkFDaEIsT0FBTyxFQUFFLEVBQUU7aUJBQ1oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3Rpb25Ub2tlbiwgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUsIFByb3ZpZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IERhdGFTZXJ2aWNlIH0gZnJvbSAnLi9hcGkvZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSHR0cEJhc2VTZXJ2aWNlIH0gZnJvbSAnLi9hcGkvaHR0cC1iYXNlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRoU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLXN0YXRlL2F1dGgtc3RhdGUuc2VydmljZSc7XHJcbmltcG9ydCB7IENoZWNrQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGgtc3RhdGUvY2hlY2stYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0b0xvZ2luU2VydmljZSB9IGZyb20gJy4vYXV0by1sb2dpbi9hdXRvLWxvZ2luLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBJbXBsaWNpdEZsb3dDYWxsYmFja1NlcnZpY2UgfSBmcm9tICcuL2NhbGxiYWNrL2ltcGxpY2l0LWZsb3ctY2FsbGJhY2suc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhXZWxsS25vd25EYXRhU2VydmljZSB9IGZyb20gJy4vY29uZmlnL2F1dGgtd2VsbC1rbm93bi9hdXRoLXdlbGwta25vd24tZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aFdlbGxLbm93blNlcnZpY2UgfSBmcm9tICcuL2NvbmZpZy9hdXRoLXdlbGwta25vd24vYXV0aC13ZWxsLWtub3duLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uU2VydmljZSB9IGZyb20gJy4vY29uZmlnL2NvbmZpZy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RzQ29uZmlnTG9hZGVyLCBTdHNDb25maWdTdGF0aWNMb2FkZXIgfSBmcm9tICcuL2NvbmZpZy9sb2FkZXIvY29uZmlnLWxvYWRlcic7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IENvbmZpZ1ZhbGlkYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9jb25maWcvdmFsaWRhdGlvbi9jb25maWctdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSndrRXh0cmFjdG9yIH0gZnJvbSAnLi9leHRyYWN0b3JzL2p3ay5leHRyYWN0b3InO1xyXG5pbXBvcnQgeyBDb2RlRmxvd0NhbGxiYWNrSGFuZGxlclNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL2NvZGUtZmxvdy1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBIaXN0b3J5Snd0S2V5c0NhbGxiYWNrSGFuZGxlclNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL2hpc3Rvcnktand0LWtleXMtY2FsbGJhY2staGFuZGxlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSW1wbGljaXRGbG93Q2FsbGJhY2tIYW5kbGVyU2VydmljZSB9IGZyb20gJy4vZmxvd3MvY2FsbGJhY2staGFuZGxpbmcvaW1wbGljaXQtZmxvdy1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZWZyZXNoU2Vzc2lvbkNhbGxiYWNrSGFuZGxlclNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL3JlZnJlc2gtc2Vzc2lvbi1jYWxsYmFjay1oYW5kbGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZWZyZXNoVG9rZW5DYWxsYmFja0hhbmRsZXJTZXJ2aWNlIH0gZnJvbSAnLi9mbG93cy9jYWxsYmFjay1oYW5kbGluZy9yZWZyZXNoLXRva2VuLWNhbGxiYWNrLWhhbmRsZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFN0YXRlVmFsaWRhdGlvbkNhbGxiYWNrSGFuZGxlclNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL3N0YXRlLXZhbGlkYXRpb24tY2FsbGJhY2staGFuZGxlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlckNhbGxiYWNrSGFuZGxlclNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL2NhbGxiYWNrLWhhbmRsaW5nL3VzZXItY2FsbGJhY2staGFuZGxlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmxvd3NEYXRhU2VydmljZSB9IGZyb20gJy4vZmxvd3MvZmxvd3MtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmxvd3NTZXJ2aWNlIH0gZnJvbSAnLi9mbG93cy9mbG93cy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmFuZG9tU2VydmljZSB9IGZyb20gJy4vZmxvd3MvcmFuZG9tL3JhbmRvbS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVzZXRBdXRoRGF0YVNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL3Jlc2V0LWF1dGgtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2lnbmluS2V5RGF0YVNlcnZpY2UgfSBmcm9tICcuL2Zsb3dzL3NpZ25pbi1rZXktZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2hlY2tTZXNzaW9uU2VydmljZSB9IGZyb20gJy4vaWZyYW1lL2NoZWNrLXNlc3Npb24uc2VydmljZSc7XHJcbmltcG9ydCB7IElGcmFtZVNlcnZpY2UgfSBmcm9tICcuL2lmcmFtZS9leGlzdGluZy1pZnJhbWUuc2VydmljZSc7XHJcbmltcG9ydCB7IFNpbGVudFJlbmV3U2VydmljZSB9IGZyb20gJy4vaWZyYW1lL3NpbGVudC1yZW5ldy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2xvc2VzdE1hdGNoaW5nUm91dGVTZXJ2aWNlIH0gZnJvbSAnLi9pbnRlcmNlcHRvci9jbG9zZXN0LW1hdGNoaW5nLXJvdXRlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBYnN0cmFjdExvZ2dlclNlcnZpY2UgfSBmcm9tICcuL2xvZ2dpbmcvYWJzdHJhY3QtbG9nZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb25zb2xlTG9nZ2VyU2VydmljZSB9IGZyb20gJy4vbG9nZ2luZy9jb25zb2xlLWxvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4vbG9nZ2luZy9sb2dnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2luU2VydmljZSB9IGZyb20gJy4vbG9naW4vbG9naW4uc2VydmljZSc7XHJcbmltcG9ydCB7IFBhckxvZ2luU2VydmljZSB9IGZyb20gJy4vbG9naW4vcGFyL3Bhci1sb2dpbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUGFyU2VydmljZSB9IGZyb20gJy4vbG9naW4vcGFyL3Bhci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUG9wVXBMb2dpblNlcnZpY2UgfSBmcm9tICcuL2xvZ2luL3BvcHVwL3BvcHVwLWxvZ2luLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZXNwb25zZVR5cGVWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4vbG9naW4vcmVzcG9uc2UtdHlwZS12YWxpZGF0aW9uL3Jlc3BvbnNlLXR5cGUtdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RhbmRhcmRMb2dpblNlcnZpY2UgfSBmcm9tICcuL2xvZ2luL3N0YW5kYXJkL3N0YW5kYXJkLWxvZ2luLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2dvZmZSZXZvY2F0aW9uU2VydmljZSB9IGZyb20gJy4vbG9nb2ZmLXJldm9rZS9sb2dvZmYtcmV2b2NhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5U2VydmljZSB9IGZyb20gJy4vb2lkYy5zZWN1cml0eS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHVibGljRXZlbnRzU2VydmljZSB9IGZyb20gJy4vcHVibGljLWV2ZW50cy9wdWJsaWMtZXZlbnRzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBYnN0cmFjdFNlY3VyaXR5U3RvcmFnZSB9IGZyb20gJy4vc3RvcmFnZS9hYnN0cmFjdC1zZWN1cml0eS1zdG9yYWdlJztcclxuaW1wb3J0IHsgQnJvd3NlclN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9zdG9yYWdlL2Jyb3dzZXItc3RvcmFnZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRGVmYXVsdFNlc3Npb25TdG9yYWdlU2VydmljZSB9IGZyb20gJy4vc3RvcmFnZS9kZWZhdWx0LXNlc3Npb25zdG9yYWdlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlIH0gZnJvbSAnLi9zdG9yYWdlL3N0b3JhZ2UtcGVyc2lzdGVuY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi91c2VyLWRhdGEvdXNlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ3J5cHRvU2VydmljZSB9IGZyb20gJy4vdXRpbHMvY3J5cHRvL2NyeXB0by5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRXF1YWxpdHlTZXJ2aWNlIH0gZnJvbSAnLi91dGlscy9lcXVhbGl0eS9lcXVhbGl0eS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmxvd0hlbHBlciB9IGZyb20gJy4vdXRpbHMvZmxvd0hlbHBlci9mbG93LWhlbHBlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUGxhdGZvcm1Qcm92aWRlciB9IGZyb20gJy4vdXRpbHMvcGxhdGZvcm0tcHJvdmlkZXIvcGxhdGZvcm0ucHJvdmlkZXInO1xyXG5pbXBvcnQgeyBUb2tlbkhlbHBlclNlcnZpY2UgfSBmcm9tICcuL3V0aWxzL3Rva2VuSGVscGVyL3Rva2VuLWhlbHBlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ3VycmVudFVybFNlcnZpY2UgfSBmcm9tICcuL3V0aWxzL3VybC9jdXJyZW50LXVybC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXJsU2VydmljZSB9IGZyb20gJy4vdXRpbHMvdXJsL3VybC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSndrV2luZG93Q3J5cHRvU2VydmljZSB9IGZyb20gJy4vdmFsaWRhdGlvbi9qd2std2luZG93LWNyeXB0by5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSnd0V2luZG93Q3J5cHRvU2VydmljZSB9IGZyb20gJy4vdmFsaWRhdGlvbi9qd3Qtd2luZG93LWNyeXB0by5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RhdGVWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4vdmFsaWRhdGlvbi9zdGF0ZS12YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBUb2tlblZhbGlkYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi92YWxpZGF0aW9uL3Rva2VuLXZhbGlkYXRpb24uc2VydmljZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhc3NlZEluaXRpYWxDb25maWcge1xyXG4gIGNvbmZpZz86IE9wZW5JZENvbmZpZ3VyYXRpb24gfCBPcGVuSWRDb25maWd1cmF0aW9uW107XHJcbiAgbG9hZGVyPzogUHJvdmlkZXI7XHJcbiAgc3RvcmFnZT86IGFueTtcclxufVxyXG5cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9leHBsaWNpdC1mdW5jdGlvbi1yZXR1cm4tdHlwZVxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RhdGljTG9hZGVyKHBhc3NlZENvbmZpZzogUGFzc2VkSW5pdGlhbENvbmZpZykge1xyXG4gIHJldHVybiBuZXcgU3RzQ29uZmlnU3RhdGljTG9hZGVyKHBhc3NlZENvbmZpZy5jb25maWcpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgUEFTU0VEX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxQYXNzZWRJbml0aWFsQ29uZmlnPignUEFTU0VEX0NPTkZJRycpO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBIdHRwQ2xpZW50TW9kdWxlXSxcclxuICBkZWNsYXJhdGlvbnM6IFtdLFxyXG4gIGV4cG9ydHM6IFtdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXV0aE1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QocGFzc2VkQ29uZmlnOiBQYXNzZWRJbml0aWFsQ29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVyczxBdXRoTW9kdWxlPiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuZ01vZHVsZTogQXV0aE1vZHVsZSxcclxuICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgLy8gTWFrZSB0aGUgUEFTU0VEX0NPTkZJRyBhdmFpbGFibGUgdGhyb3VnaCBpbmplY3Rpb25cclxuICAgICAgICB7IHByb3ZpZGU6IFBBU1NFRF9DT05GSUcsIHVzZVZhbHVlOiBwYXNzZWRDb25maWcgfSxcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBsb2FkZXI6IEVpdGhlciB0aGUgb25lIGdldHRpbmcgcGFzc2VkIG9yIGEgc3RhdGljIG9uZVxyXG4gICAgICAgIHBhc3NlZENvbmZpZz8ubG9hZGVyIHx8IHsgcHJvdmlkZTogU3RzQ29uZmlnTG9hZGVyLCB1c2VGYWN0b3J5OiBjcmVhdGVTdGF0aWNMb2FkZXIsIGRlcHM6IFtQQVNTRURfQ09ORklHXSB9LFxyXG4gICAgICAgIENvbmZpZ3VyYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIFB1YmxpY0V2ZW50c1NlcnZpY2UsXHJcbiAgICAgICAgRmxvd0hlbHBlcixcclxuICAgICAgICBPaWRjU2VjdXJpdHlTZXJ2aWNlLFxyXG4gICAgICAgIFRva2VuVmFsaWRhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgUGxhdGZvcm1Qcm92aWRlcixcclxuICAgICAgICBDaGVja1Nlc3Npb25TZXJ2aWNlLFxyXG4gICAgICAgIEZsb3dzRGF0YVNlcnZpY2UsXHJcbiAgICAgICAgRmxvd3NTZXJ2aWNlLFxyXG4gICAgICAgIFNpbGVudFJlbmV3U2VydmljZSxcclxuICAgICAgICBMb2dvZmZSZXZvY2F0aW9uU2VydmljZSxcclxuICAgICAgICBVc2VyU2VydmljZSxcclxuICAgICAgICBSYW5kb21TZXJ2aWNlLFxyXG4gICAgICAgIEh0dHBCYXNlU2VydmljZSxcclxuICAgICAgICBVcmxTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhTdGF0ZVNlcnZpY2UsXHJcbiAgICAgICAgU2lnbmluS2V5RGF0YVNlcnZpY2UsXHJcbiAgICAgICAgU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSxcclxuICAgICAgICBUb2tlbkhlbHBlclNlcnZpY2UsXHJcbiAgICAgICAgSUZyYW1lU2VydmljZSxcclxuICAgICAgICBFcXVhbGl0eVNlcnZpY2UsXHJcbiAgICAgICAgTG9naW5TZXJ2aWNlLFxyXG4gICAgICAgIFBhclNlcnZpY2UsXHJcbiAgICAgICAgQXV0aFdlbGxLbm93bkRhdGFTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhXZWxsS25vd25TZXJ2aWNlLFxyXG4gICAgICAgIERhdGFTZXJ2aWNlLFxyXG4gICAgICAgIFN0YXRlVmFsaWRhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgQ29uZmlnVmFsaWRhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgQ2hlY2tBdXRoU2VydmljZSxcclxuICAgICAgICBSZXNldEF1dGhEYXRhU2VydmljZSxcclxuICAgICAgICBJbXBsaWNpdEZsb3dDYWxsYmFja1NlcnZpY2UsXHJcbiAgICAgICAgSGlzdG9yeUp3dEtleXNDYWxsYmFja0hhbmRsZXJTZXJ2aWNlLFxyXG4gICAgICAgIFJlc3BvbnNlVHlwZVZhbGlkYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIFVzZXJDYWxsYmFja0hhbmRsZXJTZXJ2aWNlLFxyXG4gICAgICAgIFN0YXRlVmFsaWRhdGlvbkNhbGxiYWNrSGFuZGxlclNlcnZpY2UsXHJcbiAgICAgICAgUmVmcmVzaFNlc3Npb25DYWxsYmFja0hhbmRsZXJTZXJ2aWNlLFxyXG4gICAgICAgIFJlZnJlc2hUb2tlbkNhbGxiYWNrSGFuZGxlclNlcnZpY2UsXHJcbiAgICAgICAgQ29kZUZsb3dDYWxsYmFja0hhbmRsZXJTZXJ2aWNlLFxyXG4gICAgICAgIEltcGxpY2l0Rmxvd0NhbGxiYWNrSGFuZGxlclNlcnZpY2UsXHJcbiAgICAgICAgUGFyTG9naW5TZXJ2aWNlLFxyXG4gICAgICAgIFBvcFVwTG9naW5TZXJ2aWNlLFxyXG4gICAgICAgIFN0YW5kYXJkTG9naW5TZXJ2aWNlLFxyXG4gICAgICAgIEF1dG9Mb2dpblNlcnZpY2UsXHJcbiAgICAgICAgSndrRXh0cmFjdG9yLFxyXG4gICAgICAgIEp3a1dpbmRvd0NyeXB0b1NlcnZpY2UsXHJcbiAgICAgICAgSnd0V2luZG93Q3J5cHRvU2VydmljZSxcclxuICAgICAgICBDdXJyZW50VXJsU2VydmljZSxcclxuICAgICAgICBDbG9zZXN0TWF0Y2hpbmdSb3V0ZVNlcnZpY2UsXHJcbiAgICAgICAgRGVmYXVsdFNlc3Npb25TdG9yYWdlU2VydmljZSxcclxuICAgICAgICBCcm93c2VyU3RvcmFnZVNlcnZpY2UsXHJcbiAgICAgICAgQ3J5cHRvU2VydmljZSxcclxuICAgICAgICBMb2dnZXJTZXJ2aWNlLFxyXG5cclxuICAgICAgICB7IHByb3ZpZGU6IEFic3RyYWN0U2VjdXJpdHlTdG9yYWdlLCB1c2VDbGFzczogRGVmYXVsdFNlc3Npb25TdG9yYWdlU2VydmljZSB9LFxyXG4gICAgICAgIHsgcHJvdmlkZTogQWJzdHJhY3RMb2dnZXJTZXJ2aWNlLCB1c2VDbGFzczogQ29uc29sZUxvZ2dlclNlcnZpY2UgfSxcclxuICAgICAgXSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiJdfQ==