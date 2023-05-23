export function getVerifyAlg(alg) {
    switch (alg.charAt(0)) {
        case 'R':
            return {
                name: 'RSASSA-PKCS1-v1_5',
                hash: 'SHA-256',
            };
        case 'E':
            if (alg.includes('256')) {
                return {
                    name: 'ECDSA',
                    hash: 'SHA-256',
                };
            }
            else if (alg.includes('384')) {
                return {
                    name: 'ECDSA',
                    hash: 'SHA-384',
                };
            }
            else {
                return null;
            }
        default:
            return null;
    }
}
export function alg2kty(alg) {
    switch (alg.charAt(0)) {
        case 'R':
            return 'RSA';
        case 'E':
            return 'EC';
        default:
            throw new Error('Cannot infer kty from alg: ' + alg);
    }
}
export function getImportAlg(alg) {
    switch (alg.charAt(0)) {
        case 'R':
            if (alg.includes('256')) {
                return {
                    name: 'RSASSA-PKCS1-v1_5',
                    hash: 'SHA-256',
                };
            }
            else if (alg.includes('384')) {
                return {
                    name: 'RSASSA-PKCS1-v1_5',
                    hash: 'SHA-384',
                };
            }
            else if (alg.includes('512')) {
                return {
                    name: 'RSASSA-PKCS1-v1_5',
                    hash: 'SHA-512',
                };
            }
            else {
                return null;
            }
        case 'E':
            if (alg.includes('256')) {
                return {
                    name: 'ECDSA',
                    namedCurve: 'P-256',
                };
            }
            else if (alg.includes('384')) {
                return {
                    name: 'ECDSA',
                    namedCurve: 'P-384',
                };
            }
            else {
                return null;
            }
        default:
            return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tdmFsaWRhdGlvbi5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjL2xpYi92YWxpZGF0aW9uL3Rva2VuLXZhbGlkYXRpb24uaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sVUFBVSxZQUFZLENBQUMsR0FBVztJQUN0QyxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDckIsS0FBSyxHQUFHO1lBQ04sT0FBTztnQkFDTCxJQUFJLEVBQUUsbUJBQW1CO2dCQUN6QixJQUFJLEVBQUUsU0FBUzthQUNoQixDQUFDO1FBQ0osS0FBSyxHQUFHO1lBQ04sSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN2QixPQUFPO29CQUNMLElBQUksRUFBRSxPQUFPO29CQUNiLElBQUksRUFBRSxTQUFTO2lCQUNoQixDQUFDO2FBQ0g7aUJBQU0sSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM5QixPQUFPO29CQUNMLElBQUksRUFBRSxPQUFPO29CQUNiLElBQUksRUFBRSxTQUFTO2lCQUNoQixDQUFDO2FBQ0g7aUJBQU07Z0JBQ0wsT0FBTyxJQUFJLENBQUM7YUFDYjtRQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUM7S0FDZjtBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUsT0FBTyxDQUFDLEdBQVc7SUFDakMsUUFBUSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3JCLEtBQUssR0FBRztZQUNOLE9BQU8sS0FBSyxDQUFDO1FBRWYsS0FBSyxHQUFHO1lBQ04sT0FBTyxJQUFJLENBQUM7UUFFZDtZQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLEdBQUcsR0FBRyxDQUFDLENBQUM7S0FDeEQ7QUFDSCxDQUFDO0FBRUQsTUFBTSxVQUFVLFlBQVksQ0FBQyxHQUFXO0lBQ3RDLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNyQixLQUFLLEdBQUc7WUFDTixJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3ZCLE9BQU87b0JBQ0wsSUFBSSxFQUFFLG1CQUFtQjtvQkFDekIsSUFBSSxFQUFFLFNBQVM7aUJBQ2hCLENBQUM7YUFDSDtpQkFBTSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzlCLE9BQU87b0JBQ0wsSUFBSSxFQUFFLG1CQUFtQjtvQkFDekIsSUFBSSxFQUFFLFNBQVM7aUJBQ2hCLENBQUM7YUFDSDtpQkFBTSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzlCLE9BQU87b0JBQ0wsSUFBSSxFQUFFLG1CQUFtQjtvQkFDekIsSUFBSSxFQUFFLFNBQVM7aUJBQ2hCLENBQUM7YUFDSDtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQzthQUNiO1FBQ0gsS0FBSyxHQUFHO1lBQ04sSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN2QixPQUFPO29CQUNMLElBQUksRUFBRSxPQUFPO29CQUNiLFVBQVUsRUFBRSxPQUFPO2lCQUNwQixDQUFDO2FBQ0g7aUJBQU0sSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM5QixPQUFPO29CQUNMLElBQUksRUFBRSxPQUFPO29CQUNiLFVBQVUsRUFBRSxPQUFPO2lCQUNwQixDQUFDO2FBQ0g7aUJBQU07Z0JBQ0wsT0FBTyxJQUFJLENBQUM7YUFDYjtRQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUM7S0FDZjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZ2V0VmVyaWZ5QWxnKGFsZzogc3RyaW5nKTogUnNhSGFzaGVkSW1wb3J0UGFyYW1zIHwgRWNkc2FQYXJhbXMge1xyXG4gIHN3aXRjaCAoYWxnLmNoYXJBdCgwKSkge1xyXG4gICAgY2FzZSAnUic6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgbmFtZTogJ1JTQVNTQS1QS0NTMS12MV81JyxcclxuICAgICAgICBoYXNoOiAnU0hBLTI1NicsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlICdFJzpcclxuICAgICAgaWYgKGFsZy5pbmNsdWRlcygnMjU2JykpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgbmFtZTogJ0VDRFNBJyxcclxuICAgICAgICAgIGhhc2g6ICdTSEEtMjU2JyxcclxuICAgICAgICB9O1xyXG4gICAgICB9IGVsc2UgaWYgKGFsZy5pbmNsdWRlcygnMzg0JykpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgbmFtZTogJ0VDRFNBJyxcclxuICAgICAgICAgIGhhc2g6ICdTSEEtMzg0JyxcclxuICAgICAgICB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhbGcya3R5KGFsZzogc3RyaW5nKTogc3RyaW5nIHtcclxuICBzd2l0Y2ggKGFsZy5jaGFyQXQoMCkpIHtcclxuICAgIGNhc2UgJ1InOlxyXG4gICAgICByZXR1cm4gJ1JTQSc7XHJcblxyXG4gICAgY2FzZSAnRSc6XHJcbiAgICAgIHJldHVybiAnRUMnO1xyXG5cclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGluZmVyIGt0eSBmcm9tIGFsZzogJyArIGFsZyk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW1wb3J0QWxnKGFsZzogc3RyaW5nKTogUnNhSGFzaGVkSW1wb3J0UGFyYW1zIHwgRWNLZXlJbXBvcnRQYXJhbXMge1xyXG4gIHN3aXRjaCAoYWxnLmNoYXJBdCgwKSkge1xyXG4gICAgY2FzZSAnUic6XHJcbiAgICAgIGlmIChhbGcuaW5jbHVkZXMoJzI1NicpKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG5hbWU6ICdSU0FTU0EtUEtDUzEtdjFfNScsXHJcbiAgICAgICAgICBoYXNoOiAnU0hBLTI1NicsXHJcbiAgICAgICAgfTtcclxuICAgICAgfSBlbHNlIGlmIChhbGcuaW5jbHVkZXMoJzM4NCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG5hbWU6ICdSU0FTU0EtUEtDUzEtdjFfNScsXHJcbiAgICAgICAgICBoYXNoOiAnU0hBLTM4NCcsXHJcbiAgICAgICAgfTtcclxuICAgICAgfSBlbHNlIGlmIChhbGcuaW5jbHVkZXMoJzUxMicpKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG5hbWU6ICdSU0FTU0EtUEtDUzEtdjFfNScsXHJcbiAgICAgICAgICBoYXNoOiAnU0hBLTUxMicsXHJcbiAgICAgICAgfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgY2FzZSAnRSc6XHJcbiAgICAgIGlmIChhbGcuaW5jbHVkZXMoJzI1NicpKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG5hbWU6ICdFQ0RTQScsXHJcbiAgICAgICAgICBuYW1lZEN1cnZlOiAnUC0yNTYnLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0gZWxzZSBpZiAoYWxnLmluY2x1ZGVzKCczODQnKSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBuYW1lOiAnRUNEU0EnLFxyXG4gICAgICAgICAgbmFtZWRDdXJ2ZTogJ1AtMzg0JyxcclxuICAgICAgICB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuIl19