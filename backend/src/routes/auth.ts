import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import * as steamController from "../controllers/steam.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { loginLimiter, authLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

router.post("/register", authLimiter, authController.register);
router.post("/login", loginLimiter, authController.login);
router.get("/me", authenticate, authController.me);

router.get("/steam", authenticate, steamController.startSteamLink);
router.get("/steam/return", steamController.steamReturn);

export default router;
