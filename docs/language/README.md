# Language Module

## Module Overview
The Language module is a core component of the ELIMINATE platform, responsible for managing lifecycle and data relationships of Language records.

## Responsibilities
- Secure CRUD operations for Language.
- Relationship integrity management with parent and child entities.
- Advanced pagination, filtering, and sorting capabilities.
- Strict data sanitation and payload protection.

## Folder Structure
- `language.routes.js`: Express router configurations, permission locking, and middleware injection.
- `language.controller.js`: HTTP request/response wrapper utilizing `ApiResponse` and `asyncHandler`.
- `language.service.js`: Business logic layer executing Prisma queries and `AppError` handling.
- `language.validation.js`: Zod schemas enforcing strict `.strict()` type constraints and data validation.

## Architecture
The module strictly adheres to the Modular Monolith pattern. Controllers remain completely decoupled from the database, while services handle business rules transparently.

## Lifecycle
1. **Request Reception**: Handled by Express routes.
2. **Authentication/Authorization**: Validated via JWT and RBAC `language:*` permission slugs.
3. **Payload Sanitization**: Zod middleware strips unknown fields.
4. **Execution**: Service layer runs atomic Prisma transactions.
5. **Response**: Standardized `ApiResponse` returned.

## Business Rules
- Soft-deletion over hard-deletion (utilizing `deletedAt`).
- UUID enforcement on all relational bindings.
- Protection against duplicate assignments/records.

## Security
- Strict API boundaries to prevent Mass Assignment vulnerabilities.
- Timing-attack mitigations enforced upstream.

## Future Scope
- Batch processing operations.
- Redis caching for frequent GET queries.
