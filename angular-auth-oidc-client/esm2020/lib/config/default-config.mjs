import { LogLevel } from '../logging/log-level';
export const DEFAULT_CONFIG = {
    authority: 'https://please_set',
    authWellknownEndpointUrl: '',
    authWellknownEndpoints: null,
    redirectUrl: 'https://please_set',
    clientId: 'please_set',
    responseType: 'code',
    scope: 'openid email profile',
    hdParam: '',
    postLogoutRedirectUri: 'https://please_set',
    startCheckSession: false,
    silentRenew: false,
    silentRenewUrl: 'https://please_set',
    silentRenewTimeoutInSeconds: 20,
    renewTimeBeforeTokenExpiresInSeconds: 0,
    useRefreshToken: false,
    usePushedAuthorisationRequests: false,
    ignoreNonceAfterRefresh: false,
    postLoginRoute: '/',
    forbiddenRoute: '/forbidden',
    unauthorizedRoute: '/unauthorized',
    autoUserInfo: true,
    autoCleanStateAfterAuthentication: true,
    triggerAuthorizationResultEvent: false,
    logLevel: LogLevel.Warn,
    issValidationOff: false,
    historyCleanupOff: false,
    maxIdTokenIatOffsetAllowedInSeconds: 120,
    disableIatOffsetValidation: false,
    customParamsAuthRequest: {},
    customParamsRefreshTokenRequest: {},
    customParamsEndSessionRequest: {},
    customParamsCodeRequest: {},
    disableRefreshIdTokenAuthTimeValidation: false,
    triggerRefreshWhenIdTokenExpired: true,
    tokenRefreshInSeconds: 4,
    refreshTokenRetryInSeconds: 3,
    ngswBypass: false,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9jb25maWcvZGVmYXVsdC1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBR2hELE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBd0I7SUFDakQsU0FBUyxFQUFFLG9CQUFvQjtJQUMvQix3QkFBd0IsRUFBRSxFQUFFO0lBQzVCLHNCQUFzQixFQUFFLElBQUk7SUFDNUIsV0FBVyxFQUFFLG9CQUFvQjtJQUNqQyxRQUFRLEVBQUUsWUFBWTtJQUN0QixZQUFZLEVBQUUsTUFBTTtJQUNwQixLQUFLLEVBQUUsc0JBQXNCO0lBQzdCLE9BQU8sRUFBRSxFQUFFO0lBQ1gscUJBQXFCLEVBQUUsb0JBQW9CO0lBQzNDLGlCQUFpQixFQUFFLEtBQUs7SUFDeEIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsY0FBYyxFQUFFLG9CQUFvQjtJQUNwQywyQkFBMkIsRUFBRSxFQUFFO0lBQy9CLG9DQUFvQyxFQUFFLENBQUM7SUFDdkMsZUFBZSxFQUFFLEtBQUs7SUFDdEIsOEJBQThCLEVBQUUsS0FBSztJQUNyQyx1QkFBdUIsRUFBRSxLQUFLO0lBQzlCLGNBQWMsRUFBRSxHQUFHO0lBQ25CLGNBQWMsRUFBRSxZQUFZO0lBQzVCLGlCQUFpQixFQUFFLGVBQWU7SUFDbEMsWUFBWSxFQUFFLElBQUk7SUFDbEIsaUNBQWlDLEVBQUUsSUFBSTtJQUN2QywrQkFBK0IsRUFBRSxLQUFLO0lBQ3RDLFFBQVEsRUFBRSxRQUFRLENBQUMsSUFBSTtJQUN2QixnQkFBZ0IsRUFBRSxLQUFLO0lBQ3ZCLGlCQUFpQixFQUFFLEtBQUs7SUFDeEIsbUNBQW1DLEVBQUUsR0FBRztJQUN4QywwQkFBMEIsRUFBRSxLQUFLO0lBQ2pDLHVCQUF1QixFQUFFLEVBQUU7SUFDM0IsK0JBQStCLEVBQUUsRUFBRTtJQUNuQyw2QkFBNkIsRUFBRSxFQUFFO0lBQ2pDLHVCQUF1QixFQUFFLEVBQUU7SUFDM0IsdUNBQXVDLEVBQUUsS0FBSztJQUM5QyxnQ0FBZ0MsRUFBRSxJQUFJO0lBQ3RDLHFCQUFxQixFQUFFLENBQUM7SUFDeEIsMEJBQTBCLEVBQUUsQ0FBQztJQUM3QixVQUFVLEVBQUUsS0FBSztDQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9nTGV2ZWwgfSBmcm9tICcuLi9sb2dnaW5nL2xvZy1sZXZlbCc7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuL29wZW5pZC1jb25maWd1cmF0aW9uJztcclxuXHJcbmV4cG9ydCBjb25zdCBERUZBVUxUX0NPTkZJRzogT3BlbklkQ29uZmlndXJhdGlvbiA9IHtcclxuICBhdXRob3JpdHk6ICdodHRwczovL3BsZWFzZV9zZXQnLFxyXG4gIGF1dGhXZWxsa25vd25FbmRwb2ludFVybDogJycsXHJcbiAgYXV0aFdlbGxrbm93bkVuZHBvaW50czogbnVsbCxcclxuICByZWRpcmVjdFVybDogJ2h0dHBzOi8vcGxlYXNlX3NldCcsXHJcbiAgY2xpZW50SWQ6ICdwbGVhc2Vfc2V0JyxcclxuICByZXNwb25zZVR5cGU6ICdjb2RlJyxcclxuICBzY29wZTogJ29wZW5pZCBlbWFpbCBwcm9maWxlJyxcclxuICBoZFBhcmFtOiAnJyxcclxuICBwb3N0TG9nb3V0UmVkaXJlY3RVcmk6ICdodHRwczovL3BsZWFzZV9zZXQnLFxyXG4gIHN0YXJ0Q2hlY2tTZXNzaW9uOiBmYWxzZSxcclxuICBzaWxlbnRSZW5ldzogZmFsc2UsXHJcbiAgc2lsZW50UmVuZXdVcmw6ICdodHRwczovL3BsZWFzZV9zZXQnLFxyXG4gIHNpbGVudFJlbmV3VGltZW91dEluU2Vjb25kczogMjAsXHJcbiAgcmVuZXdUaW1lQmVmb3JlVG9rZW5FeHBpcmVzSW5TZWNvbmRzOiAwLFxyXG4gIHVzZVJlZnJlc2hUb2tlbjogZmFsc2UsXHJcbiAgdXNlUHVzaGVkQXV0aG9yaXNhdGlvblJlcXVlc3RzOiBmYWxzZSxcclxuICBpZ25vcmVOb25jZUFmdGVyUmVmcmVzaDogZmFsc2UsXHJcbiAgcG9zdExvZ2luUm91dGU6ICcvJyxcclxuICBmb3JiaWRkZW5Sb3V0ZTogJy9mb3JiaWRkZW4nLFxyXG4gIHVuYXV0aG9yaXplZFJvdXRlOiAnL3VuYXV0aG9yaXplZCcsXHJcbiAgYXV0b1VzZXJJbmZvOiB0cnVlLFxyXG4gIGF1dG9DbGVhblN0YXRlQWZ0ZXJBdXRoZW50aWNhdGlvbjogdHJ1ZSxcclxuICB0cmlnZ2VyQXV0aG9yaXphdGlvblJlc3VsdEV2ZW50OiBmYWxzZSxcclxuICBsb2dMZXZlbDogTG9nTGV2ZWwuV2FybixcclxuICBpc3NWYWxpZGF0aW9uT2ZmOiBmYWxzZSxcclxuICBoaXN0b3J5Q2xlYW51cE9mZjogZmFsc2UsXHJcbiAgbWF4SWRUb2tlbklhdE9mZnNldEFsbG93ZWRJblNlY29uZHM6IDEyMCxcclxuICBkaXNhYmxlSWF0T2Zmc2V0VmFsaWRhdGlvbjogZmFsc2UsXHJcbiAgY3VzdG9tUGFyYW1zQXV0aFJlcXVlc3Q6IHt9LFxyXG4gIGN1c3RvbVBhcmFtc1JlZnJlc2hUb2tlblJlcXVlc3Q6IHt9LFxyXG4gIGN1c3RvbVBhcmFtc0VuZFNlc3Npb25SZXF1ZXN0OiB7fSxcclxuICBjdXN0b21QYXJhbXNDb2RlUmVxdWVzdDoge30sXHJcbiAgZGlzYWJsZVJlZnJlc2hJZFRva2VuQXV0aFRpbWVWYWxpZGF0aW9uOiBmYWxzZSxcclxuICB0cmlnZ2VyUmVmcmVzaFdoZW5JZFRva2VuRXhwaXJlZDogdHJ1ZSxcclxuICB0b2tlblJlZnJlc2hJblNlY29uZHM6IDQsXHJcbiAgcmVmcmVzaFRva2VuUmV0cnlJblNlY29uZHM6IDMsXHJcbiAgbmdzd0J5cGFzczogZmFsc2UsXHJcbn07XHJcbiJdfQ==