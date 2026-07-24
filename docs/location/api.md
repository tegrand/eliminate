# Location Endpoints

## 1. Create Location
- **Method**: `POST`
- **URL**: `/api/v1/locations`
- **Permission**: `location:create`
- **Validation**: Strict Zod body schema (rejects unknown).
- **Request**: JSON object matching creation schema.
- **Response**: `201 Created` with created record.
- **Errors**: `400 Bad Request` (Zod), `409 Conflict` (Duplicates).
- **Business Flow**: Validates relations -> Checks uniqueness -> Inserts DB -> Returns mapped result.

## 2. List Locations
- **Method**: `GET`
- **URL**: `/api/v1/locations`
- **Permission**: `location:read`
- **Validation**: Zod query schema (page, limit, search, sortBy).
- **Request**: Query parameters.
- **Response**: `200 OK` with `meta` pagination object.
- **Errors**: `400 Bad Request` for invalid filters.
- **Business Flow**: Parses pagination -> Applies insensitive ILIKE filters -> Fetches count + rows concurrently.

## 3. Get Location by ID
- **Method**: `GET`
- **URL**: `/api/v1/locations/:id`
- **Permission**: `location:read`
- **Validation**: UUID param schema.
- **Request**: Empty body, UUID param.
- **Response**: `200 OK` with record.
- **Errors**: `404 Not Found`.
- **Business Flow**: Fetches single record by ID where `deletedAt: null`.

## 4. Update Location
- **Method**: `PATCH`
- **URL**: `/api/v1/locations/:id`
- **Permission**: `location:update`
- **Validation**: UUID param schema + Strict Zod update schema (requires >0 keys).
- **Request**: JSON object with fields to update.
- **Response**: `200 OK` with updated record.
- **Errors**: `404 Not Found`, `400 Bad Request`.
- **Business Flow**: Verifies existence -> Applies updates safely.

## 5. Delete Location
- **Method**: `DELETE`
- **URL**: `/api/v1/locations/:id`
- **Permission**: `location:delete`
- **Validation**: UUID param schema.
- **Request**: Empty body.
- **Response**: `200 OK` (Null data).
- **Errors**: `404 Not Found`.
- **Business Flow**: Verifies existence -> Sets `deletedAt = new Date()`.
