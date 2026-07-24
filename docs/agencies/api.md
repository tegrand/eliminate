# Agency APIs

| Method | Endpoint | Auth | Permission |
|--------|----------|------|------------|
| POST | `/api/v1/agencies` | Yes | `agency:create` |
| GET | `/api/v1/agencies` | Yes | `agency:read` |
| GET | `/api/v1/agencies/:id` | Yes | `agency:read` |
| PATCH | `/api/v1/agencies/:id` | Yes | `agency:update` |
| DELETE | `/api/v1/agencies/:id` | Yes | `agency:delete` |

## Validation Features
- Fully supports cursor/offset pagination (`page`, `limit`).
- Supports `.mode("insensitive")` multi-field search conditions.
- Strictly parses UUID params for targeted operations.
