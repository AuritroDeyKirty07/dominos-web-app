import { logger } from "../../../shared/services/logger.js";
import { getProfileService, updateProfileService } from "../service/profile-service.js";

export const profileController=async (req,res) => {
   try {
    const userId=req.userId;
    logger.debug("In Profile",userId);
    
    const currentUser=await getProfileService(userId);
    logger.debug(currentUser);
    
    res.status(200).json({currentUser});
   } catch (error) {
    logger.error(err);
    res.status(500).json(error.message)
   }
}

export const updateProfileController = async (req, res) => {
  try {
    const updatedUser = await updateProfileService(
      req.userId,
      req.body
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    logger.error(err);
    return res.status(400).json({
      message: error.message,
    });
  }
};