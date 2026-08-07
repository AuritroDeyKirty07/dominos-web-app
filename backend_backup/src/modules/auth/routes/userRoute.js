import express from "express"
import { loginController, logoutController, registerController } from "../controllers/userController.js";
import { userRoleController } from "../controllers/role-controllers.js";
import { profileController } from "../controllers/userProfile-controllers.js";
import { isAuthMiddleware } from "../../../shared/middleware/auth-middleware.js";

export const authRouter=express.Router();

authRouter.post("/register",registerController);
authRouter.post("/role",userRoleController);
authRouter.post("/login",loginController);
authRouter.get("/logout",logoutController)
