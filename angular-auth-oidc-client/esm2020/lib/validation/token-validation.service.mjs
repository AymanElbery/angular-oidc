import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { base64url } from 'rfc4648';
import { from, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { alg2kty, getImportAlg, getVerifyAlg } from './token-validation.helper';
import * as i0 from "@angular/core";
import * as i1 from "../utils/tokenHelper/token-helper.service";
import * as i2 from "../logging/logger.service";
import * as i3 from "../extractors/jwk.extractor";
import * as i4 from "./jwk-window-crypto.service";
import * as i5 from "./jwt-window-crypto.service";
// http://openid.net/specs/openid-connect-implicit-1_0.html
// id_token
// id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
// MUST exactly match the value of the iss (issuer) Claim.
//
// id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified
// by the iss (issuer) Claim as an audience.The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience,
// or if it contains additional audiences not trusted by the Client.
//
// id_token C3: If the ID Token contains multiple audiences, the Client SHOULD verify that an azp Claim is present.
//
// id_token C4: If an azp (authorized party) Claim is present, the Client SHOULD verify that its client_id is the Claim Value.
//
// id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the
// alg Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
//
// id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the OpenID Connect
// Core 1.0
// [OpenID.Core] specification.
//
// id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account
// for clock skew).
//
// id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
// limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
//
// id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one that was sent
// in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.The precise method for detecting replay attacks
// is Client specific.
//
// id_token C10: If the acr Claim was requested, the Client SHOULD check that the asserted Claim Value is appropriate.
// The meaning and processing of acr Claim Values is out of scope for this document.
//
// id_token C11: When a max_age request is made, the Client SHOULD check the auth_time Claim value and request re- authentication
// if it determines too much time has elapsed since the last End- User authentication.
// Access Token Validation
// access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA]
// for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
// access_token C2: Take the left- most half of the hash and base64url- encode it.
// access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash is present
// in the ID Token.
export class TokenValidationService {
    constructor(tokenHelperService, loggerService, jwkExtractor, jwkWindowCryptoService, jwtWindowCryptoService, document) {
        this.tokenHelperService = tokenHelperService;
        this.loggerService = loggerService;
        this.jwkExtractor = jwkExtractor;
        this.jwkWindowCryptoService = jwkWindowCryptoService;
        this.jwtWindowCryptoService = jwtWindowCryptoService;
        this.document = document;
        this.keyAlgorithms = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'PS256', 'PS384', 'PS512'];
    }
    // id_token C7: The current time MUST be before the time represented by the exp Claim
    // (possibly allowing for some small leeway to account for clock skew).
    hasIdTokenExpired(token, configuration, offsetSeconds) {
        const decoded = this.tokenHelperService.getPayloadFromToken(token, false, configuration);
        return !this.validateIdTokenExpNotExpired(decoded, configuration, offsetSeconds);
    }
    // id_token C7: The current time MUST be before the time represented by the exp Claim
    // (possibly allowing for some small leeway to account for clock skew).
    validateIdTokenExpNotExpired(decodedIdToken, configuration, offsetSeconds) {
        const tokenExpirationDate = this.tokenHelperService.getTokenExpirationDate(decodedIdToken);
        offsetSeconds = offsetSeconds || 0;
        if (!tokenExpirationDate) {
            return false;
        }
        const tokenExpirationValue = tokenExpirationDate.valueOf();
        const nowWithOffset = this.calculateNowWithOffset(offsetSeconds);
        const tokenNotExpired = tokenExpirationValue > nowWithOffset;
        this.loggerService.logDebug(configuration, `Has idToken expired: ${!tokenNotExpired} --> expires in ${this.millisToMinutesAndSeconds(tokenExpirationValue - nowWithOffset)} , ${new Date(tokenExpirationValue).toLocaleTimeString()} > ${new Date(nowWithOffset).toLocaleTimeString()}`);
        return tokenNotExpired;
    }
    validateAccessTokenNotExpired(accessTokenExpiresAt, configuration, offsetSeconds) {
        // value is optional, so if it does not exist, then it has not expired
        if (!accessTokenExpiresAt) {
            return true;
        }
        offsetSeconds = offsetSeconds || 0;
        const accessTokenExpirationValue = accessTokenExpiresAt.valueOf();
        const nowWithOffset = this.calculateNowWithOffset(offsetSeconds);
        const tokenNotExpired = accessTokenExpirationValue > nowWithOffset;
        this.loggerService.logDebug(configuration, `Has accessToken expired: ${!tokenNotExpired} --> expires in ${this.millisToMinutesAndSeconds(accessTokenExpirationValue - nowWithOffset)} , ${new Date(accessTokenExpirationValue).toLocaleTimeString()} > ${new Date(nowWithOffset).toLocaleTimeString()}`);
        return tokenNotExpired;
    }
    // iss
    // REQUIRED. Issuer Identifier for the Issuer of the response.The iss value is a case-sensitive URL using the
    // https scheme that contains scheme, host,
    // and optionally, port number and path components and no query or fragment components.
    //
    // sub
    // REQUIRED. Subject Identifier.Locally unique and never reassigned identifier within the Issuer for the End- User,
    // which is intended to be consumed by the Client, e.g., 24400320 or AItOawmwtWwcT0k51BayewNvutrJUqsvl6qs7A4.
    // It MUST NOT exceed 255 ASCII characters in length.The sub value is a case-sensitive string.
    //
    // aud
    // REQUIRED. Audience(s) that this ID Token is intended for. It MUST contain the OAuth 2.0 client_id of the Relying Party as an
    // audience value.
    // It MAY also contain identifiers for other audiences.In the general case, the aud value is an array of case-sensitive strings.
    // In the common special case when there is one audience, the aud value MAY be a single case-sensitive string.
    //
    // exp
    // REQUIRED. Expiration time on or after which the ID Token MUST NOT be accepted for processing.
    // The processing of this parameter requires that the current date/ time MUST be before the expiration date/ time listed in the value.
    // Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew.
    // Its value is a JSON [RFC7159] number representing the number of seconds from 1970- 01 - 01T00: 00:00Z as measured in UTC until
    // the date/ time.
    // See RFC 3339 [RFC3339] for details regarding date/ times in general and UTC in particular.
    //
    // iat
    // REQUIRED. Time at which the JWT was issued. Its value is a JSON number representing the number of seconds from
    // 1970- 01 - 01T00: 00: 00Z as measured
    // in UTC until the date/ time.
    validateRequiredIdToken(dataIdToken, configuration) {
        let validated = true;
        if (!Object.prototype.hasOwnProperty.call(dataIdToken, 'iss')) {
            validated = false;
            this.loggerService.logWarning(configuration, 'iss is missing, this is required in the id_token');
        }
        if (!Object.prototype.hasOwnProperty.call(dataIdToken, 'sub')) {
            validated = false;
            this.loggerService.logWarning(configuration, 'sub is missing, this is required in the id_token');
        }
        if (!Object.prototype.hasOwnProperty.call(dataIdToken, 'aud')) {
            validated = false;
            this.loggerService.logWarning(configuration, 'aud is missing, this is required in the id_token');
        }
        if (!Object.prototype.hasOwnProperty.call(dataIdToken, 'exp')) {
            validated = false;
            this.loggerService.logWarning(configuration, 'exp is missing, this is required in the id_token');
        }
        if (!Object.prototype.hasOwnProperty.call(dataIdToken, 'iat')) {
            validated = false;
            this.loggerService.logWarning(configuration, 'iat is missing, this is required in the id_token');
        }
        return validated;
    }
    // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
    // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
    validateIdTokenIatMaxOffset(dataIdToken, maxOffsetAllowedInSeconds, disableIatOffsetValidation, configuration) {
        if (disableIatOffsetValidation) {
            return true;
        }
        if (!Object.prototype.hasOwnProperty.call(dataIdToken, 'iat')) {
            return false;
        }
        const dateTimeIatIdToken = new Date(0); // The 0 here is the key, which sets the date to the epoch
        dateTimeIatIdToken.setUTCSeconds(dataIdToken.iat);
        maxOffsetAllowedInSeconds = maxOffsetAllowedInSeconds || 0;
        const nowInUtc = new Date(new Date().toUTCString());
        const diff = nowInUtc.valueOf() - dateTimeIatIdToken.valueOf();
        const maxOffsetAllowedInMilliseconds = maxOffsetAllowedInSeconds * 1000;
        this.loggerService.logDebug(configuration, `validate id token iat max offset ${diff} < ${maxOffsetAllowedInMilliseconds}`);
        if (diff > 0) {
            return diff < maxOffsetAllowedInMilliseconds;
        }
        return -diff < maxOffsetAllowedInMilliseconds;
    }
    // id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one
    // that was sent in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.
    // The precise method for detecting replay attacks is Client specific.
    // However the nonce claim SHOULD not be present for the refresh_token grant type
    // https://bitbucket.org/openid/connect/issues/1025/ambiguity-with-how-nonce-is-handled-on
    // The current spec is ambiguous and KeyCloak does send it.
    validateIdTokenNonce(dataIdToken, localNonce, ignoreNonceAfterRefresh, configuration) {
        const isFromRefreshToken = (dataIdToken.nonce === undefined || ignoreNonceAfterRefresh) && localNonce === TokenValidationService.refreshTokenNoncePlaceholder;
        if (!isFromRefreshToken && dataIdToken.nonce !== localNonce) {
            this.loggerService.logDebug(configuration, 'Validate_id_token_nonce failed, dataIdToken.nonce: ' + dataIdToken.nonce + ' local_nonce:' + localNonce);
            return false;
        }
        return true;
    }
    // id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
    // MUST exactly match the value of the iss (issuer) Claim.
    validateIdTokenIss(dataIdToken, authWellKnownEndpointsIssuer, configuration) {
        if (dataIdToken.iss !== authWellKnownEndpointsIssuer) {
            this.loggerService.logDebug(configuration, 'Validate_id_token_iss failed, dataIdToken.iss: ' +
                dataIdToken.iss +
                ' authWellKnownEndpoints issuer:' +
                authWellKnownEndpointsIssuer);
            return false;
        }
        return true;
    }
    // id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified
    // by the iss (issuer) Claim as an audience.
    // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences
    // not trusted by the Client.
    validateIdTokenAud(dataIdToken, aud, configuration) {
        if (Array.isArray(dataIdToken.aud)) {
            const result = dataIdToken.aud.includes(aud);
            if (!result) {
                this.loggerService.logDebug(configuration, 'Validate_id_token_aud array failed, dataIdToken.aud: ' + dataIdToken.aud + ' client_id:' + aud);
                return false;
            }
            return true;
        }
        else if (dataIdToken.aud !== aud) {
            this.loggerService.logDebug(configuration, 'Validate_id_token_aud failed, dataIdToken.aud: ' + dataIdToken.aud + ' client_id:' + aud);
            return false;
        }
        return true;
    }
    validateIdTokenAzpExistsIfMoreThanOneAud(dataIdToken) {
        if (!dataIdToken) {
            return false;
        }
        if (Array.isArray(dataIdToken.aud) && dataIdToken.aud.length > 1 && !dataIdToken.azp) {
            return false;
        }
        return true;
    }
    // If an azp (authorized party) Claim is present, the Client SHOULD verify that its client_id is the Claim Value.
    validateIdTokenAzpValid(dataIdToken, clientId) {
        if (!dataIdToken?.azp) {
            return true;
        }
        if (dataIdToken.azp === clientId) {
            return true;
        }
        return false;
    }
    validateStateFromHashCallback(state, localState, configuration) {
        if (state !== localState) {
            this.loggerService.logDebug(configuration, 'ValidateStateFromHashCallback failed, state: ' + state + ' local_state:' + localState);
            return false;
        }
        return true;
    }
    // id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the alg
    // Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
    // id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the
    // OpenID Connect Core 1.0 [OpenID.Core] specification.
    validateSignatureIdToken(idToken, jwtkeys, configuration) {
        if (!idToken) {
            return of(true);
        }
        if (!jwtkeys || !jwtkeys.keys) {
            return of(false);
        }
        const headerData = this.tokenHelperService.getHeaderFromToken(idToken, false, configuration);
        if (Object.keys(headerData).length === 0 && headerData.constructor === Object) {
            this.loggerService.logWarning(configuration, 'id token has no header data');
            return of(false);
        }
        const kid = headerData.kid;
        let alg = headerData.alg;
        let keys = jwtkeys.keys;
        let foundKeys;
        let key;
        if (!this.keyAlgorithms.includes(alg)) {
            this.loggerService.logWarning(configuration, 'alg not supported', alg);
            return of(false);
        }
        const kty = alg2kty(alg);
        const use = 'sig';
        try {
            foundKeys = kid
                ? this.jwkExtractor.extractJwk(keys, { kid, kty, use }, false)
                : this.jwkExtractor.extractJwk(keys, { kty, use }, false);
            if (foundKeys.length === 0) {
                foundKeys = kid ? this.jwkExtractor.extractJwk(keys, { kid, kty }) : this.jwkExtractor.extractJwk(keys, { kty });
            }
            key = foundKeys[0];
        }
        catch (e) {
            this.loggerService.logError(configuration, e);
            return of(false);
        }
        const algorithm = getImportAlg(alg);
        const signingInput = this.tokenHelperService.getSigningInputFromToken(idToken, true, configuration);
        const rawSignature = this.tokenHelperService.getSignatureFromToken(idToken, true, configuration);
        const agent = this.document.defaultView.navigator.userAgent.toLowerCase();
        if (agent.indexOf('firefox') > -1 && key.kty === 'EC') {
            key.alg = '';
        }
        return from(this.jwkWindowCryptoService.importVerificationKey(key, algorithm)).pipe(mergeMap((cryptoKey) => {
            const signature = base64url.parse(rawSignature, { loose: true });
            const verifyAlgorithm = getVerifyAlg(alg);
            return from(this.jwkWindowCryptoService.verifyKey(verifyAlgorithm, cryptoKey, signature, signingInput));
        }), tap((isValid) => {
            if (!isValid) {
                this.loggerService.logWarning(configuration, 'incorrect Signature, validation failed for id_token');
            }
        }));
    }
    // Accepts ID Token without 'kid' claim in JOSE header if only one JWK supplied in 'jwks_url'
    //// private validate_no_kid_in_header_only_one_allowed_in_jwtkeys(header_data: any, jwtkeys: any): boolean {
    ////    this.oidcSecurityCommon.logDebug('amount of jwtkeys.keys: ' + jwtkeys.keys.length);
    ////    if (!header_data.hasOwnProperty('kid')) {
    ////        // no kid defined in Jose header
    ////        if (jwtkeys.keys.length != 1) {
    ////            this.oidcSecurityCommon.logDebug('jwtkeys.keys.length != 1 and no kid in header');
    ////            return false;
    ////        }
    ////    }
    ////    return true;
    //// }
    // Access Token Validation
    // access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA]
    // for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
    // access_token C2: Take the left- most half of the hash and base64url- encode it.
    // access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash
    // is present in the ID Token.
    validateIdTokenAtHash(accessToken, atHash, idTokenAlg, configuration) {
        this.loggerService.logDebug(configuration, 'at_hash from the server:' + atHash);
        // 'sha256' 'sha384' 'sha512'
        let sha = 'SHA-256';
        if (idTokenAlg.includes('384')) {
            sha = 'SHA-384';
        }
        else if (idTokenAlg.includes('512')) {
            sha = 'SHA-512';
        }
        return this.jwtWindowCryptoService.generateAtHash('' + accessToken, sha).pipe(mergeMap((hash) => {
            this.loggerService.logDebug(configuration, 'at_hash client validation not decoded:' + hash);
            if (hash === atHash) {
                return of(true); // isValid;
            }
            else {
                return this.jwtWindowCryptoService.generateAtHash('' + decodeURIComponent(accessToken), sha).pipe(map((newHash) => {
                    this.loggerService.logDebug(configuration, '-gen access--' + hash);
                    return newHash === atHash;
                }));
            }
        }));
    }
    millisToMinutesAndSeconds(millis) {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ':' + (+seconds < 10 ? '0' : '') + seconds;
    }
    calculateNowWithOffset(offsetSeconds) {
        return new Date(new Date().toUTCString()).valueOf() + offsetSeconds * 1000;
    }
}
TokenValidationService.refreshTokenNoncePlaceholder = '--RefreshToken--';
TokenValidationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: TokenValidationService, deps: [{ token: i1.TokenHelperService }, { token: i2.LoggerService }, { token: i3.JwkExtractor }, { token: i4.JwkWindowCryptoService }, { token: i5.JwtWindowCryptoService }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
TokenValidationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: TokenValidationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: TokenValidationService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.TokenHelperService }, { type: i2.LoggerService }, { type: i3.JwkExtractor }, { type: i4.JwkWindowCryptoService }, { type: i5.JwtWindowCryptoService }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tdmFsaWRhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy9saWIvdmFsaWRhdGlvbi90b2tlbi12YWxpZGF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDcEMsT0FBTyxFQUFFLElBQUksRUFBYyxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFPcEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7Ozs7Ozs7QUFFaEYsMkRBQTJEO0FBRTNELFdBQVc7QUFDWCw0R0FBNEc7QUFDNUcsMERBQTBEO0FBQzFELEVBQUU7QUFDRix1SUFBdUk7QUFDdkksdUlBQXVJO0FBQ3ZJLG9FQUFvRTtBQUNwRSxFQUFFO0FBQ0YsbUhBQW1IO0FBQ25ILEVBQUU7QUFDRiw4SEFBOEg7QUFDOUgsRUFBRTtBQUNGLGtJQUFrSTtBQUNsSSwrRkFBK0Y7QUFDL0YsRUFBRTtBQUNGLHFJQUFxSTtBQUNySSxXQUFXO0FBQ1gsK0JBQStCO0FBQy9CLEVBQUU7QUFDRix5SUFBeUk7QUFDekksbUJBQW1CO0FBQ25CLEVBQUU7QUFDRiwrR0FBK0c7QUFDL0csd0hBQXdIO0FBQ3hILEVBQUU7QUFDRix5SEFBeUg7QUFDekgsMklBQTJJO0FBQzNJLHNCQUFzQjtBQUN0QixFQUFFO0FBQ0Ysc0hBQXNIO0FBQ3RILG9GQUFvRjtB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QyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJELE9BQU8sT0FBTyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDOUQsQ0FBQztJQUVPLHNCQUFzQixDQUFDLGFBQXFCO1FBQ2xELE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDN0UsQ0FBQzs7QUFsWk0sbURBQTRCLEdBQUcsa0JBQWtCLENBQUM7bUhBRDlDLHNCQUFzQix5TEFXdkIsUUFBUTt1SEFYUCxzQkFBc0I7MkZBQXRCLHNCQUFzQjtrQkFEbEMsVUFBVTs7MEJBWU4sTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgYmFzZTY0dXJsIH0gZnJvbSAncmZjNDY0OCc7XHJcbmltcG9ydCB7IGZyb20sIE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCwgbWVyZ2VNYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IEp3a0V4dHJhY3RvciB9IGZyb20gJy4uL2V4dHJhY3RvcnMvandrLmV4dHJhY3Rvcic7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVG9rZW5IZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbHMvdG9rZW5IZWxwZXIvdG9rZW4taGVscGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBKd2tXaW5kb3dDcnlwdG9TZXJ2aWNlIH0gZnJvbSAnLi9qd2std2luZG93LWNyeXB0by5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSnd0V2luZG93Q3J5cHRvU2VydmljZSB9IGZyb20gJy4vand0LXdpbmRvdy1jcnlwdG8uc2VydmljZSc7XHJcbmltcG9ydCB7IGFsZzJrdHksIGdldEltcG9ydEFsZywgZ2V0VmVyaWZ5QWxnIH0gZnJvbSAnLi90b2tlbi12YWxpZGF0aW9uLmhlbHBlcic7XHJcblxyXG4vLyBodHRwOi8vb3BlbmlkLm5ldC9zcGVjcy9vcGVuaWQtY29ubmVjdC1pbXBsaWNpdC0xXzAuaHRtbFxyXG5cclxuLy8gaWRfdG9rZW5cclxuLy8gaWRfdG9rZW4gQzE6IFRoZSBJc3N1ZXIgSWRlbnRpZmllciBmb3IgdGhlIE9wZW5JRCBQcm92aWRlciAod2hpY2ggaXMgdHlwaWNhbGx5IG9idGFpbmVkIGR1cmluZyBEaXNjb3ZlcnkpXHJcbi8vIE1VU1QgZXhhY3RseSBtYXRjaCB0aGUgdmFsdWUgb2YgdGhlIGlzcyAoaXNzdWVyKSBDbGFpbS5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzI6IFRoZSBDbGllbnQgTVVTVCB2YWxpZGF0ZSB0aGF0IHRoZSBhdWQgKGF1ZGllbmNlKSBDbGFpbSBjb250YWlucyBpdHMgY2xpZW50X2lkIHZhbHVlIHJlZ2lzdGVyZWQgYXQgdGhlIElzc3VlciBpZGVudGlmaWVkXHJcbi8vIGJ5IHRoZSBpc3MgKGlzc3VlcikgQ2xhaW0gYXMgYW4gYXVkaWVuY2UuVGhlIElEIFRva2VuIE1VU1QgYmUgcmVqZWN0ZWQgaWYgdGhlIElEIFRva2VuIGRvZXMgbm90IGxpc3QgdGhlIENsaWVudCBhcyBhIHZhbGlkIGF1ZGllbmNlLFxyXG4vLyBvciBpZiBpdCBjb250YWlucyBhZGRpdGlvbmFsIGF1ZGllbmNlcyBub3QgdHJ1c3RlZCBieSB0aGUgQ2xpZW50LlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDMzogSWYgdGhlIElEIFRva2VuIGNvbnRhaW5zIG11bHRpcGxlIGF1ZGllbmNlcywgdGhlIENsaWVudCBTSE9VTEQgdmVyaWZ5IHRoYXQgYW4gYXpwIENsYWltIGlzIHByZXNlbnQuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEM0OiBJZiBhbiBhenAgKGF1dGhvcml6ZWQgcGFydHkpIENsYWltIGlzIHByZXNlbnQsIHRoZSBDbGllbnQgU0hPVUxEIHZlcmlmeSB0aGF0IGl0cyBjbGllbnRfaWQgaXMgdGhlIENsYWltIFZhbHVlLlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDNTogVGhlIENsaWVudCBNVVNUIHZhbGlkYXRlIHRoZSBzaWduYXR1cmUgb2YgdGhlIElEIFRva2VuIGFjY29yZGluZyB0byBKV1MgW0pXU10gdXNpbmcgdGhlIGFsZ29yaXRobSBzcGVjaWZpZWQgaW4gdGhlXHJcbi8vIGFsZyBIZWFkZXIgUGFyYW1ldGVyIG9mIHRoZSBKT1NFIEhlYWRlci5UaGUgQ2xpZW50IE1VU1QgdXNlIHRoZSBrZXlzIHByb3ZpZGVkIGJ5IHRoZSBJc3N1ZXIuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEM2OiBUaGUgYWxnIHZhbHVlIFNIT1VMRCBiZSBSUzI1Ni4gVmFsaWRhdGlvbiBvZiB0b2tlbnMgdXNpbmcgb3RoZXIgc2lnbmluZyBhbGdvcml0aG1zIGlzIGRlc2NyaWJlZCBpbiB0aGUgT3BlbklEIENvbm5lY3RcclxuLy8gQ29yZSAxLjBcclxuLy8gW09wZW5JRC5Db3JlXSBzcGVjaWZpY2F0aW9uLlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDNzogVGhlIGN1cnJlbnQgdGltZSBNVVNUIGJlIGJlZm9yZSB0aGUgdGltZSByZXByZXNlbnRlZCBieSB0aGUgZXhwIENsYWltIChwb3NzaWJseSBhbGxvd2luZyBmb3Igc29tZSBzbWFsbCBsZWV3YXkgdG8gYWNjb3VudFxyXG4vLyBmb3IgY2xvY2sgc2tldykuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEM4OiBUaGUgaWF0IENsYWltIGNhbiBiZSB1c2VkIHRvIHJlamVjdCB0b2tlbnMgdGhhdCB3ZXJlIGlzc3VlZCB0b28gZmFyIGF3YXkgZnJvbSB0aGUgY3VycmVudCB0aW1lLFxyXG4vLyBsaW1pdGluZyB0aGUgYW1vdW50IG9mIHRpbWUgdGhhdCBub25jZXMgbmVlZCB0byBiZSBzdG9yZWQgdG8gcHJldmVudCBhdHRhY2tzLlRoZSBhY2NlcHRhYmxlIHJhbmdlIGlzIENsaWVudCBzcGVjaWZpYy5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzk6IFRoZSB2YWx1ZSBvZiB0aGUgbm9uY2UgQ2xhaW0gTVVTVCBiZSBjaGVja2VkIHRvIHZlcmlmeSB0aGF0IGl0IGlzIHRoZSBzYW1lIHZhbHVlIGFzIHRoZSBvbmUgdGhhdCB3YXMgc2VudFxyXG4vLyBpbiB0aGUgQXV0aGVudGljYXRpb24gUmVxdWVzdC5UaGUgQ2xpZW50IFNIT1VMRCBjaGVjayB0aGUgbm9uY2UgdmFsdWUgZm9yIHJlcGxheSBhdHRhY2tzLlRoZSBwcmVjaXNlIG1ldGhvZCBmb3IgZGV0ZWN0aW5nIHJlcGxheSBhdHRhY2tzXHJcbi8vIGlzIENsaWVudCBzcGVjaWZpYy5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzEwOiBJZiB0aGUgYWNyIENsYWltIHdhcyByZXF1ZXN0ZWQsIHRoZSBDbGllbnQgU0hPVUxEIGNoZWNrIHRoYXQgdGhlIGFzc2VydGVkIENsYWltIFZhbHVlIGlzIGFwcHJvcHJpYXRlLlxyXG4vLyBUaGUgbWVhbmluZyBhbmQgcHJvY2Vzc2luZyBvZiBhY3IgQ2xhaW0gVmFsdWVzIGlzIG91dCBvZiBzY29wZSBmb3IgdGhpcyBkb2N1bWVudC5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzExOiBXaGVuIGEgbWF4X2FnZSByZXF1ZXN0IGlzIG1hZGUsIHRoZSBDbGllbnQgU0hPVUxEIGNoZWNrIHRoZSBhdXRoX3RpbWUgQ2xhaW0gdmFsdWUgYW5kIHJlcXVlc3QgcmUtIGF1dGhlbnRpY2F0aW9uXHJcbi8vIGlmIGl0IGRldGVybWluZXMgdG9vIG11Y2ggdGltZSBoYXMgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCBFbmQtIFVzZXIgYXV0aGVudGljYXRpb24uXHJcblxyXG4vLyBBY2Nlc3MgVG9rZW4gVmFsaWRhdGlvblxyXG4vLyBhY2Nlc3NfdG9rZW4gQzE6IEhhc2ggdGhlIG9jdGV0cyBvZiB0aGUgQVNDSUkgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2Vzc190b2tlbiB3aXRoIHRoZSBoYXNoIGFsZ29yaXRobSBzcGVjaWZpZWQgaW4gSldBW0pXQV1cclxuLy8gZm9yIHRoZSBhbGcgSGVhZGVyIFBhcmFtZXRlciBvZiB0aGUgSUQgVG9rZW4ncyBKT1NFIEhlYWRlci4gRm9yIGluc3RhbmNlLCBpZiB0aGUgYWxnIGlzIFJTMjU2LCB0aGUgaGFzaCBhbGdvcml0aG0gdXNlZCBpcyBTSEEtMjU2LlxyXG4vLyBhY2Nlc3NfdG9rZW4gQzI6IFRha2UgdGhlIGxlZnQtIG1vc3QgaGFsZiBvZiB0aGUgaGFzaCBhbmQgYmFzZTY0dXJsLSBlbmNvZGUgaXQuXHJcbi8vIGFjY2Vzc190b2tlbiBDMzogVGhlIHZhbHVlIG9mIGF0X2hhc2ggaW4gdGhlIElEIFRva2VuIE1VU1QgbWF0Y2ggdGhlIHZhbHVlIHByb2R1Y2VkIGluIHRoZSBwcmV2aW91cyBzdGVwIGlmIGF0X2hhc2ggaXMgcHJlc2VudFxyXG4vLyBpbiB0aGUgSUQgVG9rZW4uXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUb2tlblZhbGlkYXRpb25TZXJ2aWNlIHtcclxuICBzdGF0aWMgcmVmcmVzaFRva2VuTm9uY2VQbGFjZWhvbGRlciA9ICctLVJlZnJlc2hUb2tlbi0tJztcclxuXHJcbiAga2V5QWxnb3JpdGhtczogc3RyaW5nW10gPSBbJ0hTMjU2JywgJ0hTMzg0JywgJ0hTNTEyJywgJ1JTMjU2JywgJ1JTMzg0JywgJ1JTNTEyJywgJ0VTMjU2JywgJ0VTMzg0JywgJ1BTMjU2JywgJ1BTMzg0JywgJ1BTNTEyJ107XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSB0b2tlbkhlbHBlclNlcnZpY2U6IFRva2VuSGVscGVyU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgandrRXh0cmFjdG9yOiBKd2tFeHRyYWN0b3IsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGp3a1dpbmRvd0NyeXB0b1NlcnZpY2U6IEp3a1dpbmRvd0NyeXB0b1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGp3dFdpbmRvd0NyeXB0b1NlcnZpY2U6IEp3dFdpbmRvd0NyeXB0b1NlcnZpY2UsXHJcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIHJlYWRvbmx5IGRvY3VtZW50OiBEb2N1bWVudFxyXG4gICkge31cclxuXHJcbiAgLy8gaWRfdG9rZW4gQzc6IFRoZSBjdXJyZW50IHRpbWUgTVVTVCBiZSBiZWZvcmUgdGhlIHRpbWUgcmVwcmVzZW50ZWQgYnkgdGhlIGV4cCBDbGFpbVxyXG4gIC8vIChwb3NzaWJseSBhbGxvd2luZyBmb3Igc29tZSBzbWFsbCBsZWV3YXkgdG8gYWNjb3VudCBmb3IgY2xvY2sgc2tldykuXHJcbiAgaGFzSWRUb2tlbkV4cGlyZWQodG9rZW46IHN0cmluZywgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbiwgb2Zmc2V0U2Vjb25kcz86IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgZGVjb2RlZCA9IHRoaXMudG9rZW5IZWxwZXJTZXJ2aWNlLmdldFBheWxvYWRGcm9tVG9rZW4odG9rZW4sIGZhbHNlLCBjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICByZXR1cm4gIXRoaXMudmFsaWRhdGVJZFRva2VuRXhwTm90RXhwaXJlZChkZWNvZGVkLCBjb25maWd1cmF0aW9uLCBvZmZzZXRTZWNvbmRzKTtcclxuICB9XHJcblxyXG4gIC8vIGlkX3Rva2VuIEM3OiBUaGUgY3VycmVudCB0aW1lIE1VU1QgYmUgYmVmb3JlIHRoZSB0aW1lIHJlcHJlc2VudGVkIGJ5IHRoZSBleHAgQ2xhaW1cclxuICAvLyAocG9zc2libHkgYWxsb3dpbmcgZm9yIHNvbWUgc21hbGwgbGVld2F5IHRvIGFjY291bnQgZm9yIGNsb2NrIHNrZXcpLlxyXG4gIHZhbGlkYXRlSWRUb2tlbkV4cE5vdEV4cGlyZWQoZGVjb2RlZElkVG9rZW46IHN0cmluZywgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbiwgb2Zmc2V0U2Vjb25kcz86IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgdG9rZW5FeHBpcmF0aW9uRGF0ZSA9IHRoaXMudG9rZW5IZWxwZXJTZXJ2aWNlLmdldFRva2VuRXhwaXJhdGlvbkRhdGUoZGVjb2RlZElkVG9rZW4pO1xyXG5cclxuICAgIG9mZnNldFNlY29uZHMgPSBvZmZzZXRTZWNvbmRzIHx8IDA7XHJcblxyXG4gICAgaWYgKCF0b2tlbkV4cGlyYXRpb25EYXRlKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0b2tlbkV4cGlyYXRpb25WYWx1ZSA9IHRva2VuRXhwaXJhdGlvbkRhdGUudmFsdWVPZigpO1xyXG4gICAgY29uc3Qgbm93V2l0aE9mZnNldCA9IHRoaXMuY2FsY3VsYXRlTm93V2l0aE9mZnNldChvZmZzZXRTZWNvbmRzKTtcclxuICAgIGNvbnN0IHRva2VuTm90RXhwaXJlZCA9IHRva2VuRXhwaXJhdGlvblZhbHVlID4gbm93V2l0aE9mZnNldDtcclxuXHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoXHJcbiAgICAgIGNvbmZpZ3VyYXRpb24sXHJcbiAgICAgIGBIYXMgaWRUb2tlbiBleHBpcmVkOiAkeyF0b2tlbk5vdEV4cGlyZWR9IC0tPiBleHBpcmVzIGluICR7dGhpcy5taWxsaXNUb01pbnV0ZXNBbmRTZWNvbmRzKFxyXG4gICAgICAgIHRva2VuRXhwaXJhdGlvblZhbHVlIC0gbm93V2l0aE9mZnNldFxyXG4gICAgICApfSAsICR7bmV3IERhdGUodG9rZW5FeHBpcmF0aW9uVmFsdWUpLnRvTG9jYWxlVGltZVN0cmluZygpfSA+ICR7bmV3IERhdGUobm93V2l0aE9mZnNldCkudG9Mb2NhbGVUaW1lU3RyaW5nKCl9YFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gdG9rZW5Ob3RFeHBpcmVkO1xyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGVBY2Nlc3NUb2tlbk5vdEV4cGlyZWQoYWNjZXNzVG9rZW5FeHBpcmVzQXQ6IERhdGUsIGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24sIG9mZnNldFNlY29uZHM/OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgIC8vIHZhbHVlIGlzIG9wdGlvbmFsLCBzbyBpZiBpdCBkb2VzIG5vdCBleGlzdCwgdGhlbiBpdCBoYXMgbm90IGV4cGlyZWRcclxuICAgIGlmICghYWNjZXNzVG9rZW5FeHBpcmVzQXQpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgb2Zmc2V0U2Vjb25kcyA9IG9mZnNldFNlY29uZHMgfHwgMDtcclxuICAgIGNvbnN0IGFjY2Vzc1Rva2VuRXhwaXJhdGlvblZhbHVlID0gYWNjZXNzVG9rZW5FeHBpcmVzQXQudmFsdWVPZigpO1xyXG4gICAgY29uc3Qgbm93V2l0aE9mZnNldCA9IHRoaXMuY2FsY3VsYXRlTm93V2l0aE9mZnNldChvZmZzZXRTZWNvbmRzKTtcclxuICAgIGNvbnN0IHRva2VuTm90RXhwaXJlZCA9IGFjY2Vzc1Rva2VuRXhwaXJhdGlvblZhbHVlID4gbm93V2l0aE9mZnNldDtcclxuXHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoXHJcbiAgICAgIGNvbmZpZ3VyYXRpb24sXHJcbiAgICAgIGBIYXMgYWNjZXNzVG9rZW4gZXhwaXJlZDogJHshdG9rZW5Ob3RFeHBpcmVkfSAtLT4gZXhwaXJlcyBpbiAke3RoaXMubWlsbGlzVG9NaW51dGVzQW5kU2Vjb25kcyhcclxuICAgICAgICBhY2Nlc3NUb2tlbkV4cGlyYXRpb25WYWx1ZSAtIG5vd1dpdGhPZmZzZXRcclxuICAgICAgKX0gLCAke25ldyBEYXRlKGFjY2Vzc1Rva2VuRXhwaXJhdGlvblZhbHVlKS50b0xvY2FsZVRpbWVTdHJpbmcoKX0gPiAke25ldyBEYXRlKG5vd1dpdGhPZmZzZXQpLnRvTG9jYWxlVGltZVN0cmluZygpfWBcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIHRva2VuTm90RXhwaXJlZDtcclxuICB9XHJcblxyXG4gIC8vIGlzc1xyXG4gIC8vIFJFUVVJUkVELiBJc3N1ZXIgSWRlbnRpZmllciBmb3IgdGhlIElzc3VlciBvZiB0aGUgcmVzcG9uc2UuVGhlIGlzcyB2YWx1ZSBpcyBhIGNhc2Utc2Vuc2l0aXZlIFVSTCB1c2luZyB0aGVcclxuICAvLyBodHRwcyBzY2hlbWUgdGhhdCBjb250YWlucyBzY2hlbWUsIGhvc3QsXHJcbiAgLy8gYW5kIG9wdGlvbmFsbHksIHBvcnQgbnVtYmVyIGFuZCBwYXRoIGNvbXBvbmVudHMgYW5kIG5vIHF1ZXJ5IG9yIGZyYWdtZW50IGNvbXBvbmVudHMuXHJcbiAgLy9cclxuICAvLyBzdWJcclxuICAvLyBSRVFVSVJFRC4gU3ViamVjdCBJZGVudGlmaWVyLkxvY2FsbHkgdW5pcXVlIGFuZCBuZXZlciByZWFzc2lnbmVkIGlkZW50aWZpZXIgd2l0aGluIHRoZSBJc3N1ZXIgZm9yIHRoZSBFbmQtIFVzZXIsXHJcbiAgLy8gd2hpY2ggaXMgaW50ZW5kZWQgdG8gYmUgY29uc3VtZWQgYnkgdGhlIENsaWVudCwgZS5nLiwgMjQ0MDAzMjAgb3IgQUl0T2F3bXd0V3djVDBrNTFCYXlld052dXRySlVxc3ZsNnFzN0E0LlxyXG4gIC8vIEl0IE1VU1QgTk9UIGV4Y2VlZCAyNTUgQVNDSUkgY2hhcmFjdGVycyBpbiBsZW5ndGguVGhlIHN1YiB2YWx1ZSBpcyBhIGNhc2Utc2Vuc2l0aXZlIHN0cmluZy5cclxuICAvL1xyXG4gIC8vIGF1ZFxyXG4gIC8vIFJFUVVJUkVELiBBdWRpZW5jZShzKSB0aGF0IHRoaXMgSUQgVG9rZW4gaXMgaW50ZW5kZWQgZm9yLiBJdCBNVVNUIGNvbnRhaW4gdGhlIE9BdXRoIDIuMCBjbGllbnRfaWQgb2YgdGhlIFJlbHlpbmcgUGFydHkgYXMgYW5cclxuICAvLyBhdWRpZW5jZSB2YWx1ZS5cclxuICAvLyBJdCBNQVkgYWxzbyBjb250YWluIGlkZW50aWZpZXJzIGZvciBvdGhlciBhdWRpZW5jZXMuSW4gdGhlIGdlbmVyYWwgY2FzZSwgdGhlIGF1ZCB2YWx1ZSBpcyBhbiBhcnJheSBvZiBjYXNlLXNlbnNpdGl2ZSBzdHJpbmdzLlxyXG4gIC8vIEluIHRoZSBjb21tb24gc3BlY2lhbCBjYXNlIHdoZW4gdGhlcmUgaXMgb25lIGF1ZGllbmNlLCB0aGUgYXVkIHZhbHVlIE1BWSBiZSBhIHNpbmdsZSBjYXNlLXNlbnNpdGl2ZSBzdHJpbmcuXHJcbiAgLy9cclxuICAvLyBleHBcclxuICAvLyBSRVFVSVJFRC4gRXhwaXJhdGlvbiB0aW1lIG9uIG9yIGFmdGVyIHdoaWNoIHRoZSBJRCBUb2tlbiBNVVNUIE5PVCBiZSBhY2NlcHRlZCBmb3IgcHJvY2Vzc2luZy5cclxuICAvLyBUaGUgcHJvY2Vzc2luZyBvZiB0aGlzIHBhcmFtZXRlciByZXF1aXJlcyB0aGF0IHRoZSBjdXJyZW50IGRhdGUvIHRpbWUgTVVTVCBiZSBiZWZvcmUgdGhlIGV4cGlyYXRpb24gZGF0ZS8gdGltZSBsaXN0ZWQgaW4gdGhlIHZhbHVlLlxyXG4gIC8vIEltcGxlbWVudGVycyBNQVkgcHJvdmlkZSBmb3Igc29tZSBzbWFsbCBsZWV3YXksIHVzdWFsbHkgbm8gbW9yZSB0aGFuIGEgZmV3IG1pbnV0ZXMsIHRvIGFjY291bnQgZm9yIGNsb2NrIHNrZXcuXHJcbiAgLy8gSXRzIHZhbHVlIGlzIGEgSlNPTiBbUkZDNzE1OV0gbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSAxOTcwLSAwMSAtIDAxVDAwOiAwMDowMFogYXMgbWVhc3VyZWQgaW4gVVRDIHVudGlsXHJcbiAgLy8gdGhlIGRhdGUvIHRpbWUuXHJcbiAgLy8gU2VlIFJGQyAzMzM5IFtSRkMzMzM5XSBmb3IgZGV0YWlscyByZWdhcmRpbmcgZGF0ZS8gdGltZXMgaW4gZ2VuZXJhbCBhbmQgVVRDIGluIHBhcnRpY3VsYXIuXHJcbiAgLy9cclxuICAvLyBpYXRcclxuICAvLyBSRVFVSVJFRC4gVGltZSBhdCB3aGljaCB0aGUgSldUIHdhcyBpc3N1ZWQuIEl0cyB2YWx1ZSBpcyBhIEpTT04gbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbVxyXG4gIC8vIDE5NzAtIDAxIC0gMDFUMDA6IDAwOiAwMFogYXMgbWVhc3VyZWRcclxuICAvLyBpbiBVVEMgdW50aWwgdGhlIGRhdGUvIHRpbWUuXHJcbiAgdmFsaWRhdGVSZXF1aXJlZElkVG9rZW4oZGF0YUlkVG9rZW46IGFueSwgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbik6IGJvb2xlYW4ge1xyXG4gICAgbGV0IHZhbGlkYXRlZCA9IHRydWU7XHJcblxyXG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGF0YUlkVG9rZW4sICdpc3MnKSkge1xyXG4gICAgICB2YWxpZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoY29uZmlndXJhdGlvbiwgJ2lzcyBpcyBtaXNzaW5nLCB0aGlzIGlzIHJlcXVpcmVkIGluIHRoZSBpZF90b2tlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGFJZFRva2VuLCAnc3ViJykpIHtcclxuICAgICAgdmFsaWRhdGVkID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKGNvbmZpZ3VyYXRpb24sICdzdWIgaXMgbWlzc2luZywgdGhpcyBpcyByZXF1aXJlZCBpbiB0aGUgaWRfdG9rZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkYXRhSWRUb2tlbiwgJ2F1ZCcpKSB7XHJcbiAgICAgIHZhbGlkYXRlZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyhjb25maWd1cmF0aW9uLCAnYXVkIGlzIG1pc3NpbmcsIHRoaXMgaXMgcmVxdWlyZWQgaW4gdGhlIGlkX3Rva2VuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGF0YUlkVG9rZW4sICdleHAnKSkge1xyXG4gICAgICB2YWxpZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoY29uZmlndXJhdGlvbiwgJ2V4cCBpcyBtaXNzaW5nLCB0aGlzIGlzIHJlcXVpcmVkIGluIHRoZSBpZF90b2tlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGFJZFRva2VuLCAnaWF0JykpIHtcclxuICAgICAgdmFsaWRhdGVkID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKGNvbmZpZ3VyYXRpb24sICdpYXQgaXMgbWlzc2luZywgdGhpcyBpcyByZXF1aXJlZCBpbiB0aGUgaWRfdG9rZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsaWRhdGVkO1xyXG4gIH1cclxuXHJcbiAgLy8gaWRfdG9rZW4gQzg6IFRoZSBpYXQgQ2xhaW0gY2FuIGJlIHVzZWQgdG8gcmVqZWN0IHRva2VucyB0aGF0IHdlcmUgaXNzdWVkIHRvbyBmYXIgYXdheSBmcm9tIHRoZSBjdXJyZW50IHRpbWUsXHJcbiAgLy8gbGltaXRpbmcgdGhlIGFtb3VudCBvZiB0aW1lIHRoYXQgbm9uY2VzIG5lZWQgdG8gYmUgc3RvcmVkIHRvIHByZXZlbnQgYXR0YWNrcy5UaGUgYWNjZXB0YWJsZSByYW5nZSBpcyBDbGllbnQgc3BlY2lmaWMuXHJcbiAgdmFsaWRhdGVJZFRva2VuSWF0TWF4T2Zmc2V0KFxyXG4gICAgZGF0YUlkVG9rZW46IGFueSxcclxuICAgIG1heE9mZnNldEFsbG93ZWRJblNlY29uZHM6IG51bWJlcixcclxuICAgIGRpc2FibGVJYXRPZmZzZXRWYWxpZGF0aW9uOiBib29sZWFuLFxyXG4gICAgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvblxyXG4gICk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKGRpc2FibGVJYXRPZmZzZXRWYWxpZGF0aW9uKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGFJZFRva2VuLCAnaWF0JykpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGVUaW1lSWF0SWRUb2tlbiA9IG5ldyBEYXRlKDApOyAvLyBUaGUgMCBoZXJlIGlzIHRoZSBrZXksIHdoaWNoIHNldHMgdGhlIGRhdGUgdG8gdGhlIGVwb2NoXHJcblxyXG4gICAgZGF0ZVRpbWVJYXRJZFRva2VuLnNldFVUQ1NlY29uZHMoZGF0YUlkVG9rZW4uaWF0KTtcclxuICAgIG1heE9mZnNldEFsbG93ZWRJblNlY29uZHMgPSBtYXhPZmZzZXRBbGxvd2VkSW5TZWNvbmRzIHx8IDA7XHJcblxyXG4gICAgY29uc3Qgbm93SW5VdGMgPSBuZXcgRGF0ZShuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKCkpO1xyXG4gICAgY29uc3QgZGlmZiA9IG5vd0luVXRjLnZhbHVlT2YoKSAtIGRhdGVUaW1lSWF0SWRUb2tlbi52YWx1ZU9mKCk7XHJcbiAgICBjb25zdCBtYXhPZmZzZXRBbGxvd2VkSW5NaWxsaXNlY29uZHMgPSBtYXhPZmZzZXRBbGxvd2VkSW5TZWNvbmRzICogMTAwMDtcclxuXHJcbiAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY29uZmlndXJhdGlvbiwgYHZhbGlkYXRlIGlkIHRva2VuIGlhdCBtYXggb2Zmc2V0ICR7ZGlmZn0gPCAke21heE9mZnNldEFsbG93ZWRJbk1pbGxpc2Vjb25kc31gKTtcclxuXHJcbiAgICBpZiAoZGlmZiA+IDApIHtcclxuICAgICAgcmV0dXJuIGRpZmYgPCBtYXhPZmZzZXRBbGxvd2VkSW5NaWxsaXNlY29uZHM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIC1kaWZmIDwgbWF4T2Zmc2V0QWxsb3dlZEluTWlsbGlzZWNvbmRzO1xyXG4gIH1cclxuXHJcbiAgLy8gaWRfdG9rZW4gQzk6IFRoZSB2YWx1ZSBvZiB0aGUgbm9uY2UgQ2xhaW0gTVVTVCBiZSBjaGVja2VkIHRvIHZlcmlmeSB0aGF0IGl0IGlzIHRoZSBzYW1lIHZhbHVlIGFzIHRoZSBvbmVcclxuICAvLyB0aGF0IHdhcyBzZW50IGluIHRoZSBBdXRoZW50aWNhdGlvbiBSZXF1ZXN0LlRoZSBDbGllbnQgU0hPVUxEIGNoZWNrIHRoZSBub25jZSB2YWx1ZSBmb3IgcmVwbGF5IGF0dGFja3MuXHJcbiAgLy8gVGhlIHByZWNpc2UgbWV0aG9kIGZvciBkZXRlY3RpbmcgcmVwbGF5IGF0dGFja3MgaXMgQ2xpZW50IHNwZWNpZmljLlxyXG5cclxuICAvLyBIb3dldmVyIHRoZSBub25jZSBjbGFpbSBTSE9VTEQgbm90IGJlIHByZXNlbnQgZm9yIHRoZSByZWZyZXNoX3Rva2VuIGdyYW50IHR5cGVcclxuICAvLyBodHRwczovL2JpdGJ1Y2tldC5vcmcvb3BlbmlkL2Nvbm5lY3QvaXNzdWVzLzEwMjUvYW1iaWd1aXR5LXdpdGgtaG93LW5vbmNlLWlzLWhhbmRsZWQtb25cclxuICAvLyBUaGUgY3VycmVudCBzcGVjIGlzIGFtYmlndW91cyBhbmQgS2V5Q2xvYWsgZG9lcyBzZW5kIGl0LlxyXG4gIHZhbGlkYXRlSWRUb2tlbk5vbmNlKGRhdGFJZFRva2VuOiBhbnksIGxvY2FsTm9uY2U6IGFueSwgaWdub3JlTm9uY2VBZnRlclJlZnJlc2g6IGJvb2xlYW4sIGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGlzRnJvbVJlZnJlc2hUb2tlbiA9XHJcbiAgICAgIChkYXRhSWRUb2tlbi5ub25jZSA9PT0gdW5kZWZpbmVkIHx8IGlnbm9yZU5vbmNlQWZ0ZXJSZWZyZXNoKSAmJiBsb2NhbE5vbmNlID09PSBUb2tlblZhbGlkYXRpb25TZXJ2aWNlLnJlZnJlc2hUb2tlbk5vbmNlUGxhY2Vob2xkZXI7XHJcblxyXG4gICAgaWYgKCFpc0Zyb21SZWZyZXNoVG9rZW4gJiYgZGF0YUlkVG9rZW4ubm9uY2UgIT09IGxvY2FsTm9uY2UpIHtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKFxyXG4gICAgICAgIGNvbmZpZ3VyYXRpb24sXHJcbiAgICAgICAgJ1ZhbGlkYXRlX2lkX3Rva2VuX25vbmNlIGZhaWxlZCwgZGF0YUlkVG9rZW4ubm9uY2U6ICcgKyBkYXRhSWRUb2tlbi5ub25jZSArICcgbG9jYWxfbm9uY2U6JyArIGxvY2FsTm9uY2VcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8vIGlkX3Rva2VuIEMxOiBUaGUgSXNzdWVyIElkZW50aWZpZXIgZm9yIHRoZSBPcGVuSUQgUHJvdmlkZXIgKHdoaWNoIGlzIHR5cGljYWxseSBvYnRhaW5lZCBkdXJpbmcgRGlzY292ZXJ5KVxyXG4gIC8vIE1VU1QgZXhhY3RseSBtYXRjaCB0aGUgdmFsdWUgb2YgdGhlIGlzcyAoaXNzdWVyKSBDbGFpbS5cclxuICB2YWxpZGF0ZUlkVG9rZW5Jc3MoZGF0YUlkVG9rZW46IGFueSwgYXV0aFdlbGxLbm93bkVuZHBvaW50c0lzc3VlcjogYW55LCBjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoKGRhdGFJZFRva2VuLmlzcyBhcyBzdHJpbmcpICE9PSAoYXV0aFdlbGxLbm93bkVuZHBvaW50c0lzc3VlciBhcyBzdHJpbmcpKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhcclxuICAgICAgICBjb25maWd1cmF0aW9uLFxyXG4gICAgICAgICdWYWxpZGF0ZV9pZF90b2tlbl9pc3MgZmFpbGVkLCBkYXRhSWRUb2tlbi5pc3M6ICcgK1xyXG4gICAgICAgICAgZGF0YUlkVG9rZW4uaXNzICtcclxuICAgICAgICAgICcgYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpc3N1ZXI6JyArXHJcbiAgICAgICAgICBhdXRoV2VsbEtub3duRW5kcG9pbnRzSXNzdWVyXHJcbiAgICAgICk7XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvLyBpZF90b2tlbiBDMjogVGhlIENsaWVudCBNVVNUIHZhbGlkYXRlIHRoYXQgdGhlIGF1ZCAoYXVkaWVuY2UpIENsYWltIGNvbnRhaW5zIGl0cyBjbGllbnRfaWQgdmFsdWUgcmVnaXN0ZXJlZCBhdCB0aGUgSXNzdWVyIGlkZW50aWZpZWRcclxuICAvLyBieSB0aGUgaXNzIChpc3N1ZXIpIENsYWltIGFzIGFuIGF1ZGllbmNlLlxyXG4gIC8vIFRoZSBJRCBUb2tlbiBNVVNUIGJlIHJlamVjdGVkIGlmIHRoZSBJRCBUb2tlbiBkb2VzIG5vdCBsaXN0IHRoZSBDbGllbnQgYXMgYSB2YWxpZCBhdWRpZW5jZSwgb3IgaWYgaXQgY29udGFpbnMgYWRkaXRpb25hbCBhdWRpZW5jZXNcclxuICAvLyBub3QgdHJ1c3RlZCBieSB0aGUgQ2xpZW50LlxyXG4gIHZhbGlkYXRlSWRUb2tlbkF1ZChkYXRhSWRUb2tlbjogYW55LCBhdWQ6IGFueSwgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbik6IGJvb2xlYW4ge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YUlkVG9rZW4uYXVkKSkge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBkYXRhSWRUb2tlbi5hdWQuaW5jbHVkZXMoYXVkKTtcclxuXHJcbiAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKFxyXG4gICAgICAgICAgY29uZmlndXJhdGlvbixcclxuICAgICAgICAgICdWYWxpZGF0ZV9pZF90b2tlbl9hdWQgYXJyYXkgZmFpbGVkLCBkYXRhSWRUb2tlbi5hdWQ6ICcgKyBkYXRhSWRUb2tlbi5hdWQgKyAnIGNsaWVudF9pZDonICsgYXVkXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAoZGF0YUlkVG9rZW4uYXVkICE9PSBhdWQpIHtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZ3VyYXRpb24sICdWYWxpZGF0ZV9pZF90b2tlbl9hdWQgZmFpbGVkLCBkYXRhSWRUb2tlbi5hdWQ6ICcgKyBkYXRhSWRUb2tlbi5hdWQgKyAnIGNsaWVudF9pZDonICsgYXVkKTtcclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHZhbGlkYXRlSWRUb2tlbkF6cEV4aXN0c0lmTW9yZVRoYW5PbmVBdWQoZGF0YUlkVG9rZW46IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCFkYXRhSWRUb2tlbikge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YUlkVG9rZW4uYXVkKSAmJiBkYXRhSWRUb2tlbi5hdWQubGVuZ3RoID4gMSAmJiAhZGF0YUlkVG9rZW4uYXpwKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8vIElmIGFuIGF6cCAoYXV0aG9yaXplZCBwYXJ0eSkgQ2xhaW0gaXMgcHJlc2VudCwgdGhlIENsaWVudCBTSE9VTEQgdmVyaWZ5IHRoYXQgaXRzIGNsaWVudF9pZCBpcyB0aGUgQ2xhaW0gVmFsdWUuXHJcbiAgdmFsaWRhdGVJZFRva2VuQXpwVmFsaWQoZGF0YUlkVG9rZW46IGFueSwgY2xpZW50SWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCFkYXRhSWRUb2tlbj8uYXpwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhSWRUb2tlbi5henAgPT09IGNsaWVudElkKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHZhbGlkYXRlU3RhdGVGcm9tSGFzaENhbGxiYWNrKHN0YXRlOiBhbnksIGxvY2FsU3RhdGU6IGFueSwgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbik6IGJvb2xlYW4ge1xyXG4gICAgaWYgKChzdGF0ZSBhcyBzdHJpbmcpICE9PSAobG9jYWxTdGF0ZSBhcyBzdHJpbmcpKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWd1cmF0aW9uLCAnVmFsaWRhdGVTdGF0ZUZyb21IYXNoQ2FsbGJhY2sgZmFpbGVkLCBzdGF0ZTogJyArIHN0YXRlICsgJyBsb2NhbF9zdGF0ZTonICsgbG9jYWxTdGF0ZSk7XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvLyBpZF90b2tlbiBDNTogVGhlIENsaWVudCBNVVNUIHZhbGlkYXRlIHRoZSBzaWduYXR1cmUgb2YgdGhlIElEIFRva2VuIGFjY29yZGluZyB0byBKV1MgW0pXU10gdXNpbmcgdGhlIGFsZ29yaXRobSBzcGVjaWZpZWQgaW4gdGhlIGFsZ1xyXG4gIC8vIEhlYWRlciBQYXJhbWV0ZXIgb2YgdGhlIEpPU0UgSGVhZGVyLlRoZSBDbGllbnQgTVVTVCB1c2UgdGhlIGtleXMgcHJvdmlkZWQgYnkgdGhlIElzc3Vlci5cclxuICAvLyBpZF90b2tlbiBDNjogVGhlIGFsZyB2YWx1ZSBTSE9VTEQgYmUgUlMyNTYuIFZhbGlkYXRpb24gb2YgdG9rZW5zIHVzaW5nIG90aGVyIHNpZ25pbmcgYWxnb3JpdGhtcyBpcyBkZXNjcmliZWQgaW4gdGhlXHJcbiAgLy8gT3BlbklEIENvbm5lY3QgQ29yZSAxLjAgW09wZW5JRC5Db3JlXSBzcGVjaWZpY2F0aW9uLlxyXG4gIHZhbGlkYXRlU2lnbmF0dXJlSWRUb2tlbihpZFRva2VuOiBzdHJpbmcsIGp3dGtleXM6IGFueSwgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbik6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgaWYgKCFpZFRva2VuKSB7XHJcbiAgICAgIHJldHVybiBvZih0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWp3dGtleXMgfHwgIWp3dGtleXMua2V5cykge1xyXG4gICAgICByZXR1cm4gb2YoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGhlYWRlckRhdGEgPSB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRIZWFkZXJGcm9tVG9rZW4oaWRUb2tlbiwgZmFsc2UsIGNvbmZpZ3VyYXRpb24pO1xyXG5cclxuICAgIGlmIChPYmplY3Qua2V5cyhoZWFkZXJEYXRhKS5sZW5ndGggPT09IDAgJiYgaGVhZGVyRGF0YS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKGNvbmZpZ3VyYXRpb24sICdpZCB0b2tlbiBoYXMgbm8gaGVhZGVyIGRhdGEnKTtcclxuXHJcbiAgICAgIHJldHVybiBvZihmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qga2lkOiBzdHJpbmcgPSBoZWFkZXJEYXRhLmtpZDtcclxuICAgIGxldCBhbGc6IHN0cmluZyA9IGhlYWRlckRhdGEuYWxnO1xyXG5cclxuICAgIGxldCBrZXlzOiBKc29uV2ViS2V5W10gPSBqd3RrZXlzLmtleXM7XHJcbiAgICBsZXQgZm91bmRLZXlzOiBKc29uV2ViS2V5W107XHJcbiAgICBsZXQga2V5OiBKc29uV2ViS2V5O1xyXG5cclxuICAgIGlmICghdGhpcy5rZXlBbGdvcml0aG1zLmluY2x1ZGVzKGFsZykpIHtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoY29uZmlndXJhdGlvbiwgJ2FsZyBub3Qgc3VwcG9ydGVkJywgYWxnKTtcclxuXHJcbiAgICAgIHJldHVybiBvZihmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qga3R5ID0gYWxnMmt0eShhbGcpO1xyXG4gICAgY29uc3QgdXNlID0gJ3NpZyc7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgZm91bmRLZXlzID0ga2lkXHJcbiAgICAgICAgPyB0aGlzLmp3a0V4dHJhY3Rvci5leHRyYWN0SndrKGtleXMsIHsga2lkLCBrdHksIHVzZSB9LCBmYWxzZSlcclxuICAgICAgICA6IHRoaXMuandrRXh0cmFjdG9yLmV4dHJhY3RKd2soa2V5cywgeyBrdHksIHVzZSB9LCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoZm91bmRLZXlzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGZvdW5kS2V5cyA9IGtpZCA/IHRoaXMuandrRXh0cmFjdG9yLmV4dHJhY3RKd2soa2V5cywgeyBraWQsIGt0eSB9KSA6IHRoaXMuandrRXh0cmFjdG9yLmV4dHJhY3RKd2soa2V5cywgeyBrdHkgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGtleSA9IGZvdW5kS2V5c1swXTtcclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoY29uZmlndXJhdGlvbiwgZSk7XHJcblxyXG4gICAgICByZXR1cm4gb2YoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFsZ29yaXRobTogUnNhSGFzaGVkSW1wb3J0UGFyYW1zIHwgRWNLZXlJbXBvcnRQYXJhbXMgPSBnZXRJbXBvcnRBbGcoYWxnKTtcclxuXHJcbiAgICBjb25zdCBzaWduaW5nSW5wdXQgPSB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRTaWduaW5nSW5wdXRGcm9tVG9rZW4oaWRUb2tlbiwgdHJ1ZSwgY29uZmlndXJhdGlvbik7XHJcbiAgICBjb25zdCByYXdTaWduYXR1cmUgPSB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRTaWduYXR1cmVGcm9tVG9rZW4oaWRUb2tlbiwgdHJ1ZSwgY29uZmlndXJhdGlvbik7XHJcblxyXG4gICAgY29uc3QgYWdlbnQ6IHN0cmluZyA9IHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgIGlmIChhZ2VudC5pbmRleE9mKCdmaXJlZm94JykgPiAtMSAmJiBrZXkua3R5ID09PSAnRUMnKSB7XHJcbiAgICAgIGtleS5hbGcgPSAnJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnJvbSh0aGlzLmp3a1dpbmRvd0NyeXB0b1NlcnZpY2UuaW1wb3J0VmVyaWZpY2F0aW9uS2V5KGtleSwgYWxnb3JpdGhtKSkucGlwZShcclxuICAgICAgbWVyZ2VNYXAoKGNyeXB0b0tleTogQ3J5cHRvS2V5KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2lnbmF0dXJlOiBVaW50OEFycmF5ID0gYmFzZTY0dXJsLnBhcnNlKHJhd1NpZ25hdHVyZSwgeyBsb29zZTogdHJ1ZSB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgdmVyaWZ5QWxnb3JpdGhtOiBSc2FIYXNoZWRJbXBvcnRQYXJhbXMgfCBFY2RzYVBhcmFtcyA9IGdldFZlcmlmeUFsZyhhbGcpO1xyXG5cclxuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmp3a1dpbmRvd0NyeXB0b1NlcnZpY2UudmVyaWZ5S2V5KHZlcmlmeUFsZ29yaXRobSwgY3J5cHRvS2V5LCBzaWduYXR1cmUsIHNpZ25pbmdJbnB1dCkpO1xyXG4gICAgICB9KSxcclxuICAgICAgdGFwKChpc1ZhbGlkOiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XHJcbiAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyhjb25maWd1cmF0aW9uLCAnaW5jb3JyZWN0IFNpZ25hdHVyZSwgdmFsaWRhdGlvbiBmYWlsZWQgZm9yIGlkX3Rva2VuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIEFjY2VwdHMgSUQgVG9rZW4gd2l0aG91dCAna2lkJyBjbGFpbSBpbiBKT1NFIGhlYWRlciBpZiBvbmx5IG9uZSBKV0sgc3VwcGxpZWQgaW4gJ2p3a3NfdXJsJ1xyXG4gIC8vLy8gcHJpdmF0ZSB2YWxpZGF0ZV9ub19raWRfaW5faGVhZGVyX29ubHlfb25lX2FsbG93ZWRfaW5fand0a2V5cyhoZWFkZXJfZGF0YTogYW55LCBqd3RrZXlzOiBhbnkpOiBib29sZWFuIHtcclxuICAvLy8vICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmxvZ0RlYnVnKCdhbW91bnQgb2Ygand0a2V5cy5rZXlzOiAnICsgand0a2V5cy5rZXlzLmxlbmd0aCk7XHJcbiAgLy8vLyAgICBpZiAoIWhlYWRlcl9kYXRhLmhhc093blByb3BlcnR5KCdraWQnKSkge1xyXG4gIC8vLy8gICAgICAgIC8vIG5vIGtpZCBkZWZpbmVkIGluIEpvc2UgaGVhZGVyXHJcbiAgLy8vLyAgICAgICAgaWYgKGp3dGtleXMua2V5cy5sZW5ndGggIT0gMSkge1xyXG4gIC8vLy8gICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5sb2dEZWJ1Zygnand0a2V5cy5rZXlzLmxlbmd0aCAhPSAxIGFuZCBubyBraWQgaW4gaGVhZGVyJyk7XHJcbiAgLy8vLyAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAvLy8vICAgICAgICB9XHJcbiAgLy8vLyAgICB9XHJcblxyXG4gIC8vLy8gICAgcmV0dXJuIHRydWU7XHJcbiAgLy8vLyB9XHJcblxyXG4gIC8vIEFjY2VzcyBUb2tlbiBWYWxpZGF0aW9uXHJcbiAgLy8gYWNjZXNzX3Rva2VuIEMxOiBIYXNoIHRoZSBvY3RldHMgb2YgdGhlIEFTQ0lJIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3NfdG9rZW4gd2l0aCB0aGUgaGFzaCBhbGdvcml0aG0gc3BlY2lmaWVkIGluIEpXQVtKV0FdXHJcbiAgLy8gZm9yIHRoZSBhbGcgSGVhZGVyIFBhcmFtZXRlciBvZiB0aGUgSUQgVG9rZW4ncyBKT1NFIEhlYWRlci4gRm9yIGluc3RhbmNlLCBpZiB0aGUgYWxnIGlzIFJTMjU2LCB0aGUgaGFzaCBhbGdvcml0aG0gdXNlZCBpcyBTSEEtMjU2LlxyXG4gIC8vIGFjY2Vzc190b2tlbiBDMjogVGFrZSB0aGUgbGVmdC0gbW9zdCBoYWxmIG9mIHRoZSBoYXNoIGFuZCBiYXNlNjR1cmwtIGVuY29kZSBpdC5cclxuICAvLyBhY2Nlc3NfdG9rZW4gQzM6IFRoZSB2YWx1ZSBvZiBhdF9oYXNoIGluIHRoZSBJRCBUb2tlbiBNVVNUIG1hdGNoIHRoZSB2YWx1ZSBwcm9kdWNlZCBpbiB0aGUgcHJldmlvdXMgc3RlcCBpZiBhdF9oYXNoXHJcbiAgLy8gaXMgcHJlc2VudCBpbiB0aGUgSUQgVG9rZW4uXHJcbiAgdmFsaWRhdGVJZFRva2VuQXRIYXNoKGFjY2Vzc1Rva2VuOiBzdHJpbmcsIGF0SGFzaDogc3RyaW5nLCBpZFRva2VuQWxnOiBzdHJpbmcsIGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyhjb25maWd1cmF0aW9uLCAnYXRfaGFzaCBmcm9tIHRoZSBzZXJ2ZXI6JyArIGF0SGFzaCk7XHJcblxyXG4gICAgLy8gJ3NoYTI1NicgJ3NoYTM4NCcgJ3NoYTUxMidcclxuICAgIGxldCBzaGEgPSAnU0hBLTI1Nic7XHJcblxyXG4gICAgaWYgKGlkVG9rZW5BbGcuaW5jbHVkZXMoJzM4NCcpKSB7XHJcbiAgICAgIHNoYSA9ICdTSEEtMzg0JztcclxuICAgIH0gZWxzZSBpZiAoaWRUb2tlbkFsZy5pbmNsdWRlcygnNTEyJykpIHtcclxuICAgICAgc2hhID0gJ1NIQS01MTInO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmp3dFdpbmRvd0NyeXB0b1NlcnZpY2UuZ2VuZXJhdGVBdEhhc2goJycgKyBhY2Nlc3NUb2tlbiwgc2hhKS5waXBlKFxyXG4gICAgICBtZXJnZU1hcCgoaGFzaDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZ3VyYXRpb24sICdhdF9oYXNoIGNsaWVudCB2YWxpZGF0aW9uIG5vdCBkZWNvZGVkOicgKyBoYXNoKTtcclxuICAgICAgICBpZiAoaGFzaCA9PT0gYXRIYXNoKSB7XHJcbiAgICAgICAgICByZXR1cm4gb2YodHJ1ZSk7IC8vIGlzVmFsaWQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLmp3dFdpbmRvd0NyeXB0b1NlcnZpY2UuZ2VuZXJhdGVBdEhhc2goJycgKyBkZWNvZGVVUklDb21wb25lbnQoYWNjZXNzVG9rZW4pLCBzaGEpLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcCgobmV3SGFzaDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNvbmZpZ3VyYXRpb24sICctZ2VuIGFjY2Vzcy0tJyArIGhhc2gpO1xyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gbmV3SGFzaCA9PT0gYXRIYXNoO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBtaWxsaXNUb01pbnV0ZXNBbmRTZWNvbmRzKG1pbGxpczogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKG1pbGxpcyAvIDYwMDAwKTtcclxuICAgIGNvbnN0IHNlY29uZHMgPSAoKG1pbGxpcyAlIDYwMDAwKSAvIDEwMDApLnRvRml4ZWQoMCk7XHJcblxyXG4gICAgcmV0dXJuIG1pbnV0ZXMgKyAnOicgKyAoK3NlY29uZHMgPCAxMCA/ICcwJyA6ICcnKSArIHNlY29uZHM7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhbGN1bGF0ZU5vd1dpdGhPZmZzZXQob2Zmc2V0U2Vjb25kczogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBuZXcgRGF0ZShuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKCkpLnZhbHVlT2YoKSArIG9mZnNldFNlY29uZHMgKiAxMDAwO1xyXG4gIH1cclxufVxyXG4iXX0=