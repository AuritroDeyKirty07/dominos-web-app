import { Router } from 'express';
import { Employee } from '../models/Employee.js';
import { isAuthMiddleware } from '../../../shared/middleware/auth-middleware.js';
import { hasRole } from '../../../shared/middleware/rbac-middleware.js';

const router = Router();

// ─── GET /api/v1/admin/employees ─────────────────────────────────────────────
router.get('/', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const { role, status } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const employees = await Employee.find(filter).sort({ joinedAt: -1 });
    return res.json({ success: true, count: employees.length, data: employees });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch employees', details: err.message });
  }
});

// ─── GET /api/v1/admin/employees/:id ─────────────────────────────────────────
router.get('/:id', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const employee = await Employee.findOne({ id: Number(req.params.id) });
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
    return res.json({ success: true, data: employee });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch employee', details: err.message });
  }
});

// ─── POST /api/v1/admin/employees ────────────────────────────────────────────
router.post('/', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const {
      name, role, status = 'Active', phone = '', email = '',
      specialty = 'General', shift = 'Morning',
      vehicleType = 'Bike', vehicleNumber = '',
      rating = 4.8, ordersHandled = 0,
    } = req.body;

    if (!name || !role) {
      return res.status(400).json({ success: false, error: 'Name and role are required fields.' });
    }

    // Generate incremental id
    let newId = req.body.id;
    if (!newId) {
      const lastEmp = await Employee.findOne().sort({ id: -1 });
      newId = lastEmp ? lastEmp.id + 1 : 1;
    }

    const newEmployee = new Employee({
      id: newId, name, role, status, phone, email,
      specialty, shift, vehicleType, vehicleNumber,
      rating, ordersHandled,
      joinedAt: req.body.joinedAt || new Date(),
    });

    const saved = await newEmployee.save();
    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to create employee', details: err.message });
  }
});

// ─── PUT /api/v1/admin/employees/:id ─────────────────────────────────────────
router.put('/:id', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const updated = await Employee.findOneAndUpdate(
      { id: targetId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update employee', details: err.message });
  }
});

// ─── DELETE /api/v1/admin/employees/:id ──────────────────────────────────────
router.delete('/:id', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const deleted = await Employee.findOneAndDelete({ id: targetId });
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    return res.json({ success: true, message: `Employee #${targetId} deleted successfully.` });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete employee', details: err.message });
  }
});

export default router;
