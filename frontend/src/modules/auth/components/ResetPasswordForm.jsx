import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import './AuthForms.css';
import axiosInstance from '../../../shared/api/axiosInstance';

const resetSchema = z.object({
  oldPass: z.string().min(1, "Old password is required"),
  newPass: z.string().min(6, "New password must be at least 6 characters"),
});

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetSchema)
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const onSubmit = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await axiosInstance.post('/reset_password', data, { withCredentials: true });
      setSuccessMsg(response.data.message || "Password changed successfully.");
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Password reset failed.');
    }
  };

  return (
    <>
      <div className="auth-card glass-panel" style={{ margin: '0 auto' }}>
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Enter your current and new password</p>
        
        {errorMsg && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{errorMsg}</div>}
        {successMsg && <div style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>{successMsg}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          
          <div className="input-group">
            <label htmlFor="oldPass">Old Password</label>
            <input 
              id="oldPass" 
              type="password" 
              placeholder="Enter old password"
              {...register("oldPass")} 
              className={errors.oldPass ? "input-error" : ""}
            />
            {errors.oldPass && <span className="error-text">{errors.oldPass.message}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="newPass">New Password</label>
            <input 
              id="newPass" 
              type="password" 
              placeholder="Enter new password"
              {...register("newPass")} 
              className={errors.newPass ? "input-error" : ""}
            />
            {errors.newPass && <span className="error-text">{errors.newPass.message}</span>}
          </div>

          <button type="submit" className="primary-btn pulse-hover">
            Change Password
          </button>

          <div className="auth-footer">
            <span style={{ cursor: 'pointer', color: 'var(--primary-color)', textDecoration: 'underline' }} onClick={() => navigate('/profile')}>
              Cancel and go back
            </span>
          </div>

        </form>
      </div>
    </>
  );
}
