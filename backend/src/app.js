import express from "express";
import dns from "dns";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import { createConnection } from "./shared/config/db.js";

import { authRouter } from "./modules/auth/routes/userRoute.js";
import { profileRouter } from "./modules/auth/routes/profileRoutes.js";
import kitchenRoutes from "./modules/kitchen/routes/kitchenRoutes.js";
import deliveryRoutes from "./modules/delivery/routes/delivery.routes.js";
import orderRouter from "./modules/order/routes/index.js";
import adminRouter from "./modules/admin/routes/index.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRouter);
app.use("/api/v1", profileRouter);

app.use("/api/delivery", deliveryRoutes);
app.use("/api/kitchen", kitchenRoutes);
app.use("/api/v1", orderRouter);
app.use("/api/v1/admin", adminRouter);

try {
    await createConnection();
    console.log("Database connected successfully");
} catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
}

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;