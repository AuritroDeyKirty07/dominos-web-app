import { verifyToken } from "../services/tokenService.js";

export const isAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.token || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);
   
    if (!token) {
      return res.status(401).json({
        message: "Token not found",
      });
    }
    const decodedPayload = verifyToken(token);
    
    req.userId = decodedPayload.userId;
    
    next();
  } catch (error) {
   return res.status(401).json({
      message: error.message,
    });
  }
};
