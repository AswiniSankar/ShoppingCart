import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import AuthContext
import "./Auth.css";
import PopupModal from "./PopupModal"; 

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false); 
    const { login } = useAuth();  // ✅ Get login function
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:5000/user/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                const userData = { name, email };  // ✅ Simulate stored user data
                login(userData);  // ✅ Store user in context
                setShowModal(true);
            } else {
                throw new Error("Signup failed.");
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate("/"); 
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Sign Up</button>
            </form>

            {showModal && <PopupModal message="🎉 Signup Successful!" onClose={handleCloseModal} />}
        </div>
    );
};

export default Signup;
