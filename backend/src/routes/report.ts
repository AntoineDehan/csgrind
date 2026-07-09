import { Router } from "express";
import * as reportController from "../controllers/report.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, reportController.getReports);
router.get("/:id", authenticate, reportController.getReport);
router.patch(
  "/:reportId/tasks/:taskId",
  authenticate,
  reportController.patchReportTask,
);

export default router;
