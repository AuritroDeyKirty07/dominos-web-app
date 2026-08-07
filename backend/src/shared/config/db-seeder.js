import { rightModel } from "../../modules/auth/models/right-model.js";
import { roleModel } from "../../modules/auth/models/user-role.js";


export const seedDatabase = async () => {
  try {

    const rightsToSeed = [
      {
        code: "profile.read",
        module: "profile",
        description: "Can view profile",
      },
      {
        code: "profile.update",
        module: "profile",
        description: "Can update profile",
      },
      {
        code: "user.create",
        module: "user",
        description: "Can create users",
      },
      {
        code: "user.update",
        module: "user",
        description: "Can update users",
      },
      {
        code: "user.status",
        module: "user",
        description: "Can activate/deactivate users",
      },
      {
        code: "role.update",
        module: "role",
        description: "Can change user role",
      },
      {
        code: "rights.update",
        module: "role",
        description: "Can assign rights",
      },
    ];

    for (const rightData of rightsToSeed) {
      const existingRight = await rightModel.findOne({
        code: rightData.code,
      });

      if (!existingRight) {
        await rightModel.create(rightData);
        console.log(`[Seeder] Right '${rightData.code}' created successfully.`);
      }
    }

    console.log("[Seeder] Rights seeding completed.");

    const rolesToSeed = [
      {
        name: "customer",
        description: "Default customer role",
        isSystemRole: true,
      },
      {
        name: "cook",
        description: "Kitchen staff role",
        isSystemRole: true,
      },
      {
        name: "delivery",
        description: "Delivery partner role",
        isSystemRole: true,
      },
      {
        name: "admin",
        description: "System administrator",
        isSystemRole: true,
      },
    ];

    for (const roleData of rolesToSeed) {
      const existingRole = await roleModel.findOne({
        name: roleData.name,
      });

      if (!existingRole) {
        await roleModel.create(roleData);
        console.log(`[Seeder] Role '${roleData.name}' created successfully.`);
      }
    }

    console.log("[Seeder] Database seeding completed.");

  } catch (error) {
    console.error("[Seeder] Error while seeding database:", error);
  }
};