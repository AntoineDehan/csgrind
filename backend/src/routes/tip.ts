import { Router } from "express";
import * as tipController from "../controllers/tip.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.get("/", authenticate, tipController.getTips);
router.get("/:id", authenticate, tipController.getTip);
router.post("/", authenticate, requireAdmin, tipController.postTip);
router.patch("/:id", authenticate, requireAdmin, tipController.patchTip);
router.delete("/:id", authenticate, requireAdmin, tipController.removeTip);

export default router;
