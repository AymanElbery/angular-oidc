import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../utils/crypto/crypto.service";
export class JwtWindowCryptoService {
    constructor(cryptoService) {
        this.cryptoService = cryptoService;
    }
    generateCodeChallenge(codeVerifier) {
        return this.calcHash(codeVerifier).pipe(map((challengeRaw) => this.base64UrlEncode(challengeRaw)));
    }
    generateAtHash(accessToken, algorithm) {
        return this.calcHash(accessToken, algorithm).pipe(map((tokenHash) => {
            let substr = tokenHash.substr(0, tokenHash.length / 2);
            const tokenHashBase64 = btoa(substr);
            return tokenHashBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        }));
    }
    calcHash(valueToHash, algorithm = 'SHA-256') {
        const msgBuffer = new TextEncoder().encode(valueToHash);
        return from(this.cryptoService.getCrypto().subtle.digest(algorithm, msgBuffer)).pipe(map((hashBuffer) => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return this.toHashString(hashArray);
        }));
    }
    toHashString(byteArray) {
        let result = '';
        for (let e of byteArray) {
            result += String.fromCharCode(e);
        }
        return result;
    }
    base64UrlEncode(str) {
        const base64 = btoa(str);
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
}
JwtWindowCryptoService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: JwtWindowCryptoService, deps: [{ token: i1.CryptoService }], target: i0.ɵɵFactoryTarget.Injectable });
JwtWindowCryptoService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: JwtWindowCryptoService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: JwtWindowCryptoService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CryptoService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LXdpbmRvdy1jcnlwdG8uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL3ZhbGlkYXRpb24vand0LXdpbmRvdy1jcnlwdG8uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxJQUFJLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDeEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7QUFJckMsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQyxZQUE2QixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUFHLENBQUM7SUFFN0QscUJBQXFCLENBQUMsWUFBb0I7UUFDeEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFvQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RyxDQUFDO0lBRUQsY0FBYyxDQUFDLFdBQW1CLEVBQUUsU0FBaUI7UUFDbkQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQy9DLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ2hCLElBQUksTUFBTSxHQUFXLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDL0QsTUFBTSxlQUFlLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTdDLE9BQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ25GLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBRU8sUUFBUSxDQUFDLFdBQW1CLEVBQUUsU0FBUyxHQUFHLFNBQVM7UUFDekQsTUFBTSxTQUFTLEdBQWUsSUFBSSxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFcEUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDbEYsR0FBRyxDQUFDLENBQUMsVUFBdUIsRUFBRSxFQUFFO1lBQzlCLE1BQU0sU0FBUyxHQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUVuRSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFTyxZQUFZLENBQUMsU0FBbUI7UUFDdEMsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWhCLEtBQUssSUFBSSxDQUFDLElBQUksU0FBUyxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVPLGVBQWUsQ0FBQyxHQUFHO1FBQ3pCLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxRSxDQUFDOzttSEE1Q1Usc0JBQXNCO3VIQUF0QixzQkFBc0I7MkZBQXRCLHNCQUFzQjtrQkFEbEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZnJvbSwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IENyeXB0b1NlcnZpY2UgfSBmcm9tICcuLi91dGlscy9jcnlwdG8vY3J5cHRvLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgSnd0V2luZG93Q3J5cHRvU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjcnlwdG9TZXJ2aWNlOiBDcnlwdG9TZXJ2aWNlKSB7fVxyXG5cclxuICBnZW5lcmF0ZUNvZGVDaGFsbGVuZ2UoY29kZVZlcmlmaWVyOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FsY0hhc2goY29kZVZlcmlmaWVyKS5waXBlKG1hcCgoY2hhbGxlbmdlUmF3OiBzdHJpbmcpID0+IHRoaXMuYmFzZTY0VXJsRW5jb2RlKGNoYWxsZW5nZVJhdykpKTtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlQXRIYXNoKGFjY2Vzc1Rva2VuOiBzdHJpbmcsIGFsZ29yaXRobTogc3RyaW5nKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcclxuICAgIHJldHVybiB0aGlzLmNhbGNIYXNoKGFjY2Vzc1Rva2VuLCBhbGdvcml0aG0pLnBpcGUoXHJcbiAgICAgIG1hcCgodG9rZW5IYXNoKSA9PiB7XHJcbiAgICAgICAgbGV0IHN1YnN0cjogc3RyaW5nID0gdG9rZW5IYXNoLnN1YnN0cigwLCB0b2tlbkhhc2gubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgY29uc3QgdG9rZW5IYXNoQmFzZTY0OiBzdHJpbmcgPSBidG9hKHN1YnN0cik7XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbkhhc2hCYXNlNjQucmVwbGFjZSgvXFwrL2csICctJykucmVwbGFjZSgvXFwvL2csICdfJykucmVwbGFjZSgvPS9nLCAnJyk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWxjSGFzaCh2YWx1ZVRvSGFzaDogc3RyaW5nLCBhbGdvcml0aG0gPSAnU0hBLTI1NicpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xyXG4gICAgY29uc3QgbXNnQnVmZmVyOiBVaW50OEFycmF5ID0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKHZhbHVlVG9IYXNoKTtcclxuXHJcbiAgICByZXR1cm4gZnJvbSh0aGlzLmNyeXB0b1NlcnZpY2UuZ2V0Q3J5cHRvKCkuc3VidGxlLmRpZ2VzdChhbGdvcml0aG0sIG1zZ0J1ZmZlcikpLnBpcGUoXHJcbiAgICAgIG1hcCgoaGFzaEJ1ZmZlcjogQXJyYXlCdWZmZXIpID0+IHtcclxuICAgICAgICBjb25zdCBoYXNoQXJyYXk6IG51bWJlcltdID0gQXJyYXkuZnJvbShuZXcgVWludDhBcnJheShoYXNoQnVmZmVyKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnRvSGFzaFN0cmluZyhoYXNoQXJyYXkpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdG9IYXNoU3RyaW5nKGJ5dGVBcnJheTogbnVtYmVyW10pOiBzdHJpbmcge1xyXG4gICAgbGV0IHJlc3VsdCA9ICcnO1xyXG5cclxuICAgIGZvciAobGV0IGUgb2YgYnl0ZUFycmF5KSB7XHJcbiAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGJhc2U2NFVybEVuY29kZShzdHIpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgYmFzZTY0OiBzdHJpbmcgPSBidG9hKHN0cik7XHJcblxyXG4gICAgcmV0dXJuIGJhc2U2NC5yZXBsYWNlKC9cXCsvZywgJy0nKS5yZXBsYWNlKC9cXC8vZywgJ18nKS5yZXBsYWNlKC89L2csICcnKTtcclxuICB9XHJcbn1cclxuIl19