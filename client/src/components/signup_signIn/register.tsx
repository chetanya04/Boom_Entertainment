
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase.ts";
import "./register.css"
import {Link} from "react-router-dom" 
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("User registered successfully");
      console.log("User:", userCredential.user);
      navigate("/login");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Register</h1>
        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="register-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register-input"
            />
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}
