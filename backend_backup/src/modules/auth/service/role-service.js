import { roleModel } from "../models/user-role.js";



export const userRoleService = async(roleData) =>{
    if(typeof(roleData)=='string'){
         let role = await roleModel.findOne({
            name: roleData
        });

        if (!role) {
            role = await roleModel.create({
                name: roleData
            });
        }

        return role;
    }

     let role = await roleModel.findOne({
        name: roleData.name || roleData.rollName
    });

    if(role)return role;

    return await roleModel.create({
        name: roleData.name || roleData.rollName,
        description: roleData.description,
        rights: roleData.rights || [],
        
    })
}