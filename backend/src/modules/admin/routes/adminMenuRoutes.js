import { Router } from 'express';
import { MenuItem } from '../../order/models/MenuItem.js';
import { Category } from '../../order/models/Category.js';
import { isAuthMiddleware } from '../../../shared/middleware/auth-middleware.js';
import { hasRole } from '../../../shared/middleware/rbac-middleware.js';

const router = Router();

// ─── GET /api/v1/admin/menu — List ALL menu items (including unavailable) ─────
router.get('/', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};
    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await MenuItem.find(query).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch menu', details: err.message });
  }
});

// ─── GET /api/v1/admin/menu/categories — List all categories ─────────────────
router.get('/categories', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const categories = await Category.find();
    return res.json({ success: true, data: categories });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch categories', details: err.message });
  }
});

// ─── GET /api/v1/admin/menu/:id — Single item by ID ─────────────────────────
router.get('/:id', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    // Support both MongoDB _id and custom string id
    let item = await MenuItem.findById(req.params.id).catch(() => null);
    if (!item) {
      item = await MenuItem.findOne({ id: req.params.id });
    }
    if (!item) {
      return res.status(404).json({ success: false, error: 'Menu item not found.' });
    }
    return res.json({ success: true, data: item });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch menu item', details: err.message });
  }
});

// ─── POST /api/v1/admin/menu — Create a new menu item ───────────────────────
router.post('/', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const { name, description, image, category, price, isVeg, isCustomizable, isBestseller, rating, badge, customizationOptions } = req.body;

    if (!name || String(name).trim() === '') {
      return res.status(400).json({ success: false, error: 'Item name is required.' });
    }
    if (!category) {
      return res.status(400).json({ success: false, error: 'Category is required.' });
    }
    if (price === undefined || price === null || Number(price) <= 0) {
      return res.status(400).json({ success: false, error: 'Valid price is required.' });
    }

    // Generate unique string id
    const itemId = `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Duplicate check
    const existing = await MenuItem.findOne({ name: { $regex: `^${String(name).trim()}$`, $options: 'i' } });
    if (existing) {
      return res.status(409).json({ success: false, error: `An item named "${name}" already exists.` });
    }

    const newItem = await MenuItem.create({
      id: itemId,
      name: String(name).trim(),
      description: description || '',
      image: image || '',
      category: category,
      price: Number(price),
      isVeg: isVeg !== undefined ? Boolean(isVeg) : true,
      isCustomizable: isCustomizable !== undefined ? Boolean(isCustomizable) : true,
      isBestseller: isBestseller !== undefined ? Boolean(isBestseller) : false,
      rating: rating || 4.5,
      badge: badge || null,
      customizationOptions: customizationOptions || {
        sizes: [
          { name: 'Regular', serves: 'Serves 1', priceMultiplier: 1, basePrice: Number(price) },
          { name: 'Medium', serves: 'Serves 2', priceMultiplier: 1.5, basePrice: Math.round(Number(price) * 1.5) },
          { name: 'Large', serves: 'Serves 4', priceMultiplier: 2, basePrice: Math.round(Number(price) * 2) },
        ],
        crusts: [],
        toppings: [],
        addOns: [],
      },
    });

    return res.status(201).json({
      success: true,
      message: `"${newItem.name}" added to the menu successfully.`,
      data: newItem,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'An item with this name already exists.' });
    }
    return res.status(500).json({ success: false, error: 'Failed to create menu item', details: err.message });
  }
});

// ─── PATCH /api/v1/admin/menu/:id — Update menu item ────────────────────────
router.patch('/:id', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const updates = {};
    const { name, description, image, category, price, isVeg, isCustomizable, isBestseller, rating, badge, customizationOptions } = req.body;

    if (name !== undefined) {
      if (String(name).trim() === '') {
        return res.status(400).json({ success: false, error: 'Item name cannot be empty.' });
      }
      updates.name = String(name).trim();
    }
    if (description !== undefined) updates.description = String(description).trim();
    if (image !== undefined) updates.image = String(image).trim();
    if (category !== undefined) updates.category = category;
    if (price !== undefined) {
      const p = Number(price);
      if (isNaN(p) || p <= 0) return res.status(400).json({ success: false, error: 'Price must be a positive number.' });
      updates.price = p;
    }
    if (isVeg !== undefined) updates.isVeg = Boolean(isVeg);
    if (isCustomizable !== undefined) updates.isCustomizable = Boolean(isCustomizable);
    if (isBestseller !== undefined) updates.isBestseller = Boolean(isBestseller);
    if (rating !== undefined) updates.rating = Number(rating);
    if (badge !== undefined) updates.badge = badge;
    if (customizationOptions !== undefined) updates.customizationOptions = customizationOptions;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No update fields provided.' });
    }

    // Support both MongoDB _id and custom string id
    let updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).catch(() => null);

    if (!updated) {
      updated = await MenuItem.findOneAndUpdate(
        { id: req.params.id },
        { $set: updates },
        { new: true, runValidators: true }
      );
    }

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Menu item not found.' });
    }

    return res.json({
      success: true,
      message: `"${updated.name}" updated successfully.`,
      data: updated,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'An item with this name already exists.' });
    }
    return res.status(500).json({ success: false, error: 'Failed to update menu item', details: err.message });
  }
});

// ─── DELETE /api/v1/admin/menu/:id — Soft-delete (remove from DB) ────────────
router.delete('/:id', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    let item = await MenuItem.findById(req.params.id).catch(() => null);
    if (!item) {
      item = await MenuItem.findOne({ id: req.params.id });
    }
    if (!item) {
      return res.status(404).json({ success: false, error: 'Menu item not found.' });
    }

    await MenuItem.deleteOne({ _id: item._id });

    return res.json({
      success: true,
      message: `"${item.name}" has been removed from the menu.`,
      data: { id: item._id, name: item.name },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete menu item', details: err.message });
  }
});

export default router;
