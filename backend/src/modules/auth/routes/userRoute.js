import express from "express"
import { loginController, logoutController, registerController, resetPass } from "../controllers/userController.js";
import { userRoleController } from "../controllers/role-controllers.js";
import { profileController } from "../controllers/userProfile-controllers.js";
import { isAuthMiddleware } from "../../../shared/middleware/auth-middleware.js";
import {changeUserRoleController, changeUserStatusController, createStaffController, getAllRightsController, getAllRolesController, updateRoleRightsController } from "../controllers/adminCreateStaff-controller.js";
import { hasRole } from "../../../shared/middleware/rbac-middleware.js";
import { validatorMiddleware } from "../../../shared/middleware/validator-middleware.js";
import { loginSchema, registerSchema } from "../validator/authValidator.js";


export const authRouter=express.Router();

authRouter.post("/register",validatorMiddleware(registerSchema),registerController);
authRouter.post("/role",userRoleController);
authRouter.post("/login",validatorMiddleware(loginSchema),loginController);
authRouter.get("/logout",logoutController);
authRouter.post("/reset_password", isAuthMiddleware, resetPass);
authRouter.post("/admin/create-staff", isAuthMiddleware, hasRole(['admin']), createStaffController);

authRouter.patch("/admin/users/:userId/role",isAuthMiddleware,hasRole(["admin"]),changeUserRoleController);

authRouter.patch("/admin/users/:userId/status",isAuthMiddleware,hasRole(["admin"]),changeUserStatusController);

authRouter.get("/admin/roles",isAuthMiddleware,hasRole(["admin"]),getAllRolesController);

authRouter.get("/admin/rights",isAuthMiddleware,hasRole(["admin"]),getAllRightsController);

authRouter.patch("/admin/roles/:roleId/rights",isAuthMiddleware,hasRole(["admin"]),updateRoleRightsController);
