import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("authToken");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // 1. Agar user logged in hi nahi hai, toh auth page par bhej do
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // 2. Agar page sirf Admin ke liye hai, toh check karo ki user admin hai ya nahi
  // (Yahan aap apni email ya role ke hisab se condition laga sakte hain)
  if (adminOnly) {
    const adminEmail = "vishwajitprasad06@gmail.com"; // Aap yahan apni admin email daal sakte hain
    if (currentUser?.email !== adminEmail) {
      alert("⚠️ Access Denied! Only Admin can access this page.");
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;