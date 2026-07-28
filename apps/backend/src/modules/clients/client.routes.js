import { Router } from "express";

import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  updateClientStatus,
  deleteClient,
  getMe,
  updateMe,
} from "./client.controller.js";

import {
  createClientSchema,
  updateClientSchema,
  clientIdParamSchema,
  listClientsQuerySchema,
  updateClientStatusSchema,
} from "./client.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/authorize.middleware.js";

const router = Router();

// Apply authentication universally to all client routes
router.use(authenticate);

router.post(
  "/",
  requirePermission("client:create"),
  validate(createClientSchema),
  createClient
);

router.get(
  "/",
  requirePermission("client:read"),
  validate(listClientsQuerySchema, "query"),
  getClients
);

router.get(
  "/me",
  getMe
);

router.patch(
  "/me",
  validate(updateClientSchema),
  updateMe
);

router.get(
  "/:id",
  requirePermission("client:read"),
  validate(clientIdParamSchema, "params"),
  getClientById
);

router.patch(
  "/:id",
  requirePermission("client:update"),
  validate(clientIdParamSchema, "params"),
  validate(updateClientSchema),
  updateClient
);

router.patch(
  "/:id/status",
  requirePermission("client:update"),
  validate(clientIdParamSchema, "params"),
  validate(updateClientStatusSchema),
  updateClientStatus
);

router.delete(
  "/:id",
  requirePermission("client:delete"),
  validate(clientIdParamSchema, "params"),
  deleteClient
);

export default router;
