import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class JwkExtractor {
    static buildErrorName(name) {
        return JwkExtractor.name + ': ' + name;
    }
    extractJwk(keys, spec, throwOnEmpty = true) {
        if (0 === keys.length) {
            throw JwkExtractor.InvalidArgumentError;
        }
        let foundKeys = keys
            .filter((k) => spec?.kid ? k['kid'] === spec.kid : true)
            .filter((k) => spec?.use ? k['use'] === spec.use : true)
            .filter((k) => spec?.kty ? k['kty'] === spec.kty : true);
        if (foundKeys.length === 0 && throwOnEmpty) {
            throw JwkExtractor.NoMatchingKeysError;
        }
        if (foundKeys.length > 1 && (null === spec || undefined === spec)) {
            throw JwkExtractor.SeveralMatchingKeysError;
        }
        return foundKeys;
    }
}
JwkExtractor.InvalidArgumentError = {
    name: JwkExtractor.buildErrorName('InvalidArgumentError'),
    message: 'Array of keys was empty. Unable to extract'
};
JwkExtractor.NoMatchingKeysError = {
    name: JwkExtractor.buildErrorName('NoMatchingKeysError'),
    message: 'No key found matching the spec'
};
JwkExtractor.SeveralMatchingKeysError = {
    name: JwkExtractor.buildErrorName('SeveralMatchingKeysError'),
    message: 'More than one key found. Please use spec to filter'
};
JwkExtractor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: JwkExtractor, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
JwkExtractor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: JwkExtractor });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: JwkExtractor, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiandrLmV4dHJhY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL2V4dHJhY3RvcnMvandrLmV4dHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUczQyxNQUFNLE9BQU8sWUFBWTtJQWdCZixNQUFNLENBQUMsY0FBYyxDQUFDLElBQVk7UUFDeEMsT0FBTyxZQUFZLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7SUFDekMsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFrQixFQUFFLElBQWlELEVBQUUsWUFBWSxHQUFHLElBQUk7UUFDbkcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNyQixNQUFNLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQztTQUN6QztRQUVELElBQUksU0FBUyxHQUFHLElBQUk7YUFDakIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2FBQ3ZELE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUN2RCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFlBQVksRUFBRTtZQUMxQyxNQUFNLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQztTQUN4QztRQUVELElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLFNBQVMsS0FBSyxJQUFJLENBQUMsRUFBRTtZQUNqRSxNQUFNLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQztTQUM3QztRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7O0FBdENNLGlDQUFvQixHQUFHO0lBQzVCLElBQUksRUFBRSxZQUFZLENBQUMsY0FBYyxDQUFDLHNCQUFzQixDQUFDO0lBQ3pELE9BQU8sRUFBRSw0Q0FBNEM7Q0FDdEQsQ0FBQztBQUVLLGdDQUFtQixHQUFHO0lBQzNCLElBQUksRUFBRSxZQUFZLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDO0lBQ3hELE9BQU8sRUFBRSxnQ0FBZ0M7Q0FDMUMsQ0FBQztBQUVLLHFDQUF3QixHQUFHO0lBQ2hDLElBQUksRUFBRSxZQUFZLENBQUMsY0FBYyxDQUFDLDBCQUEwQixDQUFDO0lBQzdELE9BQU8sRUFBRSxvREFBb0Q7Q0FDOUQsQ0FBQzt5R0FkUyxZQUFZOzZHQUFaLFlBQVk7MkZBQVosWUFBWTtrQkFEeEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEp3a0V4dHJhY3RvciB7XHJcbiAgc3RhdGljIEludmFsaWRBcmd1bWVudEVycm9yID0ge1xyXG4gICAgbmFtZTogSndrRXh0cmFjdG9yLmJ1aWxkRXJyb3JOYW1lKCdJbnZhbGlkQXJndW1lbnRFcnJvcicpLFxyXG4gICAgbWVzc2FnZTogJ0FycmF5IG9mIGtleXMgd2FzIGVtcHR5LiBVbmFibGUgdG8gZXh0cmFjdCdcclxuICB9O1xyXG5cclxuICBzdGF0aWMgTm9NYXRjaGluZ0tleXNFcnJvciA9IHtcclxuICAgIG5hbWU6IEp3a0V4dHJhY3Rvci5idWlsZEVycm9yTmFtZSgnTm9NYXRjaGluZ0tleXNFcnJvcicpLFxyXG4gICAgbWVzc2FnZTogJ05vIGtleSBmb3VuZCBtYXRjaGluZyB0aGUgc3BlYydcclxuICB9O1xyXG5cclxuICBzdGF0aWMgU2V2ZXJhbE1hdGNoaW5nS2V5c0Vycm9yID0ge1xyXG4gICAgbmFtZTogSndrRXh0cmFjdG9yLmJ1aWxkRXJyb3JOYW1lKCdTZXZlcmFsTWF0Y2hpbmdLZXlzRXJyb3InKSxcclxuICAgIG1lc3NhZ2U6ICdNb3JlIHRoYW4gb25lIGtleSBmb3VuZC4gUGxlYXNlIHVzZSBzcGVjIHRvIGZpbHRlcidcclxuICB9O1xyXG5cclxuICBwcml2YXRlIHN0YXRpYyBidWlsZEVycm9yTmFtZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIEp3a0V4dHJhY3Rvci5uYW1lICsgJzogJyArIG5hbWU7XHJcbiAgfVxyXG5cclxuICBleHRyYWN0SndrKGtleXM6IEpzb25XZWJLZXlbXSwgc3BlYz86IHtraWQ/OiBzdHJpbmcsIHVzZT86IHN0cmluZywga3R5Pzogc3RyaW5nfSwgdGhyb3dPbkVtcHR5ID0gdHJ1ZSk6IEpzb25XZWJLZXlbXSB7XHJcbiAgICBpZiAoMCA9PT0ga2V5cy5sZW5ndGgpIHtcclxuICAgICAgdGhyb3cgSndrRXh0cmFjdG9yLkludmFsaWRBcmd1bWVudEVycm9yO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBmb3VuZEtleXMgPSBrZXlzXHJcbiAgICAgIC5maWx0ZXIoKGspID0+IHNwZWM/LmtpZCA/IGtbJ2tpZCddID09PSBzcGVjLmtpZCA6IHRydWUpXHJcbiAgICAgIC5maWx0ZXIoKGspID0+IHNwZWM/LnVzZSA/IGtbJ3VzZSddID09PSBzcGVjLnVzZSA6IHRydWUpXHJcbiAgICAgIC5maWx0ZXIoKGspID0+IHNwZWM/Lmt0eSA/IGtbJ2t0eSddID09PSBzcGVjLmt0eSA6IHRydWUpO1xyXG5cclxuICAgIGlmIChmb3VuZEtleXMubGVuZ3RoID09PSAwICYmIHRocm93T25FbXB0eSkge1xyXG4gICAgICB0aHJvdyBKd2tFeHRyYWN0b3IuTm9NYXRjaGluZ0tleXNFcnJvcjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm91bmRLZXlzLmxlbmd0aCA+IDEgJiYgKG51bGwgPT09IHNwZWMgfHwgdW5kZWZpbmVkID09PSBzcGVjKSkge1xyXG4gICAgICB0aHJvdyBKd2tFeHRyYWN0b3IuU2V2ZXJhbE1hdGNoaW5nS2V5c0Vycm9yO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmb3VuZEtleXM7XHJcbiAgfVxyXG59XHJcbiJdfQ==