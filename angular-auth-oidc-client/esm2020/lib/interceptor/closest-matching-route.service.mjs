import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class ClosestMatchingRouteService {
    getConfigIdForClosestMatchingRoute(route, configurations) {
        for (const config of configurations) {
            const { secureRoutes } = config;
            for (const configuredRoute of secureRoutes) {
                if (route.startsWith(configuredRoute)) {
                    return {
                        matchingRoute: configuredRoute,
                        matchingConfig: config,
                    };
                }
            }
        }
        return {
            matchingRoute: null,
            matchingConfig: null,
        };
    }
}
ClosestMatchingRouteService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ClosestMatchingRouteService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ClosestMatchingRouteService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ClosestMatchingRouteService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ClosestMatchingRouteService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvc2VzdC1tYXRjaGluZy1yb3V0ZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy9saWIvaW50ZXJjZXB0b3IvY2xvc2VzdC1tYXRjaGluZy1yb3V0ZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBSTNDLE1BQU0sT0FBTywyQkFBMkI7SUFDdEMsa0NBQWtDLENBQUMsS0FBYSxFQUFFLGNBQXFDO1FBQ3JGLEtBQUssTUFBTSxNQUFNLElBQUksY0FBYyxFQUFFO1lBQ25DLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxNQUFNLENBQUM7WUFFaEMsS0FBSyxNQUFNLGVBQWUsSUFBSSxZQUFZLEVBQUU7Z0JBQzFDLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsRUFBRTtvQkFDckMsT0FBTzt3QkFDTCxhQUFhLEVBQUUsZUFBZTt3QkFDOUIsY0FBYyxFQUFFLE1BQU07cUJBQ3ZCLENBQUM7aUJBQ0g7YUFDRjtTQUNGO1FBRUQsT0FBTztZQUNMLGFBQWEsRUFBRSxJQUFJO1lBQ25CLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUM7SUFDSixDQUFDOzt3SEFuQlUsMkJBQTJCOzRIQUEzQiwyQkFBMkI7MkZBQTNCLDJCQUEyQjtrQkFEdkMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9jb25maWcvb3BlbmlkLWNvbmZpZ3VyYXRpb24nO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2xvc2VzdE1hdGNoaW5nUm91dGVTZXJ2aWNlIHtcbiAgZ2V0Q29uZmlnSWRGb3JDbG9zZXN0TWF0Y2hpbmdSb3V0ZShyb3V0ZTogc3RyaW5nLCBjb25maWd1cmF0aW9uczogT3BlbklkQ29uZmlndXJhdGlvbltdKTogQ2xvc2VzdE1hdGNoaW5nUm91dGVSZXN1bHQge1xuICAgIGZvciAoY29uc3QgY29uZmlnIG9mIGNvbmZpZ3VyYXRpb25zKSB7XG4gICAgICBjb25zdCB7IHNlY3VyZVJvdXRlcyB9ID0gY29uZmlnO1xuXG4gICAgICBmb3IgKGNvbnN0IGNvbmZpZ3VyZWRSb3V0ZSBvZiBzZWN1cmVSb3V0ZXMpIHtcbiAgICAgICAgaWYgKHJvdXRlLnN0YXJ0c1dpdGgoY29uZmlndXJlZFJvdXRlKSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBtYXRjaGluZ1JvdXRlOiBjb25maWd1cmVkUm91dGUsXG4gICAgICAgICAgICBtYXRjaGluZ0NvbmZpZzogY29uZmlnLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbWF0Y2hpbmdSb3V0ZTogbnVsbCxcbiAgICAgIG1hdGNoaW5nQ29uZmlnOiBudWxsLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbG9zZXN0TWF0Y2hpbmdSb3V0ZVJlc3VsdCB7XG4gIG1hdGNoaW5nUm91dGU6IHN0cmluZztcbiAgbWF0Y2hpbmdDb25maWc6IE9wZW5JZENvbmZpZ3VyYXRpb247XG59XG4iXX0=