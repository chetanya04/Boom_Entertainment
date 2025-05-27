import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase.ts";
import { useNavigate } from "react-router-dom";
import "./login.css"
import {Link} from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const loginCredentials = await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Login Successful");
      console.log("User:", loginCredentials.user);
      navigate("/home"); 
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="signup-link">
          Don't have an account? <Link to="/register">Signup here</Link>
        </div>
      </div>
    </div>
  );
}
