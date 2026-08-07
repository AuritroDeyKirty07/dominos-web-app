import express from "express"
import { createConnection } from "./shared/config/db.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/routes/userRoute.js";
import { isAuthMiddleware } from "./shared/middleware/auth-middleware.js";
import { profileRouter } from "./modules/auth/routes/profileRoutes.js";
dotenv.config();

const PORT=5000;

const app=express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1",authRouter);
app.use("/api/v1",profileRouter)


const promise=createConnection();

promise.then((data)=>{

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})

}).catch((err)=>{
console.log(err);
process.exit(0);

})


