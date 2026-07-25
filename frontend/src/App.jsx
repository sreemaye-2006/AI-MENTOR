import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StudyPlan from "./pages/StudyPlan";
import Interview from "./pages/Interview";
import Motivation from "./pages/Motivation";
import Performance from "./pages/Performance";
import Roadmap from "./pages/Roadmap";
import { useAuthStore } from "./store/authStore";

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: "#0f172a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          }
        }} 
      />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/study-plan" element={isAuthenticated ? <StudyPlan /> : <Navigate to="/login" />} />
        <Route path="/interview" element={isAuthenticated ? <Interview /> : <Navigate to="/login" />} />
        <Route path="/motivation" element={isAuthenticated ? <Motivation /> : <Navigate to="/login" />} />
        <Route path="/performance" element={isAuthenticated ? <Performance /> : <Navigate to="/login" />} />
        <Route path="/roadmap" element={isAuthenticated ? <Roadmap /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;