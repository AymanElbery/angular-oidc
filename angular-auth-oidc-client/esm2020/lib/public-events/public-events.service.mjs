import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import * as i0 from "@angular/core";
export class PublicEventsService {
    constructor() {
        this.notify = new ReplaySubject(1);
    }
    /**
     * Fires a new event.
     *
     * @param type The event type.
     * @param value The event value.
     */
    fireEvent(type, value) {
        this.notify.next({ type, value });
    }
    /**
     * Wires up the event notification observable.
     */
    registerForEvents() {
        return this.notify.asObservable();
    }
}
PublicEventsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: PublicEventsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PublicEventsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: PublicEventsService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: PublicEventsService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWV2ZW50cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy9saWIvcHVibGljLWV2ZW50cy9wdWJsaWMtZXZlbnRzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsYUFBYSxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUtqRCxNQUFNLE9BQU8sbUJBQW1CO0lBRGhDO1FBRW1CLFdBQU0sR0FBRyxJQUFJLGFBQWEsQ0FBOEIsQ0FBQyxDQUFDLENBQUM7S0FrQjdFO0lBaEJDOzs7OztPQUtHO0lBQ0gsU0FBUyxDQUFJLElBQWdCLEVBQUUsS0FBUztRQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7T0FFRztJQUNILGlCQUFpQjtRQUNmLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNwQyxDQUFDOztnSEFsQlUsbUJBQW1CO29IQUFuQixtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFEL0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgUmVwbGF5U3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBFdmVudFR5cGVzIH0gZnJvbSAnLi9ldmVudC10eXBlcyc7XHJcbmltcG9ydCB7IE9pZGNDbGllbnROb3RpZmljYXRpb24gfSBmcm9tICcuL25vdGlmaWNhdGlvbic7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBQdWJsaWNFdmVudHNTZXJ2aWNlIHtcclxuICBwcml2YXRlIHJlYWRvbmx5IG5vdGlmeSA9IG5ldyBSZXBsYXlTdWJqZWN0PE9pZGNDbGllbnROb3RpZmljYXRpb248YW55Pj4oMSk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEZpcmVzIGEgbmV3IGV2ZW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHR5cGUgVGhlIGV2ZW50IHR5cGUuXHJcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBldmVudCB2YWx1ZS5cclxuICAgKi9cclxuICBmaXJlRXZlbnQ8VD4odHlwZTogRXZlbnRUeXBlcywgdmFsdWU/OiBUKTogdm9pZCB7XHJcbiAgICB0aGlzLm5vdGlmeS5uZXh0KHsgdHlwZSwgdmFsdWUgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBXaXJlcyB1cCB0aGUgZXZlbnQgbm90aWZpY2F0aW9uIG9ic2VydmFibGUuXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJGb3JFdmVudHMoKTogT2JzZXJ2YWJsZTxPaWRjQ2xpZW50Tm90aWZpY2F0aW9uPGFueT4+IHtcclxuICAgIHJldHVybiB0aGlzLm5vdGlmeS5hc09ic2VydmFibGUoKTtcclxuICB9XHJcbn1cclxuIl19