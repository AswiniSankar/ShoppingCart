import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Import toast
import "react-toastify/dist/ReactToastify.css"; // ✅ Import CSS for toasts
import "./Auth.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
            const response = await axios.post(
                "http://127.0.0.1:5000/user/signin",
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );
    
    
            if (response.status === 200 && response.data.message === "Sign-in successful!") {
                // Make sure response has name & email
                if (!response.data.name || !response.data.email) {
                    console.error("API is missing name or email!");
                }
    
                const userData = {
                    id: response.data.user_id,  
                    name: response.data.name || "Unknown",  // ✅ Default if missing
                    email: response.data.email || "Not Provided" // ✅ Default if missing
                };
    
    
                login(userData);  
                localStorage.setItem("user", JSON.stringify(userData));
    
                toast.success("Login Successful! Redirecting...", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true
                });
    
                setTimeout(() => {
                    navigate("/checkout");
                }, 1500);
            } else {
                setError("Unexpected response. Please try again.");
            }
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Login failed. Check your credentials.");
        }
    };
    

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Login</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <p>Don't have an account? <span onClick={() => navigate("/signup")}>Sign up</span></p>
        </div>
    );
};

export default Login;
