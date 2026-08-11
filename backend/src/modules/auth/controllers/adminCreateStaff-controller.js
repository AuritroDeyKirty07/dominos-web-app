import { logger } from "../../../shared/services/logger.js";
import { changeUserRoleService, changeUserStatusService, createStaffService, getAllRightsService, getAllRolesService, updateRoleRightsService } from "../service/adminCreateStaff-service.js";

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
    // console.error(error);
    logger.error(err);
    return res.status(500).json({
      message: error.message,
      error
    });
  }
};

export const changeUserRoleController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await changeUserRoleService(userId, role);

    return res.status(200).json({
      message: "User role updated successfully",
      user
    });

  } catch (error) {
    logger.error(err);
    return res.status(400).json({
      message: error.message
    });
  }
};


export const changeUserStatusController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await changeUserStatusService(userId, isActive);

    return res.status(200).json({
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      user
    });

  } catch (error) {
    logger.error(err);
    return res.status(400).json({
      message: error.message
    });
  }
};

export const getAllRolesController = async (req, res) => {
  try {
    const roles = await getAllRolesService();

    return res.status(200).json({
      message: "Roles fetched successfully",
      count: roles.length,
      roles
    });
  } catch (error) {
    logger.error(err);
    return res.status(500).json({
      message: error.message
    });
  }
};


export const getAllRightsController = async (req, res) => {
  try {
    const rights = await getAllRightsService();

    return res.status(200).json({
      message: "Rights fetched successfully",
      totalRights: rights.length,
      rights,
    });
  } catch (error) {
    logger.error(err);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateRoleRightsController = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { rights } = req.body;

    const role = await updateRoleRightsService(roleId, rights);

    return res.status(200).json({
      message: "Role rights updated successfully",
      role,
    });
  } catch (error) {
    logger.error(err);
    return res.status(400).json({
      message: error.message,
    });
  }
};