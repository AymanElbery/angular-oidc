import { Injectable } from '@angular/core';
import { concatMap, map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./iframe/check-session.service";
import * as i2 from "./auth-state/check-auth.service";
import * as i3 from "./user-data/user.service";
import * as i4 from "./utils/tokenHelper/token-helper.service";
import * as i5 from "./config/config.service";
import * as i6 from "./auth-state/auth-state.service";
import * as i7 from "./flows/flows-data.service";
import * as i8 from "./callback/callback.service";
import * as i9 from "./logoff-revoke/logoff-revocation.service";
import * as i10 from "./login/login.service";
import * as i11 from "./callback/refresh-session.service";
import * as i12 from "./utils/url/url.service";
import * as i13 from "./config/auth-well-known/auth-well-known.service";
export class OidcSecurityService {
    constructor(checkSessionService, checkAuthService, userService, tokenHelperService, configurationService, authStateService, flowsDataService, callbackService, logoffRevocationService, loginService, refreshSessionService, urlService, authWellKnownService) {
        this.checkSessionService = checkSessionService;
        this.checkAuthService = checkAuthService;
        this.userService = userService;
        this.tokenHelperService = tokenHelperService;
        this.configurationService = configurationService;
        this.authStateService = authStateService;
        this.flowsDataService = flowsDataService;
        this.callbackService = callbackService;
        this.logoffRevocationService = logoffRevocationService;
        this.loginService = loginService;
        this.refreshSessionService = refreshSessionService;
        this.urlService = urlService;
        this.authWellKnownService = authWellKnownService;
    }
    /**
     * Provides information about the user after they have logged in.
     *
     * @returns Returns an object containing either the user data directly (single config) or
     * the user data per config in case you are running with multiple configs
     */
    get userData$() {
        return this.userService.userData$;
    }
    /**
     * Emits each time an authorization event occurs.
     *
     * @returns Returns an object containing if you are authenticated or not.
     * Single Config: true if config is authenticated, false if not.
     * Multiple Configs: true is all configs are authenticated, false if only one of them is not
     *
     * The `allConfigsAuthenticated` property contains the auth information _per config_.
     */
    get isAuthenticated$() {
        return this.authStateService.authenticated$;
    }
    /**
     * Emits each time the server sends a CheckSession event and the value changed. This property will always return
     * true.
     */
    get checkSessionChanged$() {
        return this.checkSessionService.checkSessionChanged$;
    }
    /**
     * Emits on a Security Token Service callback. The observable will never contain a value.
     */
    get stsCallback$() {
        return this.callbackService.stsCallback$;
    }
    preloadAuthWellKnownDocument(configId) {
        return this.configurationService
            .getOpenIDConfiguration(configId)
            .pipe(concatMap((config) => this.authWellKnownService.queryAndStoreAuthWellKnownEndPoints(config)));
    }
    /**
     * Returns the currently active OpenID configurations.
     *
     * @returns an array of OpenIdConfigurations.
     */
    getConfigurations() {
        return this.configurationService.getAllConfigurations();
    }
    /**
     * Returns a single active OpenIdConfiguration.
     *
     * @param configId The configId to identify the config. If not passed, the first one is being returned
     */
    getConfiguration(configId) {
        return this.configurationService.getOpenIDConfiguration(configId);
    }
    /**
     * Returns the userData for a configuration
     *
     * @param configId The configId to identify the config. If not passed, the first one is being used
     */
    getUserData(configId) {
        return this.configurationService.getOpenIDConfiguration(configId).pipe(map((config) => this.userService.getUserDataFromStore(config)));
    }
    /**
     * Starts the complete setup flow for one configuration. Calling will start the entire authentication flow, and the returned observable
     * will denote whether the user was successfully authenticated including the user data, the access token, the configId and
     * an error message in case an error happened
     *
     * @param url The URL to perform the authorization on the behalf of.
     * @param configId The configId to perform the authorization on the behalf of. If not passed, the first configs will be taken
     *
     * @returns An object `LoginResponse` containing all information about the login
     */
    checkAuth(url, configId) {
        return this.configurationService
            .getOpenIDConfigurations(configId)
            .pipe(concatMap(({ allConfigs, currentConfig }) => this.checkAuthService.checkAuth(currentConfig, allConfigs, url)));
    }
    /**
     * Starts the complete setup flow for multiple configurations.
     * Calling will start the entire authentication flow, and the returned observable
     * will denote whether the user was successfully authenticated including the user data, the access token, the configId and
     * an error message in case an error happened in an array for each config which was provided
     *
     * @param url The URL to perform the authorization on the behalf of.
     * @param configId The configId to perform the authorization on the behalf of. If not passed, all of the current
     * configured ones will be used to check.
     *
     * @returns An array of `LoginResponse` objects containing all information about the logins
     */
    checkAuthMultiple(url) {
        return this.configurationService
            .getOpenIDConfigurations()
            .pipe(concatMap(({ allConfigs }) => this.checkAuthService.checkAuthMultiple(allConfigs, url)));
    }
    /**
     * Provides information about the current authenticated state
     *
     * @param configId The configId to check the information for. If not passed, the first configs will be taken
     *
     * @returns A boolean whether the config is authenticated or not.
     */
    isAuthenticated(configId) {
        return this.configurationService.getOpenIDConfiguration(configId).pipe(map((config) => this.authStateService.isAuthenticated(config)));
    }
    /**
     * Checks the server for an authenticated session using the iframe silent renew if not locally authenticated.
     */
    checkAuthIncludingServer(configId) {
        return this.configurationService
            .getOpenIDConfigurations(configId)
            .pipe(concatMap(({ allConfigs, currentConfig }) => this.checkAuthService.checkAuthIncludingServer(currentConfig, allConfigs)));
    }
    /**
     * Returns the access token for the login scenario.
     *
     * @param configId The configId to check the information for. If not passed, the first configs will be taken
     *
     * @returns A string with the access token.
     */
    getAccessToken(configId) {
        return this.configurationService.getOpenIDConfiguration(configId).pipe(map((config) => this.authStateService.getAccessToken(config)));
    }
    /**
     * Returns the ID token for the sign-in.
     *
     * @param configId The configId to check the information for. If not passed, the first configs will be taken
     *
     * @returns A string with the id token.
     */
    getIdToken(configId) {
        return this.configurationService.getOpenIDConfiguration(configId).pipe(map((config) => this.authStateService.getIdToken(config)));
    }
    /**
     * Returns the refresh token, if present, for the sign-in.
     *
     * @param configId The configId to check the information for. If not passed, the first configs will be taken
     *
     * @returns A string with the refresh token.
     */
    getRefreshToken(configId) {
        return this.configurationService.getOpenIDConfiguration(configId).pipe(map((config) => this.authStateService.getRefreshToken(config)));
    }
    /**
     * Returns the authentication result, if present, for the sign-in.
     *
     * @param configId The configId to check the information for. If not passed, the first configs will be taken
     *
     * @returns A object with the authentication result
     */
    getAuthenticationResult(configId) {
        return this.configurationService
            .getOpenIDConfiguration(configId)
            .pipe(map((config) => this.authStateService.getAuthenticationResult(config)));
    }
    /**
     * Returns the payload from the ID token.
     *
     * @param encode Set to true if the payload is base64 encoded
     * @param configId The configId to check the information for. If not passed, the first configs will be taken
     *
     * @returns The payload from the id token.
     */
    getPayloadFromIdToken(encode = false, configId) {
        return this.configurationService.getOpenIDConfiguration(configId).pipe(map((config) => {
            const token = this.authStateService.getIdToken(config);
            return this.tokenHelperService.getPayloadFromToken(token, encode, config);
        }));
    }
    /**
     * Returns the payload from the access token.
     *
     * @param encode Set to true if the payload is base64 encoded
     * @param configId The configId to check the information for. If not passed, the first configs will be taken
     *
     * @returns The payload from the access token.
     */
    getPayloadFromAccessToken(encode = false, configId) {
        return this.configurationService.getOpenIDConfiguration(configId).pipe(map((config) => {
            const token = this.authStateService.getAccessToken(config);
            return this.tokenHelperService.getPayloadFromToken(token, encode, config);
        }));
    }
    /**
     * Sets a custom state for the authorize request.
     *
     * @param state The state to set.
     * @param configId The configId to check the information for. If not passed, the first configs will be taken
     */
    setState(state, configId) {
        return this.configurationService
            .getOpenIDConfiguration(configId)
            .pipe(map((config) => this.flowsDataService.setAuthStateControl(state, config)));
    }
    /**
     * Gets the state value used for the authorize request.
     *
     * @param configId The configId to check the information for. If not passed, the first configs will be taken
     *
     * @returns The state value used for the authorize request.
     */
    getState(configId) {
        return this.configurationService
            .getOpenIDConfiguration(configId)
            .pipe(map((config) => this.flowsDataService.getAuthStateControl(config)));
    }
    /**
     * Redirects the user to the Security Token Service to begin the authentication process.
     *
     * @param configId The configId to perform the action in behalf of. If not passed, the first configs will be taken
     * @param authOptions The custom options for the the authentication request.
     */
    
    /**
     * Opens the Security Token Service in a new window to begin the authentication process.
     *
     * @param authOptions The custom options for the authentication request.
     * @param popupOptions The configuration for the popup window.
     * @param configId The configId to perform the action in behalf of. If not passed, the first configs will be taken
     *
     * @returns An `Observable<LoginResponse>` containing all information about the login
     */
    authorizeWithPopUp(authOptions, popupOptions, configId) {
        return this.configurationService
            .getOpenIDConfigurations(configId)
            .pipe(concatMap(({ allConfigs, currentConfig }) => this.loginService.loginWithPopUp(currentConfig, allConfigs, authOptions, popupOptions)));
    }
    /**
     * Manually refreshes the session.
     *
     * @param customParams Custom parameters to pass to the refresh request.
     * @param configId The configId to perform the action in behalf of. If not passed, the first configs will be taken
     *
     * @returns An `Observable<LoginResponse>` containing all information about the login
     */
    forceRefreshSession(customParams, configId) {
        return this.configurationService
            .getOpenIDConfigurations(configId)
            .pipe(concatMap(({ allConfigs, currentConfig }) => this.refreshSessionService.userForceRefreshSession(currentConfig, allConfigs, customParams)));
    }
    /**
     * Revokes the refresh token (if present) and the access token on the server and then performs the logoff operation.
     * The refresh token and and the access token are revoked on the server. If the refresh token does not exist
     * only the access token is revoked. Then the logout run.
     *
     * @param configId The configId to perform the action in behalf of. If not passed, the first configs will be taken
     * @param authOptions The custom options for the request.
     *
     * @returns An observable when the action is finished
     */
    logoffAndRevokeTokens(configId, logoutAuthOptions) {
        return this.configurationService
            .getOpenIDConfigurations(configId)
            .pipe(concatMap(({ allConfigs, currentConfig }) => this.logoffRevocationService.logoffAndRevokeTokens(currentConfig, allConfigs, logoutAuthOptions)));
    }
    /**
     * Logs out on the server and the local client. If the server state has changed, confirmed via check session,
     * then only a local logout is performed.
     *
     * @param configId The configId to perform the action in behalf of. If not passed, the first configs will be taken
     * @param authOptions with custom parameters and/or an custom url handler
     */
    logoff(configId, logoutAuthOptions) {
        return this.configurationService
            .getOpenIDConfigurations(configId)
            .pipe(concatMap(({ allConfigs, currentConfig }) => this.logoffRevocationService.logoff(currentConfig, allConfigs, logoutAuthOptions)));
    }
    /**
     * Logs the user out of the application without logging them out of the server.
     * Use this method if you have _one_ config enabled.
     *
     * @param configId The configId to perform the action in behalf of. If not passed, the first configs will be taken
     */
    logoffLocal(configId) {
        this.configurationService
            .getOpenIDConfigurations(configId)
            .subscribe(({ allConfigs, currentConfig }) => this.logoffRevocationService.logoffLocal(currentConfig, allConfigs));
    }
    /**
     * Logs the user out of the application for all configs without logging them out of the server.
     * Use this method if you have _multiple_ configs enabled.
     */
    logoffLocalMultiple() {
        this.configurationService
            .getOpenIDConfigurations()
            .subscribe(({ allConfigs }) => this.logoffRevocationService.logoffLocalMultiple(allConfigs));
    }
    /**
     * Revokes an access token on the Security Token Service. This is only required in the code flow with refresh tokens. If no token is
     * provided, then the token from the storage is revoked. You can pass any token to revoke.
     * https://tools.ietf.org/html/rfc7009
     *
     * @param accessToken The access token to revoke.
     * @param configId The configId to perform the action in behalf of. If not passed, the first configs will be taken
     *
     * @returns An observable when the action is finished
     */
    revokeAccessToken(accessToken, configId) {
        return this.configurationService
            .getOpenIDConfiguration(configId)
            .pipe(concatMap((config) => this.logoffRevocationService.revokeAccessToken(config, accessToken)));
    }
    /**
     * Revokes a refresh token on the Security Token Service. This is only required in the code flow with refresh tokens. If no token is
     * provided, then the token from the storage is revoked. You can pass any token to revoke.
     * https://tools.ietf.org/html/rfc7009
     *
     * @param refreshToken The access token to revoke.
     * @param configId The configId to perform the action in behalf of. If not passed, the first configs will be taken
     *
     * @returns An observable when the action is finished
     */
    revokeRefreshToken(refreshToken, configId) {
        return this.configurationService
            .getOpenIDConfiguration(configId)
            .pipe(concatMap((config) => this.logoffRevocationService.revokeRefreshToken(config, refreshToken)));
    }
    /**
     * Creates the end session URL which can be used to implement an alternate server logout.
     *
     * @param customParams
     * @param configId The configId to perform the action in behalf of. If not passed, the first configs will be taken
     *
     * @returns A string with the end session url or null
     */
    getEndSessionUrl(customParams, configId) {
        return this.configurationService
            .getOpenIDConfiguration(configId)
            .pipe(map((config) => this.urlService.getEndSessionUrl(config, customParams)));
    }
    /**
     * Creates the authorize URL based on your flow
     *
     * @param customParams
     * @param configId The configId to perform the action in behalf of. If not passed, the first configs will be taken
     *
     * @returns A string with the authorize URL or null
     */
    getAuthorizeUrl(customParams, configId) {
        return this.configurationService
            .getOpenIDConfiguration(configId)
            .pipe(concatMap((config) => this.urlService.getAuthorizeUrl(config, customParams ? { customParams } : undefined)));
    }
}
OidcSecurityService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: OidcSecurityService, deps: [{ token: i1.CheckSessionService }, { token: i2.CheckAuthService }, { token: i3.UserService }, { token: i4.TokenHelperService }, { token: i5.ConfigurationService }, { token: i6.AuthStateService }, { token: i7.FlowsDataService }, { token: i8.CallbackService }, { token: i9.LogoffRevocationService }, { token: i10.LoginService }, { token: i11.RefreshSessionService }, { token: i12.UrlService }, { token: i13.AuthWellKnownService }], target: i0.ɵɵFactoryTarget.Injectable });
OidcSecurityService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: OidcSecurityService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: OidcSecurityService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CheckSessionService }, { type: i2.CheckAuthService }, { type: i3.UserService }, { type: i4.TokenHelperService }, { type: i5.ConfigurationService }, { type: i6.AuthStateService }, { type: i7.FlowsDataService }, { type: i8.CallbackService }, { type: i9.LogoffRevocationService }, { type: i10.LoginService }, { type: i11.RefreshSessionService }, { type: i12.UrlService }, { type: i13.AuthWellKnownService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy9saWIvb2lkYy5zZWN1cml0eS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FBdUJoRCxNQUFNLE9BQU8sbUJBQW1CO0lBdUM5QixZQUNtQixtQkFBd0MsRUFDeEMsZ0JBQWtDLEVBQ2xDLFdBQXdCLEVBQ3hCLGtCQUFzQyxFQUN0QyxvQkFBMEMsRUFDMUMsZ0JBQWtDLEVBQ2xDLGdCQUFrQyxFQUNsQyxlQUFnQyxFQUNoQyx1QkFBZ0QsRUFDaEQsWUFBMEIsRUFDMUIscUJBQTRDLEVBQzVDLFVBQXNCLEVBQ3RCLG9CQUEwQztRQVoxQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0Qyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtRQUNoRCxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtJQUMxRCxDQUFDO0lBcERKOzs7OztP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RixPQUFPLElBQUksQ0FBQyxvQkFBb0I7YUFDN0Isc0JBQXNCLENBQUMsUUFBUSxDQUFDO2FBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2SCxDQUFDOztnSEF6WlUsbUJBQW1CO29IQUFuQixtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFEL0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBjb25jYXRNYXAsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQXV0aE9wdGlvbnMsIExvZ291dEF1dGhPcHRpb25zIH0gZnJvbSAnLi9hdXRoLW9wdGlvbnMnO1xyXG5pbXBvcnQgeyBBdXRoZW50aWNhdGVkUmVzdWx0IH0gZnJvbSAnLi9hdXRoLXN0YXRlL2F1dGgtcmVzdWx0JztcclxuaW1wb3J0IHsgQXV0aFN0YXRlU2VydmljZSB9IGZyb20gJy4vYXV0aC1zdGF0ZS9hdXRoLXN0YXRlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDaGVja0F1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLXN0YXRlL2NoZWNrLWF1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IENhbGxiYWNrU2VydmljZSB9IGZyb20gJy4vY2FsbGJhY2svY2FsbGJhY2suc2VydmljZSc7XHJcbmltcG9ydCB7IFJlZnJlc2hTZXNzaW9uU2VydmljZSB9IGZyb20gJy4vY2FsbGJhY2svcmVmcmVzaC1zZXNzaW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRoV2VsbEtub3duRW5kcG9pbnRzIH0gZnJvbSAnLi9jb25maWcvYXV0aC13ZWxsLWtub3duL2F1dGgtd2VsbC1rbm93bi1lbmRwb2ludHMnO1xyXG5pbXBvcnQgeyBBdXRoV2VsbEtub3duU2VydmljZSB9IGZyb20gJy4vY29uZmlnL2F1dGgtd2VsbC1rbm93bi9hdXRoLXdlbGwta25vd24uc2VydmljZSc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9jb25maWcvY29uZmlnLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9jb25maWcvb3BlbmlkLWNvbmZpZ3VyYXRpb24nO1xyXG5pbXBvcnQgeyBGbG93c0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi9mbG93cy9mbG93cy1kYXRhLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDaGVja1Nlc3Npb25TZXJ2aWNlIH0gZnJvbSAnLi9pZnJhbWUvY2hlY2stc2Vzc2lvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9naW5SZXNwb25zZSB9IGZyb20gJy4vbG9naW4vbG9naW4tcmVzcG9uc2UnO1xyXG5pbXBvcnQgeyBMb2dpblNlcnZpY2UgfSBmcm9tICcuL2xvZ2luL2xvZ2luLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQb3B1cE9wdGlvbnMgfSBmcm9tICcuL2xvZ2luL3BvcHVwL3BvcHVwLW9wdGlvbnMnO1xyXG5pbXBvcnQgeyBMb2dvZmZSZXZvY2F0aW9uU2VydmljZSB9IGZyb20gJy4vbG9nb2ZmLXJldm9rZS9sb2dvZmYtcmV2b2NhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuL3VzZXItZGF0YS91c2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyRGF0YVJlc3VsdCB9IGZyb20gJy4vdXNlci1kYXRhL3VzZXJkYXRhLXJlc3VsdCc7XHJcbmltcG9ydCB7IFRva2VuSGVscGVyU2VydmljZSB9IGZyb20gJy4vdXRpbHMvdG9rZW5IZWxwZXIvdG9rZW4taGVscGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVcmxTZXJ2aWNlIH0gZnJvbSAnLi91dGlscy91cmwvdXJsLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgT2lkY1NlY3VyaXR5U2VydmljZSB7XHJcbiAgLyoqXHJcbiAgICogUHJvdmlkZXMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHVzZXIgYWZ0ZXIgdGhleSBoYXZlIGxvZ2dlZCBpbi5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgZWl0aGVyIHRoZSB1c2VyIGRhdGEgZGlyZWN0bHkgKHNpbmdsZSBjb25maWcpIG9yXHJcbiAgICogdGhlIHVzZXIgZGF0YSBwZXIgY29uZmlnIGluIGNhc2UgeW91IGFyZSBydW5uaW5nIHdpdGggbXVsdGlwbGUgY29uZmlnc1xyXG4gICAqL1xyXG4gIGdldCB1c2VyRGF0YSQoKTogT2JzZXJ2YWJsZTxVc2VyRGF0YVJlc3VsdD4ge1xyXG4gICAgcmV0dXJuIHRoaXMudXNlclNlcnZpY2UudXNlckRhdGEkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHMgZWFjaCB0aW1lIGFuIGF1dGhvcml6YXRpb24gZXZlbnQgb2NjdXJzLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyBpZiB5b3UgYXJlIGF1dGhlbnRpY2F0ZWQgb3Igbm90LlxyXG4gICAqIFNpbmdsZSBDb25maWc6IHRydWUgaWYgY29uZmlnIGlzIGF1dGhlbnRpY2F0ZWQsIGZhbHNlIGlmIG5vdC5cclxuICAgKiBNdWx0aXBsZSBDb25maWdzOiB0cnVlIGlzIGFsbCBjb25maWdzIGFyZSBhdXRoZW50aWNhdGVkLCBmYWxzZSBpZiBvbmx5IG9uZSBvZiB0aGVtIGlzIG5vdFxyXG4gICAqXHJcbiAgICogVGhlIGBhbGxDb25maWdzQXV0aGVudGljYXRlZGAgcHJvcGVydHkgY29udGFpbnMgdGhlIGF1dGggaW5mb3JtYXRpb24gX3BlciBjb25maWdfLlxyXG4gICAqL1xyXG4gIGdldCBpc0F1dGhlbnRpY2F0ZWQkKCk6IE9ic2VydmFibGU8QXV0aGVudGljYXRlZFJlc3VsdD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuYXV0aFN0YXRlU2VydmljZS5hdXRoZW50aWNhdGVkJDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXRzIGVhY2ggdGltZSB0aGUgc2VydmVyIHNlbmRzIGEgQ2hlY2tTZXNzaW9uIGV2ZW50IGFuZCB0aGUgdmFsdWUgY2hhbmdlZC4gVGhpcyBwcm9wZXJ0eSB3aWxsIGFsd2F5cyByZXR1cm5cclxuICAgKiB0cnVlLlxyXG4gICAqL1xyXG4gIGdldCBjaGVja1Nlc3Npb25DaGFuZ2VkJCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgIHJldHVybiB0aGlzLmNoZWNrU2Vzc2lvblNlcnZpY2UuY2hlY2tTZXNzaW9uQ2hhbmdlZCQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbWl0cyBvbiBhIFNlY3VyaXR5IFRva2VuIFNlcnZpY2UgY2FsbGJhY2suIFRoZSBvYnNlcnZhYmxlIHdpbGwgbmV2ZXIgY29udGFpbiBhIHZhbHVlLlxyXG4gICAqL1xyXG4gIGdldCBzdHNDYWxsYmFjayQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLmNhbGxiYWNrU2VydmljZS5zdHNDYWxsYmFjayQ7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2hlY2tTZXNzaW9uU2VydmljZTogQ2hlY2tTZXNzaW9uU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2hlY2tBdXRoU2VydmljZTogQ2hlY2tBdXRoU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSB0b2tlbkhlbHBlclNlcnZpY2U6IFRva2VuSGVscGVyU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29uZmlndXJhdGlvblNlcnZpY2U6IENvbmZpZ3VyYXRpb25TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhdXRoU3RhdGVTZXJ2aWNlOiBBdXRoU3RhdGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBmbG93c0RhdGFTZXJ2aWNlOiBGbG93c0RhdGFTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjYWxsYmFja1NlcnZpY2U6IENhbGxiYWNrU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9nb2ZmUmV2b2NhdGlvblNlcnZpY2U6IExvZ29mZlJldm9jYXRpb25TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBsb2dpblNlcnZpY2U6IExvZ2luU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVmcmVzaFNlc3Npb25TZXJ2aWNlOiBSZWZyZXNoU2Vzc2lvblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHVybFNlcnZpY2U6IFVybFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGF1dGhXZWxsS25vd25TZXJ2aWNlOiBBdXRoV2VsbEtub3duU2VydmljZVxyXG4gICkge31cclxuXHJcbiAgcHJlbG9hZEF1dGhXZWxsS25vd25Eb2N1bWVudChjb25maWdJZD86IHN0cmluZyk6IE9ic2VydmFibGU8QXV0aFdlbGxLbm93bkVuZHBvaW50cz4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2VcclxuICAgICAgLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oY29uZmlnSWQpXHJcbiAgICAgIC5waXBlKGNvbmNhdE1hcCgoY29uZmlnKSA9PiB0aGlzLmF1dGhXZWxsS25vd25TZXJ2aWNlLnF1ZXJ5QW5kU3RvcmVBdXRoV2VsbEtub3duRW5kUG9pbnRzKGNvbmZpZykpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnRseSBhY3RpdmUgT3BlbklEIGNvbmZpZ3VyYXRpb25zLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgYW4gYXJyYXkgb2YgT3BlbklkQ29uZmlndXJhdGlvbnMuXHJcbiAgICovXHJcbiAgZ2V0Q29uZmlndXJhdGlvbnMoKTogT3BlbklkQ29uZmlndXJhdGlvbltdIHtcclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEFsbENvbmZpZ3VyYXRpb25zKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgc2luZ2xlIGFjdGl2ZSBPcGVuSWRDb25maWd1cmF0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvbmZpZ0lkIFRoZSBjb25maWdJZCB0byBpZGVudGlmeSB0aGUgY29uZmlnLiBJZiBub3QgcGFzc2VkLCB0aGUgZmlyc3Qgb25lIGlzIGJlaW5nIHJldHVybmVkXHJcbiAgICovXHJcbiAgZ2V0Q29uZmlndXJhdGlvbihjb25maWdJZD86IHN0cmluZyk6IE9ic2VydmFibGU8T3BlbklkQ29uZmlndXJhdGlvbj4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0T3BlbklEQ29uZmlndXJhdGlvbihjb25maWdJZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSB1c2VyRGF0YSBmb3IgYSBjb25maWd1cmF0aW9uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29uZmlnSWQgVGhlIGNvbmZpZ0lkIHRvIGlkZW50aWZ5IHRoZSBjb25maWcuIElmIG5vdCBwYXNzZWQsIHRoZSBmaXJzdCBvbmUgaXMgYmVpbmcgdXNlZFxyXG4gICAqL1xyXG4gIGdldFVzZXJEYXRhKGNvbmZpZ0lkPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oY29uZmlnSWQpLnBpcGUobWFwKChjb25maWcpID0+IHRoaXMudXNlclNlcnZpY2UuZ2V0VXNlckRhdGFGcm9tU3RvcmUoY29uZmlnKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU3RhcnRzIHRoZSBjb21wbGV0ZSBzZXR1cCBmbG93IGZvciBvbmUgY29uZmlndXJhdGlvbi4gQ2FsbGluZyB3aWxsIHN0YXJ0IHRoZSBlbnRpcmUgYXV0aGVudGljYXRpb24gZmxvdywgYW5kIHRoZSByZXR1cm5lZCBvYnNlcnZhYmxlXHJcbiAgICogd2lsbCBkZW5vdGUgd2hldGhlciB0aGUgdXNlciB3YXMgc3VjY2Vzc2Z1bGx5IGF1dGhlbnRpY2F0ZWQgaW5jbHVkaW5nIHRoZSB1c2VyIGRhdGEsIHRoZSBhY2Nlc3MgdG9rZW4sIHRoZSBjb25maWdJZCBhbmRcclxuICAgKiBhbiBlcnJvciBtZXNzYWdlIGluIGNhc2UgYW4gZXJyb3IgaGFwcGVuZWRcclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmwgVGhlIFVSTCB0byBwZXJmb3JtIHRoZSBhdXRob3JpemF0aW9uIG9uIHRoZSBiZWhhbGYgb2YuXHJcbiAgICogQHBhcmFtIGNvbmZpZ0lkIFRoZSBjb25maWdJZCB0byBwZXJmb3JtIHRoZSBhdXRob3JpemF0aW9uIG9uIHRoZSBiZWhhbGYgb2YuIElmIG5vdCBwYXNzZWQsIHRoZSBmaXJzdCBjb25maWdzIHdpbGwgYmUgdGFrZW5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIG9iamVjdCBgTG9naW5SZXNwb25zZWAgY29udGFpbmluZyBhbGwgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGxvZ2luXHJcbiAgICovXHJcbiAgY2hlY2tBdXRoKHVybD86IHN0cmluZywgY29uZmlnSWQ/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPExvZ2luUmVzcG9uc2U+IHtcclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlXHJcbiAgICAgIC5nZXRPcGVuSURDb25maWd1cmF0aW9ucyhjb25maWdJZClcclxuICAgICAgLnBpcGUoY29uY2F0TWFwKCh7IGFsbENvbmZpZ3MsIGN1cnJlbnRDb25maWcgfSkgPT4gdGhpcy5jaGVja0F1dGhTZXJ2aWNlLmNoZWNrQXV0aChjdXJyZW50Q29uZmlnLCBhbGxDb25maWdzLCB1cmwpKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdGFydHMgdGhlIGNvbXBsZXRlIHNldHVwIGZsb3cgZm9yIG11bHRpcGxlIGNvbmZpZ3VyYXRpb25zLlxyXG4gICAqIENhbGxpbmcgd2lsbCBzdGFydCB0aGUgZW50aXJlIGF1dGhlbnRpY2F0aW9uIGZsb3csIGFuZCB0aGUgcmV0dXJuZWQgb2JzZXJ2YWJsZVxyXG4gICAqIHdpbGwgZGVub3RlIHdoZXRoZXIgdGhlIHVzZXIgd2FzIHN1Y2Nlc3NmdWxseSBhdXRoZW50aWNhdGVkIGluY2x1ZGluZyB0aGUgdXNlciBkYXRhLCB0aGUgYWNjZXNzIHRva2VuLCB0aGUgY29uZmlnSWQgYW5kXHJcbiAgICogYW4gZXJyb3IgbWVzc2FnZSBpbiBjYXNlIGFuIGVycm9yIGhhcHBlbmVkIGluIGFuIGFycmF5IGZvciBlYWNoIGNvbmZpZyB3aGljaCB3YXMgcHJvdmlkZWRcclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmwgVGhlIFVSTCB0byBwZXJmb3JtIHRoZSBhdXRob3JpemF0aW9uIG9uIHRoZSBiZWhhbGYgb2YuXHJcbiAgICogQHBhcmFtIGNvbmZpZ0lkIFRoZSBjb25maWdJZCB0byBwZXJmb3JtIHRoZSBhdXRob3JpemF0aW9uIG9uIHRoZSBiZWhhbGYgb2YuIElmIG5vdCBwYXNzZWQsIGFsbCBvZiB0aGUgY3VycmVudFxyXG4gICAqIGNvbmZpZ3VyZWQgb25lcyB3aWxsIGJlIHVzZWQgdG8gY2hlY2suXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiBgTG9naW5SZXNwb25zZWAgb2JqZWN0cyBjb250YWluaW5nIGFsbCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbG9naW5zXHJcbiAgICovXHJcbiAgY2hlY2tBdXRoTXVsdGlwbGUodXJsPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxMb2dpblJlc3BvbnNlW10+IHtcclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlXHJcbiAgICAgIC5nZXRPcGVuSURDb25maWd1cmF0aW9ucygpXHJcbiAgICAgIC5waXBlKGNvbmNhdE1hcCgoeyBhbGxDb25maWdzIH0pID0+IHRoaXMuY2hlY2tBdXRoU2VydmljZS5jaGVja0F1dGhNdWx0aXBsZShhbGxDb25maWdzLCB1cmwpKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQcm92aWRlcyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCBhdXRoZW50aWNhdGVkIHN0YXRlXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29uZmlnSWQgVGhlIGNvbmZpZ0lkIHRvIGNoZWNrIHRoZSBpbmZvcm1hdGlvbiBmb3IuIElmIG5vdCBwYXNzZWQsIHRoZSBmaXJzdCBjb25maWdzIHdpbGwgYmUgdGFrZW5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEgYm9vbGVhbiB3aGV0aGVyIHRoZSBjb25maWcgaXMgYXV0aGVudGljYXRlZCBvciBub3QuXHJcbiAgICovXHJcbiAgaXNBdXRoZW50aWNhdGVkKGNvbmZpZ0lkPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRPcGVuSURDb25maWd1cmF0aW9uKGNvbmZpZ0lkKS5waXBlKG1hcCgoY29uZmlnKSA9PiB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKGNvbmZpZykpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrcyB0aGUgc2VydmVyIGZvciBhbiBhdXRoZW50aWNhdGVkIHNlc3Npb24gdXNpbmcgdGhlIGlmcmFtZSBzaWxlbnQgcmVuZXcgaWYgbm90IGxvY2FsbHkgYXV0aGVudGljYXRlZC5cclxuICAgKi9cclxuICBjaGVja0F1dGhJbmNsdWRpbmdTZXJ2ZXIoY29uZmlnSWQ/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPExvZ2luUmVzcG9uc2U+IHtcclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlXHJcbiAgICAgIC5nZXRPcGVuSURDb25maWd1cmF0aW9ucyhjb25maWdJZClcclxuICAgICAgLnBpcGUoY29uY2F0TWFwKCh7IGFsbENvbmZpZ3MsIGN1cnJlbnRDb25maWcgfSkgPT4gdGhpcy5jaGVja0F1dGhTZXJ2aWNlLmNoZWNrQXV0aEluY2x1ZGluZ1NlcnZlcihjdXJyZW50Q29uZmlnLCBhbGxDb25maWdzKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgYWNjZXNzIHRva2VuIGZvciB0aGUgbG9naW4gc2NlbmFyaW8uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29uZmlnSWQgVGhlIGNvbmZpZ0lkIHRvIGNoZWNrIHRoZSBpbmZvcm1hdGlvbiBmb3IuIElmIG5vdCBwYXNzZWQsIHRoZSBmaXJzdCBjb25maWdzIHdpbGwgYmUgdGFrZW5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEgc3RyaW5nIHdpdGggdGhlIGFjY2VzcyB0b2tlbi5cclxuICAgKi9cclxuICBnZXRBY2Nlc3NUb2tlbihjb25maWdJZD86IHN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRPcGVuSURDb25maWd1cmF0aW9uKGNvbmZpZ0lkKS5waXBlKG1hcCgoY29uZmlnKSA9PiB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuZ2V0QWNjZXNzVG9rZW4oY29uZmlnKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgSUQgdG9rZW4gZm9yIHRoZSBzaWduLWluLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvbmZpZ0lkIFRoZSBjb25maWdJZCB0byBjaGVjayB0aGUgaW5mb3JtYXRpb24gZm9yLiBJZiBub3QgcGFzc2VkLCB0aGUgZmlyc3QgY29uZmlncyB3aWxsIGJlIHRha2VuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBIHN0cmluZyB3aXRoIHRoZSBpZCB0b2tlbi5cclxuICAgKi9cclxuICBnZXRJZFRva2VuKGNvbmZpZ0lkPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oY29uZmlnSWQpLnBpcGUobWFwKChjb25maWcpID0+IHRoaXMuYXV0aFN0YXRlU2VydmljZS5nZXRJZFRva2VuKGNvbmZpZykpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHJlZnJlc2ggdG9rZW4sIGlmIHByZXNlbnQsIGZvciB0aGUgc2lnbi1pbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb25maWdJZCBUaGUgY29uZmlnSWQgdG8gY2hlY2sgdGhlIGluZm9ybWF0aW9uIGZvci4gSWYgbm90IHBhc3NlZCwgdGhlIGZpcnN0IGNvbmZpZ3Mgd2lsbCBiZSB0YWtlblxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQSBzdHJpbmcgd2l0aCB0aGUgcmVmcmVzaCB0b2tlbi5cclxuICAgKi9cclxuICBnZXRSZWZyZXNoVG9rZW4oY29uZmlnSWQ/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0T3BlbklEQ29uZmlndXJhdGlvbihjb25maWdJZCkucGlwZShtYXAoKGNvbmZpZykgPT4gdGhpcy5hdXRoU3RhdGVTZXJ2aWNlLmdldFJlZnJlc2hUb2tlbihjb25maWcpKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBhdXRoZW50aWNhdGlvbiByZXN1bHQsIGlmIHByZXNlbnQsIGZvciB0aGUgc2lnbi1pbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb25maWdJZCBUaGUgY29uZmlnSWQgdG8gY2hlY2sgdGhlIGluZm9ybWF0aW9uIGZvci4gSWYgbm90IHBhc3NlZCwgdGhlIGZpcnN0IGNvbmZpZ3Mgd2lsbCBiZSB0YWtlblxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQSBvYmplY3Qgd2l0aCB0aGUgYXV0aGVudGljYXRpb24gcmVzdWx0XHJcbiAgICovXHJcbiAgZ2V0QXV0aGVudGljYXRpb25SZXN1bHQoY29uZmlnSWQ/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2VcclxuICAgICAgLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oY29uZmlnSWQpXHJcbiAgICAgIC5waXBlKG1hcCgoY29uZmlnKSA9PiB0aGlzLmF1dGhTdGF0ZVNlcnZpY2UuZ2V0QXV0aGVudGljYXRpb25SZXN1bHQoY29uZmlnKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcGF5bG9hZCBmcm9tIHRoZSBJRCB0b2tlbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBlbmNvZGUgU2V0IHRvIHRydWUgaWYgdGhlIHBheWxvYWQgaXMgYmFzZTY0IGVuY29kZWRcclxuICAgKiBAcGFyYW0gY29uZmlnSWQgVGhlIGNvbmZpZ0lkIHRvIGNoZWNrIHRoZSBpbmZvcm1hdGlvbiBmb3IuIElmIG5vdCBwYXNzZWQsIHRoZSBmaXJzdCBjb25maWdzIHdpbGwgYmUgdGFrZW5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBwYXlsb2FkIGZyb20gdGhlIGlkIHRva2VuLlxyXG4gICAqL1xyXG4gIGdldFBheWxvYWRGcm9tSWRUb2tlbihlbmNvZGUgPSBmYWxzZSwgY29uZmlnSWQ/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0T3BlbklEQ29uZmlndXJhdGlvbihjb25maWdJZCkucGlwZShcclxuICAgICAgbWFwKChjb25maWcpID0+IHtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuYXV0aFN0YXRlU2VydmljZS5nZXRJZFRva2VuKGNvbmZpZyk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRQYXlsb2FkRnJvbVRva2VuKHRva2VuLCBlbmNvZGUsIGNvbmZpZyk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcGF5bG9hZCBmcm9tIHRoZSBhY2Nlc3MgdG9rZW4uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZW5jb2RlIFNldCB0byB0cnVlIGlmIHRoZSBwYXlsb2FkIGlzIGJhc2U2NCBlbmNvZGVkXHJcbiAgICogQHBhcmFtIGNvbmZpZ0lkIFRoZSBjb25maWdJZCB0byBjaGVjayB0aGUgaW5mb3JtYXRpb24gZm9yLiBJZiBub3QgcGFzc2VkLCB0aGUgZmlyc3QgY29uZmlncyB3aWxsIGJlIHRha2VuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgcGF5bG9hZCBmcm9tIHRoZSBhY2Nlc3MgdG9rZW4uXHJcbiAgICovXHJcbiAgZ2V0UGF5bG9hZEZyb21BY2Nlc3NUb2tlbihlbmNvZGUgPSBmYWxzZSwgY29uZmlnSWQ/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0T3BlbklEQ29uZmlndXJhdGlvbihjb25maWdJZCkucGlwZShcclxuICAgICAgbWFwKChjb25maWcpID0+IHtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuYXV0aFN0YXRlU2VydmljZS5nZXRBY2Nlc3NUb2tlbihjb25maWcpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50b2tlbkhlbHBlclNlcnZpY2UuZ2V0UGF5bG9hZEZyb21Ub2tlbih0b2tlbiwgZW5jb2RlLCBjb25maWcpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgYSBjdXN0b20gc3RhdGUgZm9yIHRoZSBhdXRob3JpemUgcmVxdWVzdC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgc3RhdGUgdG8gc2V0LlxyXG4gICAqIEBwYXJhbSBjb25maWdJZCBUaGUgY29uZmlnSWQgdG8gY2hlY2sgdGhlIGluZm9ybWF0aW9uIGZvci4gSWYgbm90IHBhc3NlZCwgdGhlIGZpcnN0IGNvbmZpZ3Mgd2lsbCBiZSB0YWtlblxyXG4gICAqL1xyXG4gIHNldFN0YXRlKHN0YXRlOiBzdHJpbmcsIGNvbmZpZ0lkPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uU2VydmljZVxyXG4gICAgICAuZ2V0T3BlbklEQ29uZmlndXJhdGlvbihjb25maWdJZClcclxuICAgICAgLnBpcGUobWFwKChjb25maWcpID0+IHRoaXMuZmxvd3NEYXRhU2VydmljZS5zZXRBdXRoU3RhdGVDb250cm9sKHN0YXRlLCBjb25maWcpKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBzdGF0ZSB2YWx1ZSB1c2VkIGZvciB0aGUgYXV0aG9yaXplIHJlcXVlc3QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29uZmlnSWQgVGhlIGNvbmZpZ0lkIHRvIGNoZWNrIHRoZSBpbmZvcm1hdGlvbiBmb3IuIElmIG5vdCBwYXNzZWQsIHRoZSBmaXJzdCBjb25maWdzIHdpbGwgYmUgdGFrZW5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBzdGF0ZSB2YWx1ZSB1c2VkIGZvciB0aGUgYXV0aG9yaXplIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgZ2V0U3RhdGUoY29uZmlnSWQ/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2VcclxuICAgICAgLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oY29uZmlnSWQpXHJcbiAgICAgIC5waXBlKG1hcCgoY29uZmlnKSA9PiB0aGlzLmZsb3dzRGF0YVNlcnZpY2UuZ2V0QXV0aFN0YXRlQ29udHJvbChjb25maWcpKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWRpcmVjdHMgdGhlIHVzZXIgdG8gdGhlIFNlY3VyaXR5IFRva2VuIFNlcnZpY2UgdG8gYmVnaW4gdGhlIGF1dGhlbnRpY2F0aW9uIHByb2Nlc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29uZmlnSWQgVGhlIGNvbmZpZ0lkIHRvIHBlcmZvcm0gdGhlIGFjdGlvbiBpbiBiZWhhbGYgb2YuIElmIG5vdCBwYXNzZWQsIHRoZSBmaXJzdCBjb25maWdzIHdpbGwgYmUgdGFrZW5cclxuICAgKiBAcGFyYW0gYXV0aE9wdGlvbnMgVGhlIGN1c3RvbSBvcHRpb25zIGZvciB0aGUgdGhlIGF1dGhlbnRpY2F0aW9uIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgYXV0aG9yaXplKGNvbmZpZ0lkPzogc3RyaW5nLCBhdXRoT3B0aW9ucz86IEF1dGhPcHRpb25zKTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oY29uZmlnSWQpLnN1YnNjcmliZSgoY29uZmlnKSA9PiB0aGlzLmxvZ2luU2VydmljZS5sb2dpbihjb25maWcsIGF1dGhPcHRpb25zKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPcGVucyB0aGUgU2VjdXJpdHkgVG9rZW4gU2VydmljZSBpbiBhIG5ldyB3aW5kb3cgdG8gYmVnaW4gdGhlIGF1dGhlbnRpY2F0aW9uIHByb2Nlc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYXV0aE9wdGlvbnMgVGhlIGN1c3RvbSBvcHRpb25zIGZvciB0aGUgYXV0aGVudGljYXRpb24gcmVxdWVzdC5cclxuICAgKiBAcGFyYW0gcG9wdXBPcHRpb25zIFRoZSBjb25maWd1cmF0aW9uIGZvciB0aGUgcG9wdXAgd2luZG93LlxyXG4gICAqIEBwYXJhbSBjb25maWdJZCBUaGUgY29uZmlnSWQgdG8gcGVyZm9ybSB0aGUgYWN0aW9uIGluIGJlaGFsZiBvZi4gSWYgbm90IHBhc3NlZCwgdGhlIGZpcnN0IGNvbmZpZ3Mgd2lsbCBiZSB0YWtlblxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQW4gYE9ic2VydmFibGU8TG9naW5SZXNwb25zZT5gIGNvbnRhaW5pbmcgYWxsIGluZm9ybWF0aW9uIGFib3V0IHRoZSBsb2dpblxyXG4gICAqL1xyXG4gIGF1dGhvcml6ZVdpdGhQb3BVcChhdXRoT3B0aW9ucz86IEF1dGhPcHRpb25zLCBwb3B1cE9wdGlvbnM/OiBQb3B1cE9wdGlvbnMsIGNvbmZpZ0lkPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxMb2dpblJlc3BvbnNlPiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uU2VydmljZVxyXG4gICAgICAuZ2V0T3BlbklEQ29uZmlndXJhdGlvbnMoY29uZmlnSWQpXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIGNvbmNhdE1hcCgoeyBhbGxDb25maWdzLCBjdXJyZW50Q29uZmlnIH0pID0+IHRoaXMubG9naW5TZXJ2aWNlLmxvZ2luV2l0aFBvcFVwKGN1cnJlbnRDb25maWcsIGFsbENvbmZpZ3MsIGF1dGhPcHRpb25zLCBwb3B1cE9wdGlvbnMpKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFudWFsbHkgcmVmcmVzaGVzIHRoZSBzZXNzaW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGN1c3RvbVBhcmFtcyBDdXN0b20gcGFyYW1ldGVycyB0byBwYXNzIHRvIHRoZSByZWZyZXNoIHJlcXVlc3QuXHJcbiAgICogQHBhcmFtIGNvbmZpZ0lkIFRoZSBjb25maWdJZCB0byBwZXJmb3JtIHRoZSBhY3Rpb24gaW4gYmVoYWxmIG9mLiBJZiBub3QgcGFzc2VkLCB0aGUgZmlyc3QgY29uZmlncyB3aWxsIGJlIHRha2VuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBbiBgT2JzZXJ2YWJsZTxMb2dpblJlc3BvbnNlPmAgY29udGFpbmluZyBhbGwgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGxvZ2luXHJcbiAgICovXHJcbiAgZm9yY2VSZWZyZXNoU2Vzc2lvbihjdXN0b21QYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfSwgY29uZmlnSWQ/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPExvZ2luUmVzcG9uc2U+IHtcclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlXHJcbiAgICAgIC5nZXRPcGVuSURDb25maWd1cmF0aW9ucyhjb25maWdJZClcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgY29uY2F0TWFwKCh7IGFsbENvbmZpZ3MsIGN1cnJlbnRDb25maWcgfSkgPT5cclxuICAgICAgICAgIHRoaXMucmVmcmVzaFNlc3Npb25TZXJ2aWNlLnVzZXJGb3JjZVJlZnJlc2hTZXNzaW9uKGN1cnJlbnRDb25maWcsIGFsbENvbmZpZ3MsIGN1c3RvbVBhcmFtcylcclxuICAgICAgICApXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXZva2VzIHRoZSByZWZyZXNoIHRva2VuIChpZiBwcmVzZW50KSBhbmQgdGhlIGFjY2VzcyB0b2tlbiBvbiB0aGUgc2VydmVyIGFuZCB0aGVuIHBlcmZvcm1zIHRoZSBsb2dvZmYgb3BlcmF0aW9uLlxyXG4gICAqIFRoZSByZWZyZXNoIHRva2VuIGFuZCBhbmQgdGhlIGFjY2VzcyB0b2tlbiBhcmUgcmV2b2tlZCBvbiB0aGUgc2VydmVyLiBJZiB0aGUgcmVmcmVzaCB0b2tlbiBkb2VzIG5vdCBleGlzdFxyXG4gICAqIG9ubHkgdGhlIGFjY2VzcyB0b2tlbiBpcyByZXZva2VkLiBUaGVuIHRoZSBsb2dvdXQgcnVuLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvbmZpZ0lkIFRoZSBjb25maWdJZCB0byBwZXJmb3JtIHRoZSBhY3Rpb24gaW4gYmVoYWxmIG9mLiBJZiBub3QgcGFzc2VkLCB0aGUgZmlyc3QgY29uZmlncyB3aWxsIGJlIHRha2VuXHJcbiAgICogQHBhcmFtIGF1dGhPcHRpb25zIFRoZSBjdXN0b20gb3B0aW9ucyBmb3IgdGhlIHJlcXVlc3QuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBbiBvYnNlcnZhYmxlIHdoZW4gdGhlIGFjdGlvbiBpcyBmaW5pc2hlZFxyXG4gICAqL1xyXG4gIGxvZ29mZkFuZFJldm9rZVRva2Vucyhjb25maWdJZD86IHN0cmluZywgbG9nb3V0QXV0aE9wdGlvbnM/OiBMb2dvdXRBdXRoT3B0aW9ucyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uU2VydmljZVxyXG4gICAgICAuZ2V0T3BlbklEQ29uZmlndXJhdGlvbnMoY29uZmlnSWQpXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIGNvbmNhdE1hcCgoeyBhbGxDb25maWdzLCBjdXJyZW50Q29uZmlnIH0pID0+XHJcbiAgICAgICAgICB0aGlzLmxvZ29mZlJldm9jYXRpb25TZXJ2aWNlLmxvZ29mZkFuZFJldm9rZVRva2VucyhjdXJyZW50Q29uZmlnLCBhbGxDb25maWdzLCBsb2dvdXRBdXRoT3B0aW9ucylcclxuICAgICAgICApXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMb2dzIG91dCBvbiB0aGUgc2VydmVyIGFuZCB0aGUgbG9jYWwgY2xpZW50LiBJZiB0aGUgc2VydmVyIHN0YXRlIGhhcyBjaGFuZ2VkLCBjb25maXJtZWQgdmlhIGNoZWNrIHNlc3Npb24sXHJcbiAgICogdGhlbiBvbmx5IGEgbG9jYWwgbG9nb3V0IGlzIHBlcmZvcm1lZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb25maWdJZCBUaGUgY29uZmlnSWQgdG8gcGVyZm9ybSB0aGUgYWN0aW9uIGluIGJlaGFsZiBvZi4gSWYgbm90IHBhc3NlZCwgdGhlIGZpcnN0IGNvbmZpZ3Mgd2lsbCBiZSB0YWtlblxyXG4gICAqIEBwYXJhbSBhdXRoT3B0aW9ucyB3aXRoIGN1c3RvbSBwYXJhbWV0ZXJzIGFuZC9vciBhbiBjdXN0b20gdXJsIGhhbmRsZXJcclxuICAgKi9cclxuICBsb2dvZmYoY29uZmlnSWQ/OiBzdHJpbmcsIGxvZ291dEF1dGhPcHRpb25zPzogTG9nb3V0QXV0aE9wdGlvbnMpOiBPYnNlcnZhYmxlPHVua25vd24+IHtcclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlXHJcbiAgICAgIC5nZXRPcGVuSURDb25maWd1cmF0aW9ucyhjb25maWdJZClcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgY29uY2F0TWFwKCh7IGFsbENvbmZpZ3MsIGN1cnJlbnRDb25maWcgfSkgPT4gdGhpcy5sb2dvZmZSZXZvY2F0aW9uU2VydmljZS5sb2dvZmYoY3VycmVudENvbmZpZywgYWxsQ29uZmlncywgbG9nb3V0QXV0aE9wdGlvbnMpKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9ncyB0aGUgdXNlciBvdXQgb2YgdGhlIGFwcGxpY2F0aW9uIHdpdGhvdXQgbG9nZ2luZyB0aGVtIG91dCBvZiB0aGUgc2VydmVyLlxyXG4gICAqIFVzZSB0aGlzIG1ldGhvZCBpZiB5b3UgaGF2ZSBfb25lXyBjb25maWcgZW5hYmxlZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb25maWdJZCBUaGUgY29uZmlnSWQgdG8gcGVyZm9ybSB0aGUgYWN0aW9uIGluIGJlaGFsZiBvZi4gSWYgbm90IHBhc3NlZCwgdGhlIGZpcnN0IGNvbmZpZ3Mgd2lsbCBiZSB0YWtlblxyXG4gICAqL1xyXG4gIGxvZ29mZkxvY2FsKGNvbmZpZ0lkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlXHJcbiAgICAgIC5nZXRPcGVuSURDb25maWd1cmF0aW9ucyhjb25maWdJZClcclxuICAgICAgLnN1YnNjcmliZSgoeyBhbGxDb25maWdzLCBjdXJyZW50Q29uZmlnIH0pID0+IHRoaXMubG9nb2ZmUmV2b2NhdGlvblNlcnZpY2UubG9nb2ZmTG9jYWwoY3VycmVudENvbmZpZywgYWxsQ29uZmlncykpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9ncyB0aGUgdXNlciBvdXQgb2YgdGhlIGFwcGxpY2F0aW9uIGZvciBhbGwgY29uZmlncyB3aXRob3V0IGxvZ2dpbmcgdGhlbSBvdXQgb2YgdGhlIHNlcnZlci5cclxuICAgKiBVc2UgdGhpcyBtZXRob2QgaWYgeW91IGhhdmUgX211bHRpcGxlXyBjb25maWdzIGVuYWJsZWQuXHJcbiAgICovXHJcbiAgbG9nb2ZmTG9jYWxNdWx0aXBsZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2VcclxuICAgICAgLmdldE9wZW5JRENvbmZpZ3VyYXRpb25zKClcclxuICAgICAgLnN1YnNjcmliZSgoeyBhbGxDb25maWdzIH0pID0+IHRoaXMubG9nb2ZmUmV2b2NhdGlvblNlcnZpY2UubG9nb2ZmTG9jYWxNdWx0aXBsZShhbGxDb25maWdzKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXZva2VzIGFuIGFjY2VzcyB0b2tlbiBvbiB0aGUgU2VjdXJpdHkgVG9rZW4gU2VydmljZS4gVGhpcyBpcyBvbmx5IHJlcXVpcmVkIGluIHRoZSBjb2RlIGZsb3cgd2l0aCByZWZyZXNoIHRva2Vucy4gSWYgbm8gdG9rZW4gaXNcclxuICAgKiBwcm92aWRlZCwgdGhlbiB0aGUgdG9rZW4gZnJvbSB0aGUgc3RvcmFnZSBpcyByZXZva2VkLiBZb3UgY2FuIHBhc3MgYW55IHRva2VuIHRvIHJldm9rZS5cclxuICAgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzAwOVxyXG4gICAqXHJcbiAgICogQHBhcmFtIGFjY2Vzc1Rva2VuIFRoZSBhY2Nlc3MgdG9rZW4gdG8gcmV2b2tlLlxyXG4gICAqIEBwYXJhbSBjb25maWdJZCBUaGUgY29uZmlnSWQgdG8gcGVyZm9ybSB0aGUgYWN0aW9uIGluIGJlaGFsZiBvZi4gSWYgbm90IHBhc3NlZCwgdGhlIGZpcnN0IGNvbmZpZ3Mgd2lsbCBiZSB0YWtlblxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQW4gb2JzZXJ2YWJsZSB3aGVuIHRoZSBhY3Rpb24gaXMgZmluaXNoZWRcclxuICAgKi9cclxuICByZXZva2VBY2Nlc3NUb2tlbihhY2Nlc3NUb2tlbj86IGFueSwgY29uZmlnSWQ/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2VcclxuICAgICAgLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oY29uZmlnSWQpXHJcbiAgICAgIC5waXBlKGNvbmNhdE1hcCgoY29uZmlnKSA9PiB0aGlzLmxvZ29mZlJldm9jYXRpb25TZXJ2aWNlLnJldm9rZUFjY2Vzc1Rva2VuKGNvbmZpZywgYWNjZXNzVG9rZW4pKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXZva2VzIGEgcmVmcmVzaCB0b2tlbiBvbiB0aGUgU2VjdXJpdHkgVG9rZW4gU2VydmljZS4gVGhpcyBpcyBvbmx5IHJlcXVpcmVkIGluIHRoZSBjb2RlIGZsb3cgd2l0aCByZWZyZXNoIHRva2Vucy4gSWYgbm8gdG9rZW4gaXNcclxuICAgKiBwcm92aWRlZCwgdGhlbiB0aGUgdG9rZW4gZnJvbSB0aGUgc3RvcmFnZSBpcyByZXZva2VkLiBZb3UgY2FuIHBhc3MgYW55IHRva2VuIHRvIHJldm9rZS5cclxuICAgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzAwOVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlZnJlc2hUb2tlbiBUaGUgYWNjZXNzIHRva2VuIHRvIHJldm9rZS5cclxuICAgKiBAcGFyYW0gY29uZmlnSWQgVGhlIGNvbmZpZ0lkIHRvIHBlcmZvcm0gdGhlIGFjdGlvbiBpbiBiZWhhbGYgb2YuIElmIG5vdCBwYXNzZWQsIHRoZSBmaXJzdCBjb25maWdzIHdpbGwgYmUgdGFrZW5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIG9ic2VydmFibGUgd2hlbiB0aGUgYWN0aW9uIGlzIGZpbmlzaGVkXHJcbiAgICovXHJcbiAgcmV2b2tlUmVmcmVzaFRva2VuKHJlZnJlc2hUb2tlbj86IGFueSwgY29uZmlnSWQ/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2VcclxuICAgICAgLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oY29uZmlnSWQpXHJcbiAgICAgIC5waXBlKGNvbmNhdE1hcCgoY29uZmlnKSA9PiB0aGlzLmxvZ29mZlJldm9jYXRpb25TZXJ2aWNlLnJldm9rZVJlZnJlc2hUb2tlbihjb25maWcsIHJlZnJlc2hUb2tlbikpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgdGhlIGVuZCBzZXNzaW9uIFVSTCB3aGljaCBjYW4gYmUgdXNlZCB0byBpbXBsZW1lbnQgYW4gYWx0ZXJuYXRlIHNlcnZlciBsb2dvdXQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY3VzdG9tUGFyYW1zXHJcbiAgICogQHBhcmFtIGNvbmZpZ0lkIFRoZSBjb25maWdJZCB0byBwZXJmb3JtIHRoZSBhY3Rpb24gaW4gYmVoYWxmIG9mLiBJZiBub3QgcGFzc2VkLCB0aGUgZmlyc3QgY29uZmlncyB3aWxsIGJlIHRha2VuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBIHN0cmluZyB3aXRoIHRoZSBlbmQgc2Vzc2lvbiB1cmwgb3IgbnVsbFxyXG4gICAqL1xyXG4gIGdldEVuZFNlc3Npb25VcmwoY3VzdG9tUGFyYW1zPzogeyBbcDogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9LCBjb25maWdJZD86IHN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nIHwgbnVsbD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2VcclxuICAgICAgLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oY29uZmlnSWQpXHJcbiAgICAgIC5waXBlKG1hcCgoY29uZmlnKSA9PiB0aGlzLnVybFNlcnZpY2UuZ2V0RW5kU2Vzc2lvblVybChjb25maWcsIGN1c3RvbVBhcmFtcykpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgdGhlIGF1dGhvcml6ZSBVUkwgYmFzZWQgb24geW91ciBmbG93XHJcbiAgICpcclxuICAgKiBAcGFyYW0gY3VzdG9tUGFyYW1zXHJcbiAgICogQHBhcmFtIGNvbmZpZ0lkIFRoZSBjb25maWdJZCB0byBwZXJmb3JtIHRoZSBhY3Rpb24gaW4gYmVoYWxmIG9mLiBJZiBub3QgcGFzc2VkLCB0aGUgZmlyc3QgY29uZmlncyB3aWxsIGJlIHRha2VuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBIHN0cmluZyB3aXRoIHRoZSBhdXRob3JpemUgVVJMIG9yIG51bGxcclxuICAgKi9cclxuICBnZXRBdXRob3JpemVVcmwoY3VzdG9tUGFyYW1zPzogeyBbcDogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9LCBjb25maWdJZD86IHN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nIHwgbnVsbD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2VcclxuICAgICAgLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oY29uZmlnSWQpXHJcbiAgICAgIC5waXBlKGNvbmNhdE1hcCgoY29uZmlnKSA9PiB0aGlzLnVybFNlcnZpY2UuZ2V0QXV0aG9yaXplVXJsKGNvbmZpZywgY3VzdG9tUGFyYW1zID8geyBjdXN0b21QYXJhbXMgfSA6IHVuZGVmaW5lZCkpKTtcclxuICB9XHJcbn1cclxuIl19