import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  const accountPath = user ? (user.role === "admin" ? "/admin" : "/user") : "/login";
  const accountLabel = user ? (user.role === "admin" ? "Admin" : "Account") : "Sign in";

  const tabs = [
    { label: "Home", to: "/" },
    { label: "Catalog", to: "/catalog" },
    { label: accountLabel, to: accountPath }
  ];

  return (
    <nav className="global-tabbar" aria-label="Main tabs">
      {tabs.map((tab) => {
        const isActive =
          tab.to === "/"
            ? location.pathname === "/"
            : location.pathname === tab.to || location.pathname.startsWith(`${tab.to}/`);

        return (
          <Link key={tab.label} className={`global-tab ${isActive ? "active" : ""}`} to={tab.to}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
