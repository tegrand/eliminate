# ELIMINATE: System Architecture

## Overall System Architecture
ELIMINATE uses a Modular Monolith backend powered by Express.js, PostgreSQL, and Prisma ORM.

## Layered Architecture
```mermaid
graph TD
    Router --> Middleware --> Controller --> Service --> Prisma
```
The Repository Pattern is explicitly banned. Services query Prisma directly.

## Request Lifecycle
```mermaid
sequenceDiagram
    Client->>Router: HTTP Request
    Router->>Middleware: Auth & RBAC
    Middleware->>Validator: Zod Strict
    Validator->>Controller: req.validatedData
    Controller->>Service: Business Logic
    Service->>Prisma: Database Queries
    Service-->>Controller: Return Model
    Controller-->>Client: ApiResponse
```

## Prisma Flow
Prisma is a singleton to prevent connection leaks.

## Error Handling
Throw `AppError(msg, status)` in Services. `asyncHandler` catches it for the global error middleware.

## Configuration
Secrets are extracted and validated in `src/config/`. Never read `process.env` in a Service.
