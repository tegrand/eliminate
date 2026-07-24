# Job Requirement Execution Flow

## Sequence Diagram
```mermaid
sequenceDiagram
    participant C as Client
    participant R as Express Router
    participant A as Auth/RBAC
    participant V as Zod Validator
    participant Ctrl as Controller
    participant Svc as Service
    participant DB as PostgreSQL

    C->>R: HTTP Request
    R->>A: Validate Token & Permissions
    A->>V: Parse Payload
    V->>Ctrl: Pass Validated Data
    Ctrl->>Svc: Invoke Business Logic
    Svc->>DB: Prisma Query
    DB-->>Svc: Data
    Svc-->>Ctrl: Raw Result
    Ctrl-->>C: ApiResponse Format
```

## Request Lifecycle
Every request passes through a strict gauntlet of interceptors before reaching business logic, ensuring absolute type safety.

## Controller Flow
The Controller acts purely as a transport layer. It unwraps Express parameters (`req.validatedData`, `req.params`) and routes them to the Service, wrapping the final result in `ApiResponse`.

## Service Flow
The Service layer handles the orchestration:
1. Validate existential dependencies (e.g., Parent records exist).
2. Execute business-specific duplicate checks.
3. Bundle logic into Prisma `$transaction` where multi-row mutations occur.

## Database Flow
Queries are constructed using the Prisma Singleton. All `findMany` operations employ `deletedAt: null` filters implicitly to respect soft-deletions.

## Error Flow
If any step fails, an `AppError` is thrown. This is caught by `asyncHandler` and bubbled up to the global Error Handling Middleware which strips sensitive stack traces in production before returning JSON.
