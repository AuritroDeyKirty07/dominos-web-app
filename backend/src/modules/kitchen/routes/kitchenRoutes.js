import express from "express";

import {
    getOrders,
    startPreparing,
    markReady,
    getReadyOrders
} from "../controllers/kitchenController.js";

import { seedOrders } from "../controllers/seedController.js";
import { isAuthMiddleware } from "../../../shared/middleware/auth-middleware.js";
import { hasRole } from "../../../shared/middleware/rbac-middleware.js";


const router = express.Router();


/* Temporary Testing Route */
router.post("/seed", seedOrders);


/* Kitchen APIs */

router.get("/orders", isAuthMiddleware , hasRole(['cook']),  getOrders);

router.get("/orders/ready",isAuthMiddleware , hasRole(['cook']), getReadyOrders);

router.put("/orders/:id/start-preparing", isAuthMiddleware , hasRole(['cook']), startPreparing);

router.put("/orders/:id/mark-ready", isAuthMiddleware , hasRole(['cook']) , markReady);


export default router;