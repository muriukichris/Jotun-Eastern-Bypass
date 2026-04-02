import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const user = await register(form);
      navigate(user.role === "admin" ? "/admin" : "/user");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Create your account</h1>
        <p>Minimum password length is 6 characters.</p>
        <div className="auth-blurb">
          <p>Join a community of storytellers and discover fresh ideas every day.</p>
          <ul className="auth-points">
            <li>Save drafts and refine them over time.</li>
            <li>Get curated prompts to spark new plots.</li>
            <li>Share your stories with friends or keep them private.</li>
          </ul>
        </div>

        <label>
          Full name
          <input name="name" value={form.name} onChange={onChange} required />
        </label>

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
          {busy ? "Creating..." : "Register"}
        </button>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
