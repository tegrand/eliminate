const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');

const modules = [
  'worker',
  'client',
  'skill',
  'category',
  'language',
  'location',
  'worker-skill',
  'worker-language',
  'agency-worker',
  'job-requirement'
];

const toPascalCase = (str) => {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
};

const toTitleCase = (str) => {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const generateReadme = (mod) => {
  const Title = toTitleCase(mod);
  return `# ${Title} Module

## Module Overview
The ${Title} module is a core component of the ELIMINATE platform, responsible for managing lifecycle and data relationships of ${Title} records.

## Responsibilities
- Secure CRUD operations for ${Title}.
- Relationship integrity management with parent and child entities.
- Advanced pagination, filtering, and sorting capabilities.
- Strict data sanitation and payload protection.

## Folder Structure
- \`${mod}.routes.js\`: Express router configurations, permission locking, and middleware injection.
- \`${mod}.controller.js\`: HTTP request/response wrapper utilizing \`ApiResponse\` and \`asyncHandler\`.
- \`${mod}.service.js\`: Business logic layer executing Prisma queries and \`AppError\` handling.
- \`${mod}.validation.js\`: Zod schemas enforcing strict \`.strict()\` type constraints and data validation.

## Architecture
The module strictly adheres to the Modular Monolith pattern. Controllers remain completely decoupled from the database, while services handle business rules transparently.

## Lifecycle
1. **Request Reception**: Handled by Express routes.
2. **Authentication/Authorization**: Validated via JWT and RBAC \`${mod}:*\` permission slugs.
3. **Payload Sanitization**: Zod middleware strips unknown fields.
4. **Execution**: Service layer runs atomic Prisma transactions.
5. **Response**: Standardized \`ApiResponse\` returned.

## Business Rules
- Soft-deletion over hard-deletion (utilizing \`deletedAt\`).
- UUID enforcement on all relational bindings.
- Protection against duplicate assignments/records.

## Security
- Strict API boundaries to prevent Mass Assignment vulnerabilities.
- Timing-attack mitigations enforced upstream.

## Future Scope
- Batch processing operations.
- Redis caching for frequent GET queries.
`;
};

const generateDatabase = (mod) => {
  const Title = toTitleCase(mod);
  const PascalName = toPascalCase(mod);
  return `# ${Title} Database Model

## Prisma Model
\`\`\`mermaid
erDiagram
    ${PascalName} ||--o{ Relation : "manages"
    ${PascalName} {
        String id "UUID PK"
        DateTime createdAt
        DateTime updatedAt
        DateTime deletedAt
    }
\`\`\`

## Fields
- **id**: UUID v4, primary key.
- **createdAt**: Automatically tracked insertion time.
- **updatedAt**: Automatically tracked mutation time.
- **deletedAt**: Nullable timestamp used for soft deletions.

## Relations
- Uses \`onDelete: Cascade\` for child maps to ensure referential safety.
- Utilizes Prisma's generated relation arrays.

## Indexes
- \`@@index([deletedAt])\` for optimized soft-delete exclusion queries.
- Target fields indexed based on frequent \`WHERE\` and \`ORDER BY\` clauses.

## Constraints
- \`@unique\` constraints applied on business identifiers (e.g., codes, emails, slugs).
- Composite unique constraints \`@@unique([parentId, childId])\` for mapping tables.

## Enums
- Specific enums used where states are statically defined (e.g., Status, Proficiency, Priority).

## Design Decisions
- Adopted the Prisma Singleton pattern to prevent connection exhaustion.
- Enforced soft deletion to preserve analytical and historical data integrity.
`;
};

const generateApi = (mod) => {
  const Title = toTitleCase(mod);
  const apiEndpoint = `/api/v1/${mod}s`;

  return `# ${Title} Endpoints

## 1. Create ${Title}
- **Method**: \`POST\`
- **URL**: \`${apiEndpoint}\`
- **Permission**: \`${mod}:create\`
- **Validation**: Strict Zod body schema (rejects unknown).
- **Request**: JSON object matching creation schema.
- **Response**: \`201 Created\` with created record.
- **Errors**: \`400 Bad Request\` (Zod), \`409 Conflict\` (Duplicates).
- **Business Flow**: Validates relations -> Checks uniqueness -> Inserts DB -> Returns mapped result.

## 2. List ${Title}s
- **Method**: \`GET\`
- **URL**: \`${apiEndpoint}\`
- **Permission**: \`${mod}:read\`
- **Validation**: Zod query schema (page, limit, search, sortBy).
- **Request**: Query parameters.
- **Response**: \`200 OK\` with \`meta\` pagination object.
- **Errors**: \`400 Bad Request\` for invalid filters.
- **Business Flow**: Parses pagination -> Applies insensitive ILIKE filters -> Fetches count + rows concurrently.

## 3. Get ${Title} by ID
- **Method**: \`GET\`
- **URL**: \`${apiEndpoint}/:id\`
- **Permission**: \`${mod}:read\`
- **Validation**: UUID param schema.
- **Request**: Empty body, UUID param.
- **Response**: \`200 OK\` with record.
- **Errors**: \`404 Not Found\`.
- **Business Flow**: Fetches single record by ID where \`deletedAt: null\`.

## 4. Update ${Title}
- **Method**: \`PATCH\`
- **URL**: \`${apiEndpoint}/:id\`
- **Permission**: \`${mod}:update\`
- **Validation**: UUID param schema + Strict Zod update schema (requires >0 keys).
- **Request**: JSON object with fields to update.
- **Response**: \`200 OK\` with updated record.
- **Errors**: \`404 Not Found\`, \`400 Bad Request\`.
- **Business Flow**: Verifies existence -> Applies updates safely.

## 5. Delete ${Title}
- **Method**: \`DELETE\`
- **URL**: \`${apiEndpoint}/:id\`
- **Permission**: \`${mod}:delete\`
- **Validation**: UUID param schema.
- **Request**: Empty body.
- **Response**: \`200 OK\` (Null data).
- **Errors**: \`404 Not Found\`.
- **Business Flow**: Verifies existence -> Sets \`deletedAt = new Date()\`.
`;
};

const generateFlow = (mod) => {
  const Title = toTitleCase(mod);
  return `# ${Title} Execution Flow

## Sequence Diagram
\`\`\`mermaid
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
\`\`\`

## Request Lifecycle
Every request passes through a strict gauntlet of interceptors before reaching business logic, ensuring absolute type safety.

## Controller Flow
The Controller acts purely as a transport layer. It unwraps Express parameters (\`req.validatedData\`, \`req.params\`) and routes them to the Service, wrapping the final result in \`ApiResponse\`.

## Service Flow
The Service layer handles the orchestration:
1. Validate existential dependencies (e.g., Parent records exist).
2. Execute business-specific duplicate checks.
3. Bundle logic into Prisma \`$transaction\` where multi-row mutations occur.

## Database Flow
Queries are constructed using the Prisma Singleton. All \`findMany\` operations employ \`deletedAt: null\` filters implicitly to respect soft-deletions.

## Error Flow
If any step fails, an \`AppError\` is thrown. This is caught by \`asyncHandler\` and bubbled up to the global Error Handling Middleware which strips sensitive stack traces in production before returning JSON.
`;
};

const createDocs = () => {
  modules.forEach(mod => {
    const modPath = path.join(docsDir, mod);
    if (!fs.existsSync(modPath)) {
      fs.mkdirSync(modPath, { recursive: true });
    }

    fs.writeFileSync(path.join(modPath, 'README.md'), generateReadme(mod));
    fs.writeFileSync(path.join(modPath, 'database.md'), generateDatabase(mod));
    fs.writeFileSync(path.join(modPath, 'api.md'), generateApi(mod));
    fs.writeFileSync(path.join(modPath, 'flow.md'), generateFlow(mod));
  });
};

createDocs();
console.log('Advanced Documentation structure generated successfully!');
