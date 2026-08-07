import React from "react";
import ResetPasswordForm from "../components/ResetPasswordForm"; 
import "./AuthPages.css"; 

export default function ResetPasswordPage() {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-form-side auth-container" style={{ width: '100%', flex: '1' }}>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
