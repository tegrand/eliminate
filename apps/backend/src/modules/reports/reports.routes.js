import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import * as reportsController from "./reports.controller.js";

const router = Router();

router.use(authenticate);

// Only Clients can access their comprehensive reports for now
router.use(authorize("CLIENT"));

router.get("/worker-history", reportsController.getWorkerHistory);
router.get("/agency-history", reportsController.getAgencyHistory);
router.get("/job-history", reportsController.getJobHistory);
router.get("/attendance", reportsController.getAttendanceReport);


export default router;
