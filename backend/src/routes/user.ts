import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.patch("/:id", userController.patchUser);
router.delete("/:id", userController.removeUser);

export default router;
