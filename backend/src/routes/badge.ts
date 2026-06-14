import { Router } from "express";
import * as badgeController from "../controllers/badge.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.get("/", authenticate, badgeController.getBadges);
router.get("/:id", authenticate, badgeController.getBadge);
router.post("/", authenticate, requireAdmin, badgeController.postBadge);
router.patch("/:id", authenticate, requireAdmin, badgeController.patchBadge);
router.delete("/:id", authenticate, requireAdmin, badgeController.removeBadge);

export default router;
