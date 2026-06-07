import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import * as steamController from "../controllers/steam.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.me);

router.get("/steam", authenticate, steamController.startSteamLink);
router.get("/steam/return", steamController.steamReturn);

export default router;
