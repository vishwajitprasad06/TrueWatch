import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import SearchBar from "./SearchBar";

function Navbar() {
  const navigate = useNavigate();

  // Current logged in user fetch karein
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : null;

  return (
    <header className="navbar">
      {/* Logo aur Search bar ko ek row me rakhne ke liye left container */}
      <div className="nav-left">
        <div
          className="logo"
          onClick={() => navigate("/")}
          title="TrueWatch Home"
        >
          True<span>Watch</span>
        </div>
      </div>
      
      <SearchBar />

      <nav className="desktop-nav">
        <button onClick={() => navigate("/")}>Home</button>
      </nav>

      <div className="nav-actions">
        <button
          className="icon-btn"
          onClick={() => navigate("/me")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            background: "transparent",
            border: "none",
            cursor: "pointer"
          }}
          title={currentUser ? currentUser.name : "Profile"}
        >
          {currentUser?.profileImage ? (
            <img 
              src={currentUser.profileImage} 
              alt="Profile" 
              style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} 
            />
          ) : userInitial ? (
            <div style={{
              width: "32px",
              height: "32px",
              background: "#e50914",
              color: "white",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "14px"
            }}>
              {userInitial}
            </div>
          ) : (
            <User size={21} />
          )}
        </button>
      </div>
    </header>
  );
}

export default Navbar;