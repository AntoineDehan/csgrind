import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.get("/", authenticate, requireAdmin, userController.getUsers);
router.get("/me/badges", authenticate, userController.getUserBadges);
router.get("/:id", authenticate, userController.getUser);
router.patch("/:id", authenticate, userController.patchUser);
router.delete("/:id", authenticate, userController.removeUser);

export default router;
