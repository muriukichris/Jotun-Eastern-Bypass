import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import BottomNav from "./components/BottomNav";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserHome from "./pages/user/Home";
import AdminDashboard from "./pages/admin/Dashboard";
import Landing from "./pages/public/Landing";
import Catalog from "./pages/public/Catalog";

const AccountRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
};

const AppContent = () => {
  const location = useLocation();
  const showGlobalTabs =
    location.pathname !== "/user" &&
    !location.pathname.startsWith("/admin") &&
    location.pathname !== "/account";
  const useCompactGlobalTabs = showGlobalTabs;

  return (
    <div
      className={`${showGlobalTabs ? "app-with-global-tabs" : ""} ${
        useCompactGlobalTabs ? "landing-tabs-compact" : ""
      }`.trim()}
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/account" element={<AccountRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/user" element={<UserHome />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showGlobalTabs && <BottomNav />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
