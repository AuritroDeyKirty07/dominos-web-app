import { logger } from "../services/logger.js";

export const validatorMiddleware=(schema)=>{
  return (req,res,next)=>{
   const result=schema.safeParse(req.body);
    if (!result.success) {
      logger.error(result.error);
      const firstError = result.error.errors?.[0]?.message || "Validation failed";
      return res.status(400).json({ message: firstError, errors: result.error.errors });
    }

    req.body = result.data;
    next();
  }
}