import { Router } from "express";
import * as badgeController from "../controllers/badge.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, badgeController.getBadges);
router.get("/:id", authenticate, badgeController.getBadge);
router.post("/", authenticate, badgeController.postBadge);
router.patch("/:id", authenticate, badgeController.patchBadge);
router.delete("/:id", authenticate, badgeController.removeBadge);

export default router;
