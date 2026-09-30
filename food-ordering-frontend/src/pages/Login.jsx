import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login as loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser(email, password);

      const token = response.data.data.token;

      await login(token);

      const from = location.state?.from;

      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid email or password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeOwner = () => {
    navigate("/become-owner");
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-brand">
          <div className="login-brand-icon">
            🍴
          </div>

          <div>
            <h1>
              Food<span>Hub</span>
            </h1>

            <p>Good food is just a login away.</p>
          </div>
        </div>

        <div className="login-card">
          <h2>Welcome back</h2>

          <p className="login-subtitle">
            Sign in to continue ordering your favorite food.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>
        </div>

        <div className="login-owner-link">
          <span>
            Want to become a restaurant owner?
          </span>

          <button
            type="button"
            onClick={handleBecomeOwner}
          >
            Apply now
          </button>
        </div>

        <p className="login-footer">
          Delicious meals. Simple ordering. FoodHub.
        </p>

      </div>
    </div>
  );
}

export default Login;