import { Router } from "express";
import * as goalController from "../controllers/goal.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, goalController.getGoals);
router.get("/:id", authenticate, goalController.getGoal);
router.get("/:id/progress", authenticate, goalController.getProgress);
router.get("/:id/stats", authenticate, goalController.getStats);
router.get("/:id/tasks", authenticate, goalController.getTasks);
router.post("/", authenticate, goalController.postGoal);
router.patch("/:id", authenticate, goalController.patchGoal);
router.delete("/:id", authenticate, goalController.removeGoal);

export default router;
