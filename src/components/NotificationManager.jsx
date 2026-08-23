import { useState, useEffect, createContext, useContext } from "react";
import { Bell, CheckCircle, AlertCircle, X } from "lucide-react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (title, message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, title, message, type }]);

    // 4 seconds baad notification automatically remove ho jayegi
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {/* Notification Toast Container */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
        {notifications.map((n) => (
          <div 
            key={n.id}
            style={{
              background: "var(--card-bg, #171717)",
              color: "var(--text-color, white)",
              border: "1px solid var(--border-color, #292929)",
              padding: "14px 18px",
              borderRadius: "10px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              minWidth: "280px",
              animation: "slideIn 0.3s ease"
            }}
          >
            {n.type === "success" ? <CheckCircle size={20} color="#22c55e" /> : <AlertCircle size={20} color="#e50914" />}
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: "14px", display: "block" }}>{n.title}</strong>
              <p style={{ fontSize: "12px", color: "var(--text-secondary, #aaa)", margin: "2px 0 0 0" }}>{n.message}</p>
            </div>
            <button 
              onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
              style={{ background: "none", border: "none", color: "var(--text-secondary, #aaa)", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);