// src/components/forms/AddRoleModal.jsx
import React, { useState } from 'react';
import { EMPLOYEE_ROLES } from '../../shared/constants/theme';
import { submitRoleRequest } from '../../controllers/employeeController';

export default function AddRoleModal({ isOpen, onClose, onSuccess }) {
  const [role, setRole] = useState(EMPLOYEE_ROLES[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResponseMsg(null);
    try {
      const res = await submitRoleRequest(role, notes);
      setResponseMsg({ type: 'success', text: res.message || 'Role request dispatched successfully!' });
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setResponseMsg(null);
        onClose();
      }, 1500);
    } catch (err) {
      setResponseMsg({ type: 'error', text: err.message || 'Failed to dispatch role request to Registration Service.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-fade-in">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">Request New Employee Role</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          This sends a role creation payload to the Registration Team service.
        </p>

        {responseMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              responseMsg.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-600 border border-red-500/20'
            }`}
          >
            {responseMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
            >
              {EMPLOYEE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
              Additional Notes
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Specify requirements or branch allocation..."
              className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Sending Request...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
