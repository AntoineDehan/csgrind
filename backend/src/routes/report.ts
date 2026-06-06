import { Router } from "express";
import * as reportController from "../controllers/report.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, reportController.getReports);
router.get("/:id", authenticate, reportController.getReport);
router.post("/", authenticate, reportController.postReport);
router.patch("/:id", authenticate, reportController.patchReport);
router.delete("/:id", authenticate, reportController.removeReport);

export default router;
