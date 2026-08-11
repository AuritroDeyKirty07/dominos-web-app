import { logger } from "../services/logger.js";

export const validatorMiddleware=(schema)=>{
  return (req,res,next)=>{
   const result=schema.safeParse(req.body);
   if(!result.success){
    //  console.log(result.error.message);
    logger.error(result.error);
    return res.status(500).json({message:"validation error",error:result.error.message})
   }

    req.body = result.data;
    next();
  }
}