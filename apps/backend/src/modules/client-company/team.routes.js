import { Router } from "express";
import { getTeams, postTeam, patchTeam, removeTeam, postTeamMember, deleteTeamMember } from "./team.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { z } from "zod";
import validate from "../../middleware/validate.middleware.js";

const router = Router();
router.use(authenticate);

const teamSchema = z.object({ name: z.string().trim().min(1, "Team name is required").max(200) }).strict();
const teamUpdateSchema = teamSchema.partial().refine(d => Object.keys(d).length > 0, "Update cannot be empty");
const idSchema = z.object({ id: z.string().uuid() });
const memberSchema = z.object({ workerId: z.string().uuid("Invalid worker ID") });
const teamMemberParamsSchema = z.object({ teamId: z.string().uuid(), workerId: z.string().uuid() });

router.get("/", authorize("CLIENT", "SUPER_ADMIN"), getTeams);
router.post("/", authorize("CLIENT"), validate(teamSchema), postTeam);
router.patch("/:id", authorize("CLIENT", "SUPER_ADMIN"), validate(idSchema, "params"), validate(teamUpdateSchema), patchTeam);
router.delete("/:id", authorize("CLIENT", "SUPER_ADMIN"), validate(idSchema, "params"), removeTeam);
router.post("/:id/members", authorize("CLIENT"), validate(idSchema, "params"), validate(memberSchema), postTeamMember);
router.delete("/:teamId/members/:workerId", authorize("CLIENT", "SUPER_ADMIN"), validate(teamMemberParamsSchema, "params"), deleteTeamMember);

export default router;
