import React, { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm"; 
import "./AuthPages.css"; 

export default function LoginPage() {
  const [role, setRole] = useState("user");

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
