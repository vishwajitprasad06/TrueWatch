import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Watch from "./pages/Watch";
import Me from "./pages/Me";
import Search from "./pages/Search";
import Admin from "./admin/Admin";
import Watchlist from "./pages/Watchlist";
import CustomPage from "./pages/CustomPage";
import { useEffect } from "react";
import PremiumStore from "./pages/PremiumStore";
import WatchHistory from "./pages/WatchHistory";
import Downloads from "./pages/Downloads";
import { NotificationProvider } from "./components/NotificationManager";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute"; // <-- ProtectedRoute import kiya gaya hai

import "./App.css";

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes (Koi bhi access kar sakta hai) */}
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/page/:slug" element={<CustomPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Routes (Sirf logged-in users ke liye) */}
          <Route 
            path="/watch/:id" 
            element={
              <ProtectedRoute>
                <Watch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/me" 
            element={
              <ProtectedRoute>
                <Me />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/watchlist" 
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/premium" 
            element={
              <ProtectedRoute>
                <PremiumStore />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <WatchHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/downloads" 
            element={
              <ProtectedRoute>
                <Downloads />
              </ProtectedRoute>
            } 
          />

          {/* Admin Only Route (Sirf Admin ke liye secure) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;