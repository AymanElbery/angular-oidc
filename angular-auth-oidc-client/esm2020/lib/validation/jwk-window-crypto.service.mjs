import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../utils/crypto/crypto.service";
export class JwkWindowCryptoService {
    constructor(cryptoService) {
        this.cryptoService = cryptoService;
    }
    importVerificationKey(key, algorithm) {
        return this.cryptoService.getCrypto().subtle.importKey('jwk', key, algorithm, false, ['verify']);
    }
    verifyKey(verifyAlgorithm, cryptoKey, signature, signingInput) {
        return this.cryptoService.getCrypto().subtle.verify(verifyAlgorithm, cryptoKey, signature, new TextEncoder().encode(signingInput));
    }
}
JwkWindowCryptoService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: JwkWindowCryptoService, deps: [{ token: i1.CryptoService }], target: i0.ɵɵFactoryTarget.Injectable });
JwkWindowCryptoService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: JwkWindowCryptoService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: JwkWindowCryptoService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CryptoService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiandrLXdpbmRvdy1jcnlwdG8uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL3ZhbGlkYXRpb24vandrLXdpbmRvdy1jcnlwdG8uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFJM0MsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQyxZQUE2QixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUFHLENBQUM7SUFFN0QscUJBQXFCLENBQ25CLEdBQWUsRUFDZixTQUErRztRQUUvRyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ25HLENBQUM7SUFFRCxTQUFTLENBQ1AsZUFBaUUsRUFDakUsU0FBb0IsRUFDcEIsU0FBdUIsRUFDdkIsWUFBb0I7UUFFcEIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUNySSxDQUFDOzttSEFqQlUsc0JBQXNCO3VIQUF0QixzQkFBc0I7MkZBQXRCLHNCQUFzQjtrQkFEbEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ3J5cHRvU2VydmljZSB9IGZyb20gJy4uL3V0aWxzL2NyeXB0by9jcnlwdG8uc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBKd2tXaW5kb3dDcnlwdG9TZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNyeXB0b1NlcnZpY2U6IENyeXB0b1NlcnZpY2UpIHt9XHJcblxyXG4gIGltcG9ydFZlcmlmaWNhdGlvbktleShcclxuICAgIGtleTogSnNvbldlYktleSxcclxuICAgIGFsZ29yaXRobTogQWxnb3JpdGhtSWRlbnRpZmllciB8IFJzYUhhc2hlZEltcG9ydFBhcmFtcyB8IEVjS2V5SW1wb3J0UGFyYW1zIHwgSG1hY0ltcG9ydFBhcmFtcyB8IEFlc0tleUFsZ29yaXRobVxyXG4gICk6IFByb21pc2U8Q3J5cHRvS2V5PiB7XHJcbiAgICByZXR1cm4gdGhpcy5jcnlwdG9TZXJ2aWNlLmdldENyeXB0bygpLnN1YnRsZS5pbXBvcnRLZXkoJ2p3aycsIGtleSwgYWxnb3JpdGhtLCBmYWxzZSwgWyd2ZXJpZnknXSk7XHJcbiAgfVxyXG5cclxuICB2ZXJpZnlLZXkoXHJcbiAgICB2ZXJpZnlBbGdvcml0aG06IEFsZ29yaXRobUlkZW50aWZpZXIgfCBSc2FQc3NQYXJhbXMgfCBFY2RzYVBhcmFtcyxcclxuICAgIGNyeXB0b0tleTogQ3J5cHRvS2V5LFxyXG4gICAgc2lnbmF0dXJlOiBCdWZmZXJTb3VyY2UsXHJcbiAgICBzaWduaW5nSW5wdXQ6IHN0cmluZ1xyXG4gICk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY3J5cHRvU2VydmljZS5nZXRDcnlwdG8oKS5zdWJ0bGUudmVyaWZ5KHZlcmlmeUFsZ29yaXRobSwgY3J5cHRvS2V5LCBzaWduYXR1cmUsIG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShzaWduaW5nSW5wdXQpKTtcclxuICB9XHJcbn1cclxuIl19