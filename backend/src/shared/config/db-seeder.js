import { roleModel } from '../../modules/auth/models/user-role.js';

export const seedDatabase = async () => {
    try {

        try {
            await roleModel.collection.dropIndex('rollName_1');
            console.log("[Seeder] Dropped legacy 'rollName_1' index");
        } catch (e) {

        }

        const rolesToSeed = [
            { name: "customer", description: "Default customer role", isSystemRole: true },
            { name: "cook", description: "Kitchen staff role", isSystemRole: true },
            { name: "delivery", description: "Delivery partner role", isSystemRole: true },
            { name: "admin", description: "System administrator", isSystemRole: true }
        ];

        for (const roleData of rolesToSeed) {
            const existingRole = await roleModel.findOne({ name: roleData.name });
            if (!existingRole) {
                await roleModel.create(roleData);
                console.log(`[Seeder] Role '${roleData.name}' created successfully.`);
            }
        }
        
        console.log("[Seeder] Database roles check/seeding completed.");
    } catch (error) {
        console.error("[Seeder] Error while seeding database:", error);
    }
};
