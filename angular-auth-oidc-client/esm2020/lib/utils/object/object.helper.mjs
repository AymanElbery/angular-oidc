export function removeNullAndUndefinedValues(obj) {
    const copy = { ...obj };
    for (const key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
            delete copy[key];
        }
    }
    return copy;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvbGliL3V0aWxzL29iamVjdC9vYmplY3QuaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sVUFBVSw0QkFBNEIsQ0FBQyxHQUFRO0lBQ25ELE1BQU0sSUFBSSxHQUFHLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUV4QixLQUFLLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRTtRQUNyQixJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUMvQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQjtLQUNGO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZU51bGxBbmRVbmRlZmluZWRWYWx1ZXMob2JqOiBhbnkpOiBhbnkge1xyXG4gIGNvbnN0IGNvcHkgPSB7IC4uLm9iaiB9O1xyXG5cclxuICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcclxuICAgIGlmIChvYmpba2V5XSA9PT0gdW5kZWZpbmVkIHx8IG9ialtrZXldID09PSBudWxsKSB7XHJcbiAgICAgIGRlbGV0ZSBjb3B5W2tleV07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29weTtcclxufVxyXG4iXX0=