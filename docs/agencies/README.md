# Agency Module

## Architecture
The Agency module manages B2B profiles connecting agencies to the platform. It strictly enforces the Modular Monolith standard.

## Responsibilities
- Agency profile management.
- Dynamic deduplication of GST and Email metrics during operations.
- Centralized relationship indexing for downstream assignments and worker placements.

## Folder Structure
- `agency.routes.js`: HTTP boundary and Middleware pipeline.
- `agency.controller.js`: Thin transport layer using `ApiResponse`.
- `agency.service.js`: Prisma interaction and `AppError` execution.
- `agency.validation.js`: Strict Zod boundary defense.
