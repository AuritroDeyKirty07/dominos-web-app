import { createStaffService } from "../service/adminCreateStaff-service.js";

export const createStaffController = async (req, res) => {
  try {
    const staffData = req.body;
    
    if (req.query.role) {
      staffData.role = req.query.role;
    }

    const staff = await createStaffService(staffData);

    return res.status(201).json({
      message: "Staff registered successfully. Awaiting admin verification.",
      user: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staffData.role,
        isActive: staff.isActive
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
      error
    });
  }
};
