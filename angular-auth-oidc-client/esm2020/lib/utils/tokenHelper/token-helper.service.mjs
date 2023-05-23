import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../logging/logger.service";
const PARTS_OF_TOKEN = 3;
export class TokenHelperService {
    constructor(loggerService, document) {
        this.loggerService = loggerService;
        this.document = document;
    }
    getTokenExpirationDate(dataIdToken) {
        if (!Object.prototype.hasOwnProperty.call(dataIdToken, 'exp')) {
            return new Date(new Date().toUTCString());
        }
        const date = new Date(0); // The 0 here is the key, which sets the date to the epoch
        date.setUTCSeconds(dataIdToken.exp);
        return date;
    }
    getSigningInputFromToken(token, encoded, configuration) {
        if (!this.tokenIsValid(token, configuration)) {
            return '';
        }
        const header = this.getHeaderFromToken(token, encoded, configuration);
        const payload = this.getPayloadFromToken(token, encoded, configuration);
        return [header, payload].join('.');
    }
    getHeaderFromToken(token, encoded, configuration) {
        if (!this.tokenIsValid(token, configuration)) {
            return {};
        }
        return this.getPartOfToken(token, 0, encoded);
    }
    getPayloadFromToken(token, encoded, configuration) {
        if (!this.tokenIsValid(token, configuration)) {
            return {};
        }
        return this.getPartOfToken(token, 1, encoded);
    }
    getSignatureFromToken(token, encoded, configuration) {
        if (!this.tokenIsValid(token, configuration)) {
            return {};
        }
        return this.getPartOfToken(token, 2, encoded);
    }
    getPartOfToken(token, index, encoded) {
        const partOfToken = this.extractPartOfToken(token, index);
        if (encoded) {
            return partOfToken;
        }
        const result = this.urlBase64Decode(partOfToken);
        return JSON.parse(result);
    }
    urlBase64Decode(str) {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw Error('Illegal base64url string!');
        }
        const decoded = typeof this.document.defaultView !== 'undefined'
            ? this.document.defaultView.atob(output)
            : Buffer.from(output, 'base64').toString('binary');
        try {
            // Going backwards: from byte stream, to percent-encoding, to original string.
            return decodeURIComponent(decoded
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join(''));
        }
        catch (err) {
            return decoded;
        }
    }
    tokenIsValid(token, configuration) {
        if (!token) {
            this.loggerService.logError(configuration, `token '${token}' is not valid --> token falsy`);
            return false;
        }
        if (!token.includes('.')) {
            this.loggerService.logError(configuration, `token '${token}' is not valid --> no dots included`);
            return false;
        }
        const parts = token.split('.');
        if (parts.length !== PARTS_OF_TOKEN) {
            this.loggerService.logError(configuration, `token '${token}' is not valid --> token has to have exactly ${PARTS_OF_TOKEN - 1} dots`);
            return false;
        }
        return true;
    }
    extractPartOfToken(token, index) {
        return token.split('.')[index];
    }
}
TokenHelperService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: TokenHelperService, deps: [{ token: i1.LoggerService }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
TokenHelperService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: TokenHelperService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: TokenHelperService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LoggerService }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4taGVscGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi91dGlscy90b2tlbkhlbHBlci90b2tlbi1oZWxwZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUluRCxNQUFNLGNBQWMsR0FBRyxDQUFDLENBQUM7QUFHekIsTUFBTSxPQUFPLGtCQUFrQjtJQUM3QixZQUE2QixhQUE0QixFQUFxQyxRQUFrQjtRQUFuRixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFxQyxhQUFRLEdBQVIsUUFBUSxDQUFVO0lBQUcsQ0FBQztJQUVwSCxzQkFBc0IsQ0FBQyxXQUFnQjtRQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUM3RCxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUMzQztRQUVELE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsMERBQTBEO1FBRXBGLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXBDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHdCQUF3QixDQUFDLEtBQVUsRUFBRSxPQUFnQixFQUFFLGFBQWtDO1FBQ3ZGLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsRUFBRTtZQUM1QyxPQUFPLEVBQUUsQ0FBQztTQUNYO1FBRUQs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QjsyRkFBbEIsa0JBQWtCO2tCQUQ5QixVQUFVOzswQkFFbUQsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuXHJcbmNvbnN0IFBBUlRTX09GX1RPS0VOID0gMztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRva2VuSGVscGVyU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLCBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIHJlYWRvbmx5IGRvY3VtZW50OiBEb2N1bWVudCkge31cclxuXHJcbiAgZ2V0VG9rZW5FeHBpcmF0aW9uRGF0ZShkYXRhSWRUb2tlbjogYW55KTogRGF0ZSB7XHJcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkYXRhSWRUb2tlbiwgJ2V4cCcpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZShuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgwKTsgLy8gVGhlIDAgaGVyZSBpcyB0aGUga2V5LCB3aGljaCBzZXRzIHRoZSBkYXRlIHRvIHRoZSBlcG9jaFxyXG5cclxuICAgIGRhdGUuc2V0VVRDU2Vjb25kcyhkYXRhSWRUb2tlbi5leHApO1xyXG5cclxuICAgIHJldHVybiBkYXRlO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2lnbmluZ0lucHV0RnJvbVRva2VuKHRva2VuOiBhbnksIGVuY29kZWQ6IGJvb2xlYW4sIGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBzdHJpbmcge1xyXG4gICAgaWYgKCF0aGlzLnRva2VuSXNWYWxpZCh0b2tlbiwgY29uZmlndXJhdGlvbikpIHtcclxuICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGhlYWRlcjogc3RyaW5nID0gdGhpcy5nZXRIZWFkZXJGcm9tVG9rZW4odG9rZW4sIGVuY29kZWQsIGNvbmZpZ3VyYXRpb24pO1xyXG4gICAgY29uc3QgcGF5bG9hZDogc3RyaW5nID0gdGhpcy5nZXRQYXlsb2FkRnJvbVRva2VuKHRva2VuLCBlbmNvZGVkLCBjb25maWd1cmF0aW9uKTtcclxuXHJcbiAgICByZXR1cm4gW2hlYWRlciwgcGF5bG9hZF0uam9pbignLicpO1xyXG4gIH1cclxuXHJcbiAgZ2V0SGVhZGVyRnJvbVRva2VuKHRva2VuOiBhbnksIGVuY29kZWQ6IGJvb2xlYW4sIGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBhbnkge1xyXG4gICAgaWYgKCF0aGlzLnRva2VuSXNWYWxpZCh0b2tlbiwgY29uZmlndXJhdGlvbikpIHtcclxuICAgICAgcmV0dXJuIHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmdldFBhcnRPZlRva2VuKHRva2VuLCAwLCBlbmNvZGVkKTtcclxuICB9XHJcblxyXG4gIGdldFBheWxvYWRGcm9tVG9rZW4odG9rZW46IGFueSwgZW5jb2RlZDogYm9vbGVhbiwgY29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbik6IGFueSB7XHJcbiAgICBpZiAoIXRoaXMudG9rZW5Jc1ZhbGlkKHRva2VuLCBjb25maWd1cmF0aW9uKSkge1xyXG4gICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFydE9mVG9rZW4odG9rZW4sIDEsIGVuY29kZWQpO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2lnbmF0dXJlRnJvbVRva2VuKHRva2VuOiBhbnksIGVuY29kZWQ6IGJvb2xlYW4sIGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBhbnkge1xyXG4gICAgaWYgKCF0aGlzLnRva2VuSXNWYWxpZCh0b2tlbiwgY29uZmlndXJhdGlvbikpIHtcclxuICAgICAgcmV0dXJuIHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmdldFBhcnRPZlRva2VuKHRva2VuLCAyLCBlbmNvZGVkKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UGFydE9mVG9rZW4odG9rZW46IHN0cmluZywgaW5kZXg6IG51bWJlciwgZW5jb2RlZDogYm9vbGVhbik6IGFueSB7XHJcbiAgICBjb25zdCBwYXJ0T2ZUb2tlbiA9IHRoaXMuZXh0cmFjdFBhcnRPZlRva2VuKHRva2VuLCBpbmRleCk7XHJcblxyXG4gICAgaWYgKGVuY29kZWQpIHtcclxuICAgICAgcmV0dXJuIHBhcnRPZlRva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudXJsQmFzZTY0RGVjb2RlKHBhcnRPZlRva2VuKTtcclxuXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cmxCYXNlNjREZWNvZGUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgbGV0IG91dHB1dCA9IHN0ci5yZXBsYWNlKC8tL2csICcrJykucmVwbGFjZSgvXy9nLCAnLycpO1xyXG5cclxuICAgIHN3aXRjaCAob3V0cHV0Lmxlbmd0aCAlIDQpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgb3V0cHV0ICs9ICc9PSc7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMzpcclxuICAgICAgICBvdXRwdXQgKz0gJz0nO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHRocm93IEVycm9yKCdJbGxlZ2FsIGJhc2U2NHVybCBzdHJpbmchJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGVjb2RlZCA9XHJcbiAgICAgIHR5cGVvZiB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3ICE9PSAndW5kZWZpbmVkJ1xyXG4gICAgICAgID8gdGhpcy5kb2N1bWVudC5kZWZhdWx0Vmlldy5hdG9iKG91dHB1dClcclxuICAgICAgICA6IEJ1ZmZlci5mcm9tKG91dHB1dCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCdiaW5hcnknKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBHb2luZyBiYWNrd2FyZHM6IGZyb20gYnl0ZSBzdHJlYW0sIHRvIHBlcmNlbnQtZW5jb2RpbmcsIHRvIG9yaWdpbmFsIHN0cmluZy5cclxuICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChcclxuICAgICAgICBkZWNvZGVkXHJcbiAgICAgICAgICAuc3BsaXQoJycpXHJcbiAgICAgICAgICAubWFwKChjOiBzdHJpbmcpID0+ICclJyArICgnMDAnICsgYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpKVxyXG4gICAgICAgICAgLmpvaW4oJycpXHJcbiAgICAgICk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIGRlY29kZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRva2VuSXNWYWxpZCh0b2tlbjogc3RyaW5nLCBjb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXRva2VuKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWd1cmF0aW9uLCBgdG9rZW4gJyR7dG9rZW59JyBpcyBub3QgdmFsaWQgLS0+IHRva2VuIGZhbHN5YCk7XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCEodG9rZW4gYXMgc3RyaW5nKS5pbmNsdWRlcygnLicpKSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihjb25maWd1cmF0aW9uLCBgdG9rZW4gJyR7dG9rZW59JyBpcyBub3QgdmFsaWQgLS0+IG5vIGRvdHMgaW5jbHVkZWRgKTtcclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwYXJ0cyA9IHRva2VuLnNwbGl0KCcuJyk7XHJcblxyXG4gICAgaWYgKHBhcnRzLmxlbmd0aCAhPT0gUEFSVFNfT0ZfVE9LRU4pIHtcclxuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGNvbmZpZ3VyYXRpb24sIGB0b2tlbiAnJHt0b2tlbn0nIGlzIG5vdCB2YWxpZCAtLT4gdG9rZW4gaGFzIHRvIGhhdmUgZXhhY3RseSAke1BBUlRTX09GX1RPS0VOIC0gMX0gZG90c2ApO1xyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBleHRyYWN0UGFydE9mVG9rZW4odG9rZW46IHN0cmluZywgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdG9rZW4uc3BsaXQoJy4nKVtpbmRleF07XHJcbiAgfVxyXG59XHJcbiJdfQ==