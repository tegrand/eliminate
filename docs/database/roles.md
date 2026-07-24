# Role System

## Existing Roles
- `SUPER_ADMIN`: Full unfettered access.
- `CLIENT`: Client domain access.
- `AGENCY`: Agency management.
- `WORKER`: Worker operations.

## Access Philosophy
Role access is explicitly declared via the `authorize("ROLE")` middleware.

## Role Hierarchy
No implicit hierarchy exists. If an Agency needs Worker permissions, it must be explicitly mapped via `RolePermission`.

## Best Practices
- Cache roles on the JWT Access Token to prevent DB hits on every request.
