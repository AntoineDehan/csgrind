import { Router } from "express";
import * as tipController from "../controllers/tip.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, tipController.getTips);
router.get("/:id", authenticate, tipController.getTip);
router.post("/", authenticate, tipController.postTip);
router.patch("/:id", authenticate, tipController.patchTip);
router.delete("/:id", authenticate, tipController.removeTip);

export default router;
