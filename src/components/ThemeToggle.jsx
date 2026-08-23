import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div 
      className="profile-option" 
      onClick={toggleTheme} 
      style={{ 
        cursor: "pointer", 
        display: "flex", 
        alignItems: "center", 
        gap: "15px", 
        background: "var(--card-bg, #171717)",
        color: "var(--text-color, white)",
        padding: "16px 20px",
        borderRadius: "10px",
        border: "1px solid var(--border-color, #292929)"
      }}
    >
      <div style={{ fontSize: "24px" }}>{theme === "dark" ? "🌙" : "☀️"}</div>
      <div>
        <strong style={{ fontSize: "15px", display: "block" }}>Appearance Theme</strong>
        <p style={{ fontSize: "13px", color: "var(--text-muted, #888)", margin: "2px 0 0 0" }}>
          Current: {theme === "dark" ? "Dark Mode" : "Light Mode"} (Click to switch)
        </p>
      </div>
    </div>
  );
}

export default ThemeToggle;