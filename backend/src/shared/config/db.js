import mongoose from "mongoose"

export const createConnection=async()=>{
    try {
        const conn=await mongoose.connect(process.env.DB_URL);
        console.log("DB is connceted",conn.connection.host);
        
        return conn;
    } catch (error) {
       throw error;
        
    }
}



