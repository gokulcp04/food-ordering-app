import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoginPage = location.pathname === "/login";

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (user?.role === "ADMIN") {
      return "/admin";
    }

    if (user?.role === "RESTAURANT_OWNER") {
      return "/owner";
    }

    return "/";
  };

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-brand"
          onClick={closeMobileMenu}
        >
          <span className="navbar-logo">🍴</span>

          <span className="navbar-title">
            Food<span>Hub</span>
          </span>
        </Link>

        <nav className="navbar-links">
          <Link to="/">Home</Link>

          {isAuthenticated && user?.role === "CUSTOMER" && (
            <>
              <Link to="/orders">My Orders</Link>
              <Link to="/cart">Cart</Link>
            </>
          )}

          {isAuthenticated &&
            user?.role === "RESTAURANT_OWNER" && (
              <>
                <Link to="/owner">Dashboard</Link>
                <Link to="/owner/menu">Menu</Link>
                <Link to="/owner/orders">Orders</Link>
              </>
            )}

          {isAuthenticated && user?.role === "ADMIN" && (
            <Link to="/admin">Admin Dashboard</Link>
          )}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath()}
                className="navbar-user"
              >
                <span className="navbar-user-icon">👤</span>

                <span>
                  {user?.name || "Account"}
                </span>
              </Link>

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            !isLoginPage && (
              <Link
                to="/login"
                className="navbar-login"
              >
                Login
              </Link>
            )
          )}

          <button
            type="button"
            className="navbar-menu-toggle"
            onClick={() =>
              setIsMobileMenuOpen((current) => !current)
            }
            aria-label={
              isMobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="navbar-mobile-menu">
          <Link to="/" onClick={closeMobileMenu}>
            Home
          </Link>

          {isAuthenticated && user?.role === "CUSTOMER" && (
            <>
              <Link to="/orders" onClick={closeMobileMenu}>
                My Orders
              </Link>

              <Link to="/cart" onClick={closeMobileMenu}>
                Cart
              </Link>
            </>
          )}

          {isAuthenticated &&
            user?.role === "RESTAURANT_OWNER" && (
              <>
                <Link to="/owner" onClick={closeMobileMenu}>
                  Dashboard
                </Link>

                <Link to="/owner/menu" onClick={closeMobileMenu}>
                  Menu
                </Link>

                <Link
                  to="/owner/orders"
                  onClick={closeMobileMenu}
                >
                  Orders
                </Link>
              </>
            )}

          {isAuthenticated && user?.role === "ADMIN" && (
            <Link to="/admin" onClick={closeMobileMenu}>
              Admin Dashboard
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              onClick={closeMobileMenu}
            >
              My Account
            </Link>
          )}

          {isAuthenticated && (
            <button
              type="button"
              className="navbar-mobile-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

          {!isAuthenticated && !isLoginPage && (
            <Link
              to="/login"
              onClick={closeMobileMenu}
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

export default Navbar;