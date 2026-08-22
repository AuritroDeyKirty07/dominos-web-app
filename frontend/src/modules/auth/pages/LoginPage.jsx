import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../shared/store/authStore";
import LoginForm from "../components/LoginForm";  
import "./AuthPages.css"; 

export default function LoginPage() {
  const [role, setRole] = useState("user");
  const { isAuthenticated, role: userRole } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'admin') navigate('/admin', { replace: true });
      else if (userRole === 'cook') navigate('/kitchen', { replace: true });
      else if (userRole === 'delivery') navigate('/delivery', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [isAuthenticated, userRole, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRole = params.get("role");
    if (urlRole) setRole(urlRole.toLowerCase());
  }, []);

  let bannerText = "Fresh Hot Pizza, Delivered.";
  if (role === "cook") bannerText = "Ready to bake some pizza?";
  if (role === "admin") bannerText = "Dominos Admin Portal.";

  return (

    <div className="auth-page-wrapper">
      <div
        className="auth-image-side"
        style={{ backgroundImage: "url('/assets/pizza-banner.jpg')" }}
      >
        <div className="brand-overlay">
          <img
            src="/assets/logo_512.png"
            alt="Dominos"
            className="brand-logo"
          />
          <h1>{bannerText}</h1>
        </div>
      </div>


      <div className="auth-form-side auth-container">
        <LoginForm />
      </div>
    </div>
  );
}
