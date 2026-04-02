import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login(form);
      navigate(user.role === "admin" ? "/admin" : "/user");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Welcome back</h1>
        <p>Log in to manage your account and orders.</p>

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            minLength={6}
            required
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? "Signing in..." : "Login"}
        </button>

        <div className="auth-footer">
          <span>New here?</span>
          <Link to="/register">Create an account</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
