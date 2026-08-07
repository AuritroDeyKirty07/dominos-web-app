import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import "./AuthForms.css";
import axiosInstance from "../../../shared/api/axiosInstance";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(10, "Phone number is required"),
    password: z
      .string()
      .min(6, "Minimum 6 characters")
      .regex(/[a-z]/, "Must contain 1 lowercase character")
      .regex(/[A-Z]/, "Must contain 1 uppercase character")
      .regex(/[0-9]/, "Must contain 1 numeric character")
      .regex(/[@$!.()%^*'";:]/, "Must contain 1 special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const [role, setRole] = useState("user");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRole = params.get("role");
    if (urlRole) setRole(urlRole.toLowerCase());
  }, []);

  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);
  const subtitleText =
    role === "user"
      ? "Create an account to order fresh pizza"
      : "Join the Dominos team";

  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data) => {
    setErrorMsg("");
    try {
      const { confirmPassword, ...registerData } = data;

      const roleQuery = role === "user" ? "customer" : role;
      const payload = { ...registerData, role: roleQuery };

      console.log("Submitting Registration Data:", payload);

      await axiosInstance.post("/register", payload);

      navigate(`/login?role=${roleQuery}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <>
      <div className="auth-card glass-panel">
        <h2 className="auth-title">Register as {displayRole}</h2>
        <p className="auth-subtitle">{subtitleText}</p>

        {errorMsg && (
          <div
            style={{ color: "red", textAlign: "center", marginBottom: "10px" }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              {...register("name")}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && (
              <span className="error-text">{errors.name.message}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <span className="error-text">{errors.email.message}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="text"
              placeholder="Enter your phone number"
              {...register("phone")}
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && (
              <span className="error-text">{errors.phone.message}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              {...register("password")}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <span className="error-text">{errors.password.message}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "input-error" : ""}
            />
            {errors.confirmPassword && (
              <span className="error-text">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button type="submit" className="primary-btn pulse-hover">
            Sign Up
          </button>

          <div className="auth-footer">
            <span>
              Already have an account?{" "}
              <Link to={`/login${window.location.search}`}>Log in</Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
}
