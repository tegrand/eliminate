# JWT Implementation

## Access Token
- **Payload**: `sub` (User ID), `role`, `profileType`.
- **Expiration**: Short-lived (15 minutes).
- **Transport**: JSON Body -> Client Memory.

## Verification
`authenticate` middleware executes `jwt.verify()`.

## Security Considerations
- Never store JWT in localStorage to avoid XSS.
- Sign using robust 256-bit secrets.
