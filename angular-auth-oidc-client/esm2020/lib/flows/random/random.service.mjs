import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/crypto/crypto.service";
import * as i2 from "../../logging/logger.service";
export class RandomService {
    constructor(cryptoService, loggerService) {
        this.cryptoService = cryptoService;
        this.loggerService = loggerService;
    }
    createRandom(requiredLength, configuration) {
        if (requiredLength <= 0) {
            return '';
        }
        if (requiredLength > 0 && requiredLength < 7) {
            this.loggerService.logWarning(configuration, `RandomService called with ${requiredLength} but 7 chars is the minimum, returning 10 chars`);
            requiredLength = 10;
        }
        const length = requiredLength - 6;
        const arr = new Uint8Array(Math.floor(length / 2));
        const crypto = this.cryptoService.getCrypto();
        if (crypto) {
            crypto.getRandomValues(arr);
        }
        return Array.from(arr, this.toHex).join('') + this.randomString(7);
    }
    toHex(dec) {
        return ('0' + dec.toString(16)).substr(-2);
    }
    randomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = new Uint32Array(length);
        const crypto = this.cryptoService.getCrypto();
        if (crypto) {
            crypto.getRandomValues(values);
            for (let i = 0; i < length; i++) {
                result += characters[values[i] % characters.length];
            }
        }
        return result;
    }
}
RandomService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RandomService, deps: [{ token: i1.CryptoService }, { token: i2.LoggerService }], target: i0.ɵɵFactoryTarget.Injectable });
RandomService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RandomService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: RandomService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CryptoService }, { type: i2.LoggerService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZG9tLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9mbG93cy9yYW5kb20vcmFuZG9tLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQU0zQyxNQUFNLE9BQU8sYUFBYTtJQUN4QixZQUE2QixhQUE0QixFQUFtQixhQUE0QjtRQUEzRSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFtQixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUFHLENBQUM7SUFFNUcsWUFBWSxDQUFDLGNBQXNCLEVBQUUsYUFBa0M7UUFDckUsSUFBSSxjQUFjLElBQUksQ0FBQyxFQUFFO1lBQ3ZCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxJQUFJLGNBQWMsR0FBRyxDQUFDLElBQUksY0FBYyxHQUFHLENBQUMsRUFBRTtZQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FDM0IsYUFBYSxFQUNiLDZCQUE2QixjQUFjLGlEQUFpRCxDQUM3RixDQUFDO1lBQ0YsY0FBYyxHQUFHLEVBQUUsQ0FBQztTQUNyQjtRQUVELE1BQU0sTUFBTSxHQUFHLGNBQWMsR0FBRyxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRTlDLElBQUksTUFBTSxFQUFFO1lBQ1YsTUFBTSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM3QjtRQUVELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFTyxLQUFLLENBQUMsR0FBRztRQUNmLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTyxZQUFZLENBQUMsTUFBYztRQUNqQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsTUFBTSxVQUFVLEdBQUcsZ0VBQWdFLENBQUM7UUFFcEYsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUU5QyxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDL0IsTUFBTSxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3JEO1NBQ0Y7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOzswR0E5Q1UsYUFBYTs4R0FBYixhQUFhOzJGQUFiLGFBQWE7a0JBRHpCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ3J5cHRvU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2NyeXB0by9jcnlwdG8uc2VydmljZSc7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLy4uLy4uL2NvbmZpZy9vcGVuaWQtY29uZmlndXJhdGlvbic7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBSYW5kb21TZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNyeXB0b1NlcnZpY2U6IENyeXB0b1NlcnZpY2UsIHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSkge31cclxuXHJcbiAgY3JlYXRlUmFuZG9tKHJlcXVpcmVkTGVuZ3RoOiBudW1iZXIsIGNvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBzdHJpbmcge1xyXG4gICAgaWYgKHJlcXVpcmVkTGVuZ3RoIDw9IDApIHtcclxuICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZXF1aXJlZExlbmd0aCA+IDAgJiYgcmVxdWlyZWRMZW5ndGggPCA3KSB7XHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKFxyXG4gICAgICAgIGNvbmZpZ3VyYXRpb24sXHJcbiAgICAgICAgYFJhbmRvbVNlcnZpY2UgY2FsbGVkIHdpdGggJHtyZXF1aXJlZExlbmd0aH0gYnV0IDcgY2hhcnMgaXMgdGhlIG1pbmltdW0sIHJldHVybmluZyAxMCBjaGFyc2BcclxuICAgICAgKTtcclxuICAgICAgcmVxdWlyZWRMZW5ndGggPSAxMDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsZW5ndGggPSByZXF1aXJlZExlbmd0aCAtIDY7XHJcbiAgICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheShNYXRoLmZsb29yKGxlbmd0aCAvIDIpKTtcclxuICAgIGNvbnN0IGNyeXB0byA9IHRoaXMuY3J5cHRvU2VydmljZS5nZXRDcnlwdG8oKTtcclxuXHJcbiAgICBpZiAoY3J5cHRvKSB7XHJcbiAgICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYXJyKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhcnIsIHRoaXMudG9IZXgpLmpvaW4oJycpICsgdGhpcy5yYW5kb21TdHJpbmcoNyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvSGV4KGRlYyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gKCcwJyArIGRlYy50b1N0cmluZygxNikpLnN1YnN0cigtMik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJhbmRvbVN0cmluZyhsZW5ndGg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICBjb25zdCBjaGFyYWN0ZXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5JztcclxuXHJcbiAgICBjb25zdCB2YWx1ZXMgPSBuZXcgVWludDMyQXJyYXkobGVuZ3RoKTtcclxuICAgIGNvbnN0IGNyeXB0byA9IHRoaXMuY3J5cHRvU2VydmljZS5nZXRDcnlwdG8oKTtcclxuXHJcbiAgICBpZiAoY3J5cHRvKSB7XHJcbiAgICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXModmFsdWVzKTtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHJlc3VsdCArPSBjaGFyYWN0ZXJzW3ZhbHVlc1tpXSAlIGNoYXJhY3RlcnMubGVuZ3RoXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbiJdfQ==