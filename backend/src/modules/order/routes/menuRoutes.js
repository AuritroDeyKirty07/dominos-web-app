import { Router } from 'express';
import * as menuController from '../controllers/menuController.js';

const router = Router();

router.get('/categories', menuController.getCategories);
router.get('/items', menuController.getMenuItems);
router.get('/items/:id', menuController.getMenuItemById);

export default router;
