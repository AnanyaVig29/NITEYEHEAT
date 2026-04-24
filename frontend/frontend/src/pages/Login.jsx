import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const ENV_LOGIN_EMAIL = import.meta.env.VITE_LOGIN_EMAIL || "";
const ENV_LOGIN_PASSWORD = import.meta.env.VITE_LOGIN_PASSWORD || "";

export default function Login() {
  const [form, setForm] = useState({ email: ENV_LOGIN_EMAIL, password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (ENV_LOGIN_EMAIL && ENV_LOGIN_PASSWORD) {
        const isValidEnvLogin =
          form.email === ENV_LOGIN_EMAIL && form.password === ENV_LOGIN_PASSWORD;

        if (isValidEnvLogin) {
          localStorage.setItem("token", "env-login-token");
          window.location.href = "/overview";
        } else {
          setError("Invalid email or password.");
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          window.location.href = "/overview";
        } else {
          setError(data.message || "Invalid email or password.");
        }
      }
    } catch {
      setError("Cannot reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap"
        rel="stylesheet"
      />

      {/* ===== GLOBAL STYLES ===== */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body, #root {
          width: 100%;
          min-height: 100vh;
          background: #f7ede2;
        }

        .login-input::placeholder { color: #9e8472; }

        .login-input:focus {
          border-color: #c17a50 !important;
          box-shadow: 0 0 0 3px rgba(193,122,80,.15) !important;
        }

        .login-btn:hover:not(:disabled) { background: #a5623e !important; }

        .forgot-link:hover { color: #c17a50 !important; }

        .custom-checkbox {
          width: 17px;
          height: 17px;
          border: 1.8px solid #c17a50;
          border-radius: 4px;
          background: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .custom-checkbox.checked {
          background: #c17a50;
        }

        .custom-checkbox svg {
          display: none;
        }

        .custom-checkbox.checked svg {
          display: block;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 24px !important;
          }
          .login-title {
            font-size: 24px !important;
          }
        }
      `}</style>

      {/* ===== PAGE WRAPPER ===== */}
      <div style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ===== CARD ===== */}
        <div 
          className="login-card"
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "40px",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
          }}
        >

          {/* LOGO */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 30
          }}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <ellipse cx="20" cy="20" rx="18" ry="12" stroke="#c17a50" strokeWidth="2" />
              <circle cx="20" cy="20" r="6" fill="#c17a50" />
            </svg>

            <div>
              <div style={{ fontWeight: 600 }}>EyeHeat</div>
              <small style={{ color: "#888" }}>See What Matters</small>
            </div>
          </div>

          {/* HEADING */}
          <h2 className="login-title" style={{ marginBottom: 10 }}>Welcome Back</h2>
          <p style={{ marginBottom: 20, color: "#777" }}>Login to your account</p>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* FORM */}
          <form onSubmit={handleLogin}>

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="login-input"
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: 12,
                borderRadius: 8,
                border: "1px solid #ccc"
              }}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="login-input"
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: 12,
                borderRadius: 8,
                border: "1px solid #ccc"
              }}
            />

            <button
              type="submit"
              disabled={loading}
              className="login-btn"
              style={{
                width: "100%",
                padding: "12px",
                background: "#c17a50",
                color: "#fff",
                border: "none",
                borderRadius: 8
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
