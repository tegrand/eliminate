# Authentication Module

## Architecture
Provides robust JWT stateless auth combined with HttpOnly Refresh tokens.

## Responsibilities
- Secure password hashing (bcrypt).
- JWT issuance.
- Token rotation.
- Cookie management.

## Lifecycle
1. User logs in.
2. Receives short-lived Access Token (JSON) + long-lived Refresh Token (HttpOnly Cookie).
3. Refresh Token is hashed in the database.
4. Rotation invalidates old hash.

## Security Design
- Dummy hashes prevent timing attacks.
- SHA-256 prevents database breach token theft.
