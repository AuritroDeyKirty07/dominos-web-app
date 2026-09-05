import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForms.css';
import axiosInstance from '../../../shared/api/axiosInstance';
import { useAuthStore } from '../../../shared/store/authStore';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const [role, setRole] = useState('user');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRole = params.get('role'); 
    if (urlRole) setRole(urlRole.toLowerCase()); 
  }, []);

  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  const loginStore = useAuthStore((state) => state.login);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      console.log("Login Payload:", data);
      const response = await axiosInstance.post('/login', data, { withCredentials: true });
      const { token, user } = response.data;
      
      loginStore(user, token);
      
      const roleName = user.roleId?.name || user.role;
      if (roleName === 'admin') navigate('/admin');
      else if (roleName === 'cook') navigate('/kitchen');
      else if (roleName === 'delivery') navigate('/delivery');
      else navigate('/');

    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <>
      <div className="auth-card glass-panel">
        <h2 className="auth-title">Login as {displayRole}</h2>
        <p className="auth-subtitle">Access your Dominos account</p>
        
        {errorMsg && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{"Wrong Email or Password"}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              placeholder="Enter your email"
              {...register("email")} 
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              placeholder="Enter your password"
              {...register("password")} 
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <button type="submit" className="primary-btn pulse-hover">
            Login
          </button>

          <div className="auth-footer">
            <span>Don't have an account? <Link to={`/register${window.location.search}`}>Sign up</Link></span>
          </div>

        </form>
      </div>
    </>
  );
}
