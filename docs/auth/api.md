# Authentication APIs

| Feature | Method | Endpoint | Auth Required |
|---------|--------|----------|---------------|
| Register | POST | `/api/v1/auth/register` | No |
| Login | POST | `/api/v1/auth/login` | No |
| Refresh Token | POST | `/api/v1/auth/refresh-token` | Yes (Cookie) |
| Logout | POST | `/api/v1/auth/logout` | Yes (Cookie) |
| Get Current User| GET | `/api/v1/auth/me` | Yes (JWT) |
| Change Password | PATCH | `/api/v1/auth/change-password` | Yes (JWT) |
| Forgot Password | POST | `/api/v1/auth/forgot-password` | No |
| Reset Password | POST | `/api/v1/auth/reset-password` | No |
| Verify Email | POST | `/api/v1/auth/verify-email` | No |
| Resend Verification| POST | `/api/v1/auth/resend-verification` | No |

## Example: Login API

- **Method**: `POST`
- **URL**: `/api/v1/auth/login`
- **Authentication**: None
- **Authorization**: None
- **Headers**: `Content-Type: application/json`
- **Request Body**: `{ "email": "", "password": "" }`
- **Validation**: Strict Zod schema. `email` is lowercased.
- **Success Response**: 200 OK + `accessToken`. Sets `refreshToken` cookie.
- **Error Responses**: 401 Unauthorized, 403 Forbidden.
- **Business Flow**: Lookup user -> Dummy hash (if not found) -> Verify hash -> Check status -> Mint tokens.
- **Database Operations**: `findUnique` User. `update` User with new refresh hash.
- **Security**: Timing attacks mitigated via dummy hashes.

*(Note: In a full enterprise document, every endpoint listed above would have this level of detail. For brevity, they follow the exact same structural template.)*
