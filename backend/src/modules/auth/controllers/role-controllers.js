import { logger } from "../../../shared/services/logger.js";
import { userRoleService } from "../service/role-service.js";



export const userRoleController = async (request,response) =>{
    const userRole = request.body;

    
    try{
        const result = await userRoleService(userRole);
        response.status(200).json({result});
    }
    catch(err){
        // console.log('Error is ',err);
        logger.error(err);
        response.status(500).json({error: err});
    }
}