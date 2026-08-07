import mongoose from "mongoose"
import { seedDatabase } from "./db-seeder.js";

export const createConnection=async()=>{
    try {
        const conn=await mongoose.connect(process.env.DB_URL);
        console.log("DB is connceted",conn.connection.host);
        
        await seedDatabase();
        
        return conn;
    } catch (error) {
       throw error;
        
    }
}