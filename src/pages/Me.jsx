import BackButton from "../components/BackButton";
import { User, Crown, Coins, History, Download, ShieldPlus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useNotification } from "../components/NotificationManager";

function Me() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  // Current logged in user fetch karein
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const handleLogout = () => {
    localStorage.removeItem("authToken"); // <-- Yeh nayi line jodni hai
    localStorage.removeItem("currentUser"); 
    showNotification("Logged out successfully! 👋", "success");
    navigate("/auth");
    window.location.reload();
  };

  // Agar user login nahi hai toh naam ki jagah default dikhega
  const userName = currentUser ? currentUser.name : "My Profile";
  const userEmail = currentUser ? currentUser.email : "Welcome to TrueWatch";
  const firstLetter = currentUser && currentUser.name ? currentUser.name.charAt(0).toUpperCase() : null;

  return (
    <main className="page">
      <BackButton />

      <div className="profile-header">
        <div className="profile-avatar" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: "bold", background: "#e50914", color: "white" }}>
          {currentUser?.profileImage ? (
            <img src={currentUser.profileImage} alt={userName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : firstLetter ? (
            firstLetter
          ) : (
            <User size={38} />
          )}
        </div>

        <div>
          <h1>{userName}</h1>
          <p>{userEmail}</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Theme Toggle Option */}
        <ThemeToggle />

    {/* Admin Panel Option (Sirf Admin email hone par hi render hoga) */}
            {currentUser?.email === "vishwajitprasad06@gmail.com" && (
              <div className="profile-option" onClick={() => navigate("/admin")}>
                <ShieldPlus color="#e50914" />
                <div>
                  <strong>Admin Panel</strong>
                  <p>Add new movies & shows</p>
                </div>
              </div>
            )}

        <div className="profile-option" onClick={() => navigate("/premium")}>
          <Crown color="#e50914" />
          <div>
            <strong>Get Premium</strong>
            <p>Unlock ad-free experience</p>
          </div>
        </div>

        <div className="profile-option" onClick={() => navigate("/watchlist")}>
          <History color="#e50914" />
          <div>
            <strong>My Watchlist</strong>
            <p>Saved movies & shows</p>
          </div>
        </div>

        <div className="profile-option" onClick={() => navigate("/history")}>
          <History color="#e50914" />
          <div>
            <strong>Watch History</strong>
            <p>Continue watching</p>
          </div>
        </div>

        <div className="profile-option" onClick={() => navigate("/downloads")}>
          <Download color="#e50914" />
          <div>
            <strong>Downloads</strong>
            <p>Premium offline storage</p>
          </div>
        </div>

        {/* Logout Option (Agar logged in hai tabhi dikhega, warna Login ka option dikhega) */}
        {currentUser ? (
          <div className="profile-option" onClick={handleLogout} style={{ borderColor: "#e50914" }}>
            <LogOut color="#e50914" />
            <div>
              <strong style={{ color: "#e50914" }}>Log Out</strong>
              <p>Sign out from your account</p>
            </div>
          </div>
        ) : (
          <div className="profile-option" onClick={() => navigate("/auth")} style={{ borderColor: "#22c55e" }}>
            <User color="#22c55e" />
            <div>
              <strong style={{ color: "#22c55e" }}>Login / Sign Up</strong>
              <p>Access your TrueWatch account</p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default Me;