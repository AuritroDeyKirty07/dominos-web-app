import { getProfileService, updateProfileService } from "../service/profile-service.js";

export const profileController=async (req,res) => {
   try {
    const userId=req.userId;
    console.log("In Profile",userId);
    
    const currentUser=await getProfileService(userId);
    console.log(currentUser);
    
    res.status(200).json({currentUser});
   } catch (error) {
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
    return res.status(400).json({
      message: error.message,
    });
  }
};