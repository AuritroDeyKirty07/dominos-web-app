import mongoose from "mongoose"
import { seedDatabase } from "./db-seeder.js";

export const createConnection=async()=>{
    try {
        const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/dominos";
        const conn=await mongoose.connect(dbUrl);
        console.log("DB is connected",conn.connection.host);
        
        await seedDatabase();
        
        return conn;
    } catch (error) {
       throw error;
        
    }
}