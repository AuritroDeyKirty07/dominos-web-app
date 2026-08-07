import { userModel } from "../../modules/auth/models/user-model.js";

export const hasRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;
            
            if (!userId) {
                return res.status(401).json({ message: "User not authenticated" });
            }

            const user = await userModel.findById(userId).populate('roleId');
            
            if (!user || !user.roleId) {
                return res.status(403).json({ message: "Forbidden: Role not assigned" });
            }

            if (!allowedRoles.includes(user.roleId.name)) {
                return res.status(403).json({ message: "Forbidden: You don't have the required role" });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const hasRight = (requiredRight) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({ message: "User not authenticated" });
            }

            const user = await userModel.findById(userId).populate({
                path: 'roleId',
                populate: { path: 'rights' }
            });

            if (!user || !user.roleId) {
                return res.status(403).json({ message: "Forbidden: Role not assigned" });
            }

            if (user.roleId.isSystemRole && user.roleId.name === 'admin') {
                return next();
            }

            const rights = user.roleId.rights || [];
            const hasAccess = rights.some(r => r.code === requiredRight);

            if (!hasAccess) {
                return res.status(403).json({ message: "Forbidden: You don't have the required rights" });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
