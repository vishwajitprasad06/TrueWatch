import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { Eye, EyeOff } from "lucide-react"; // Icon ke liye

function Auth() {
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Signup, "forgot" = Forgot Password
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Password 1 second ke liye show karne ka state
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const API_URL = `${API_BASE}/api/auth`;

  // 1 Second ke liye password dikhane ka function
  const handleTogglePassword = () => {
    setShowPassword(true);
    setTimeout(() => {
      setShowPassword(false);
    }, 1000); // 1000ms = 1 second
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (!email || (!isLogin && isLogin !== "forgot" && !name) || (isLogin !== "forgot" && !password)) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      if (isLogin === "forgot") {
        // --- FORGOT PASSWORD API / SIMULATION ---
        alert(`Password reset link has been sent to ${email}! (Check your inbox) 📧`);
        setIsLogin(true);
        return;
      }

      if (isLogin) {
        // --- LOGIN API REQUEST ---
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("currentUser", JSON.stringify(data.user));

          alert(`Welcome back, ${data.user.name}! 🎉`);
          navigate("/");
          window.location.reload();
        } else {
          alert(data.message || "Invalid email or password!");
        }
      } else {
        // --- SIGNUP API REQUEST ---
        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Account created successfully! Please login. 🚀");
          setIsLogin(true);
          setPassword("");
        } else {
          alert(data.message || "Registration failed!");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Server connection error! Make sure backend is running.");
    }
  };

  return (
    <div style={pageContainerStyle}>
      <div style={overlayStyle} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "420px", padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <BackButton />
        </div>

        <div style={formCardStyle}>
          <div style={{ textAlign: "center", marginBottom: "25px" }}>
            <h1 style={{ color: "#e50914", fontSize: "28px", fontWeight: "900", letterSpacing: "1px", marginBottom: "8px" }}>
              True<span style={{ color: "white" }}>Watch</span>
            </h1>
            <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>
              {isLogin === true ? "Sign in to your account to continue" : isLogin === false ? "Create an account to start streaming" : "Reset your account password"}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {isLogin === false && (
              <div style={inputGroup}>
                <label style={labelStyle}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Vishwajit" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  style={inputStyle} 
                />
              </div>
            )}

            <div style={inputGroup}>
              <label style={labelStyle}>Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={inputStyle} 
              />
            </div>

            {isLogin !== "forgot" && (
              <div style={inputGroup}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ ...inputStyle, width: "100%", paddingRight: "45px" }} 
                  />
                  {/* 1 second ke liye password dikhane wala button/icon */}
                  <button
                    type="button"
                    onMouseDown={handleTogglePassword}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "transparent",
                      border: "none",
                      color: "#aaa",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                    title="Hold/Click to view for 1 sec"
                  >
                    {showPassword ? <Eye size={20} color="#e50914" /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password Link (Only in Login mode) */}
            {isLogin === true && (
              <div style={{ textAlign: "right", marginTop: "-6px" }}>
                <span 
                  onClick={() => setIsLogin("forgot")} 
                  style={{ color: "#aaa", fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}
                >
                  Forgot password?
                </span>
              </div>
            )}

            <button type="submit" style={submitBtnStyle}>
              {isLogin === true ? "Sign In" : isLogin === false ? "Sign Up" : "Send Reset Link"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "25px" }}>
            <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>
              {isLogin === "forgot" ? (
                <span onClick={() => setIsLogin(true)} style={{ color: "#fff", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }}>
                  Back to Sign In
                </span>
              ) : isLogin === true ? (
                <>
                  New to TrueWatch?{" "}
                  <span onClick={() => setIsLogin(false)} style={{ color: "#fff", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }}>
                    Sign up now
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span onClick={() => setIsLogin(true)} style={{ color: "#fff", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }}>
                    Sign in
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const pageContainerStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  background: `url('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.95))",
  backdropFilter: "blur(4px)",
  zIndex: 1,
};

const formCardStyle = {
  background: "rgba(18, 18, 20, 0.85)",
  backdropFilter: "blur(16px)",
  padding: "40px 30px",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.9)",
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const labelStyle = {
  fontSize: "13px",
  color: "#ccc",
  fontWeight: "500",
};

const inputStyle = {
  background: "rgba(0, 0, 0, 0.6)",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "14px",
  color: "white",
  fontSize: "15px",
  outline: "none",
};

const submitBtnStyle = {
  background: "#e50914",
  color: "white",
  padding: "14px",
  borderRadius: "8px",
  fontWeight: "bold",
  border: "none",
  fontSize: "16px",
  marginTop: "10px",
  cursor: "pointer",
};

export default Auth;