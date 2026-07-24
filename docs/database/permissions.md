# Permission System

## Permission Categories
Permissions are grouped by `module` (e.g., `WORKERS`, `AUTH`).

## RolePermission Relationship
A Many-to-Many join table links `Role` and `Permission`.

## Authorization Strategy
Use `requirePermission("CREATE_WORKER")` middleware. It dynamically fetches active permissions for the user's role.

## Best Practices
- Never hardcode permissions in controllers.
- Use explicit UI feature-flags matching the API permission names.
