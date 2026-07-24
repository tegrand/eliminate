# ELIMINATE: Folder Structure

## Folder Philosophy
We use a Modular Monolith design. 

```text
src/
├── config/       # Global configuration
├── middleware/   # Cross-cutting interceptors
├── modules/      # Domain specific code
│   ├── auth/
│   ├── users/
│   └── workers/
└── shared/       # Universal utilities
```

## File Responsibilities
- `*.routes.js`: HTTP routing only.
- `*.validation.js`: Zod boundary defense.
- `*.controller.js`: Transport and Response formatting.
- `*.service.js`: Business rules and Database access.

## Module Creation Rules
1. Update Prisma schema.
2. Create Validation.
3. Create Service.
4. Create Controller.
5. Create Routes.
6. Mount to Express app.
