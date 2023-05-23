// eslint-disable-next-line no-shadow
export var EventTypes;
(function (EventTypes) {
    /**
     *  This only works in the AppModule Constructor
     */
    EventTypes[EventTypes["ConfigLoaded"] = 0] = "ConfigLoaded";
    EventTypes[EventTypes["CheckingAuth"] = 1] = "CheckingAuth";
    EventTypes[EventTypes["CheckingAuthFinished"] = 2] = "CheckingAuthFinished";
    EventTypes[EventTypes["CheckingAuthFinishedWithError"] = 3] = "CheckingAuthFinishedWithError";
    EventTypes[EventTypes["ConfigLoadingFailed"] = 4] = "ConfigLoadingFailed";
    EventTypes[EventTypes["CheckSessionReceived"] = 5] = "CheckSessionReceived";
    EventTypes[EventTypes["UserDataChanged"] = 6] = "UserDataChanged";
    EventTypes[EventTypes["NewAuthenticationResult"] = 7] = "NewAuthenticationResult";
    EventTypes[EventTypes["TokenExpired"] = 8] = "TokenExpired";
    EventTypes[EventTypes["IdTokenExpired"] = 9] = "IdTokenExpired";
    EventTypes[EventTypes["SilentRenewStarted"] = 10] = "SilentRenewStarted";
    EventTypes[EventTypes["SilentRenewFailed"] = 11] = "SilentRenewFailed";
})(EventTypes || (EventTypes = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtdHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi9wdWJsaWMtZXZlbnRzL2V2ZW50LXR5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFDQUFxQztBQUNyQyxNQUFNLENBQU4sSUFBWSxVQWdCWDtBQWhCRCxXQUFZLFVBQVU7SUFDcEI7O09BRUc7SUFDSCwyREFBWSxDQUFBO0lBQ1osMkRBQVksQ0FBQTtJQUNaLDJFQUFvQixDQUFBO0lBQ3BCLDZGQUE2QixDQUFBO0lBQzdCLHlFQUFtQixDQUFBO0lBQ25CLDJFQUFvQixDQUFBO0lBQ3BCLGlFQUFlLENBQUE7SUFDZixpRkFBdUIsQ0FBQTtJQUN2QiwyREFBWSxDQUFBO0lBQ1osK0RBQWMsQ0FBQTtJQUNkLHdFQUFrQixDQUFBO0lBQ2xCLHNFQUFpQixDQUFBO0FBQ25CLENBQUMsRUFoQlcsVUFBVSxLQUFWLFVBQVUsUUFnQnJCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xyXG5leHBvcnQgZW51bSBFdmVudFR5cGVzIHtcclxuICAvKipcclxuICAgKiAgVGhpcyBvbmx5IHdvcmtzIGluIHRoZSBBcHBNb2R1bGUgQ29uc3RydWN0b3JcclxuICAgKi9cclxuICBDb25maWdMb2FkZWQsXHJcbiAgQ2hlY2tpbmdBdXRoLFxyXG4gIENoZWNraW5nQXV0aEZpbmlzaGVkLFxyXG4gIENoZWNraW5nQXV0aEZpbmlzaGVkV2l0aEVycm9yLFxyXG4gIENvbmZpZ0xvYWRpbmdGYWlsZWQsXHJcbiAgQ2hlY2tTZXNzaW9uUmVjZWl2ZWQsXHJcbiAgVXNlckRhdGFDaGFuZ2VkLFxyXG4gIE5ld0F1dGhlbnRpY2F0aW9uUmVzdWx0LFxyXG4gIFRva2VuRXhwaXJlZCxcclxuICBJZFRva2VuRXhwaXJlZCxcclxuICBTaWxlbnRSZW5ld1N0YXJ0ZWQsXHJcbiAgU2lsZW50UmVuZXdGYWlsZWQsXHJcbn1cclxuIl19