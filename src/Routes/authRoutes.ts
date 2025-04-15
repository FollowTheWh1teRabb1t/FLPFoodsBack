import { Router } from "express";
import { loginController, registerController } from "../Controllers/authController";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);

export default router;
