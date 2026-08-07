import express from "express"
import { loginController, logoutController, registerController, resetPass } from "../controllers/userController.js";
import { userRoleController } from "../controllers/role-controllers.js";
import { profileController } from "../controllers/userProfile-controllers.js";
import { isAuthMiddleware } from "../../../shared/middleware/auth-middleware.js";
import { createStaffController } from "../controllers/adminCreateStaff-controller.js";
import { hasRole } from "../../../shared/middleware/rbac-middleware.js";

export const authRouter=express.Router();

authRouter.post("/register",registerController);
authRouter.post("/role",userRoleController);
authRouter.post("/login",loginController);
authRouter.get("/logout",logoutController);
authRouter.post("/reset_password", isAuthMiddleware, resetPass);
authRouter.post("/admin/create-staff", isAuthMiddleware, hasRole(['admin']), createStaffController);
