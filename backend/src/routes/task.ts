import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.get("/", authenticate, taskController.getTasks);
router.get("/:id", authenticate, taskController.getTask);
router.post("/", authenticate, requireAdmin, taskController.postTask);
router.patch("/:id", authenticate, requireAdmin, taskController.patchTask);
router.delete("/:id", authenticate, requireAdmin, taskController.removeTask);

export default router;
