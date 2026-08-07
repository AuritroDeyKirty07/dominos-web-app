import express from "express";
import dns from "dns";
dns.setServers(['8.8.8.8', '8.8.4.4']);
import { createConnection } from "./shared/config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./modules/auth/routes/userRoute.js";
import { isAuthMiddleware } from "./shared/middleware/auth-middleware.js";
import { profileRouter } from "./modules/auth/routes/profileRoutes.js";
import deliveryRoutes from "./modules/delivery/routes/delivery.routes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
    origin: true, 
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1", authRouter);
app.use("/api/v1", profileRouter);
app.use("/api/delivery", deliveryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), service: 'Dominos Delivery API' });
});

const promise = createConnection();

promise.then((data) => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.log(err);
    process.exit(0);
});

export default app;
