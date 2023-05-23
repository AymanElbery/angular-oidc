import * as i0 from "@angular/core";
export declare class CurrentUrlService {
    private readonly document;
    constructor(document: Document);
    getStateParamFromCurrentUrl(url?: string): string;
    getCurrentUrl(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<CurrentUrlService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CurrentUrlService>;
}
