import express from "express"
import { isAuthMiddleware } from "../../../shared/middleware/auth-middleware.js";
import { profileController, updateProfileController } from "../controllers/userProfile-controllers.js";

export const profileRouter=express.Router()
profileRouter.get("/profile", isAuthMiddleware, profileController);
profileRouter.put("/update_profile", isAuthMiddleware, updateProfileController);
