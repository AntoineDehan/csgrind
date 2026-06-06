import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, taskController.getTasks);
router.get("/:id", authenticate, taskController.getTask);
router.post("/", authenticate, taskController.postTask);
router.patch("/:id", authenticate, taskController.patchTask);
router.delete("/:id", authenticate, taskController.removeTask);

export default router;
