import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import usersRoutes from "../modules/users/users.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import workerRoutes from "../modules/workers/worker.routes.js";
import workerMarketplaceRoutes from "../modules/workers/worker-marketplace.routes.js";
import workerSkillRoutes from "../modules/workers/worker-skill.routes.js";
import workerLanguageRoutes from "../modules/workers/worker-language.routes.js";
import clientRoutes from "../modules/clients/client.routes.js";
import agencyRoutes from "../modules/agencies/agency.routes.js";
import agencyWorkerRoutes from "../modules/agencies/agency-worker.routes.js";
import skillRoutes from "../modules/skills/skill.routes.js";
import categoryRoutes from "../modules/categories/category.routes.js";
import languageRoutes from "../modules/languages/language.routes.js";
import locationRoutes from "../modules/locations/location.routes.js";
import jobRoutes from "../modules/jobs/job.routes.js";
import hiringRequestRoutes from "../modules/hiring-requests/hiring-request.routes.js";
import assignmentRoutes from "../modules/assignments/assignment.routes.js";
import workerAttendanceRoutes from "../modules/worker-attendance/worker-attendance.routes.js";
import workerPaymentsRoutes from "../modules/worker-payments/worker-payments.routes.js";
import agencyPaymentsRoutes from "../modules/agency-payments/agency-payments.routes.js";
import workerDocumentsRoutes from "../modules/worker-documents/worker-documents.routes.js";
import notificationsRoutes from "../modules/notifications/notifications.routes.js";
import reviewRoutes from "../modules/reviews/review.routes.js";
import reportsRoutes from "../modules/reports/reports.routes.js";
import complaintsRoutes from "../modules/complaints/complaints.routes.js";
import settingsRoutes from "../modules/settings/settings.routes.js";
import paymentRoutes from "../modules/payments/payment.routes.js";
import invoiceRoutes from "../modules/invoices/invoice.route.js";

const router = Router();

// Core & Auth Routes
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/settings", settingsRoutes);

// Entity Routes
router.use("/workers/marketplace", workerMarketplaceRoutes);
router.use("/workers", workerRoutes);
router.use("/clients", clientRoutes);
router.use("/agencies", agencyRoutes);
router.use("/jobs", jobRoutes);
router.use("/hiring-requests", hiringRequestRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/my-attendance", workerAttendanceRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/my-payments", workerPaymentsRoutes);
router.use("/agency-payments", agencyPaymentsRoutes);
router.use("/my-documents", workerDocumentsRoutes);
router.use("/reviews", reviewRoutes);
router.use("/reports", reportsRoutes);
router.use("/complaints", complaintsRoutes);
router.use("/payments", paymentRoutes);
router.use("/invoices", invoiceRoutes);

// Master Data Routes
router.use("/skills", skillRoutes);
router.use("/categories", categoryRoutes);
router.use("/languages", languageRoutes);
router.use("/locations", locationRoutes);

// Relation / Sub-resource Routes
router.use("/", workerSkillRoutes);
router.use("/", workerLanguageRoutes);
router.use("/", agencyWorkerRoutes);

// Health Check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API Healthy",
  });
});

export default router;





