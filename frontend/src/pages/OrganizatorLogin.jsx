import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { api } from "../api/client.js";

export default function OrganizatorLogin() {
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const isValid = email.trim() !== "" && parola.trim() !== "";

  async function handleLogin() {
    setMessage("");

    try {
      const res = await api.post("/organizatori/login", {
        email: email.trim(),
        parola: parola.trim(),
      });

      // trebuie să existe token
      if (!res?.token) {
        throw new Error("Login eșuat.");
      }

      localStorage.setItem("token", res.token);

      if (res.organizator) {
        localStorage.setItem(
          "organizator",
          JSON.stringify(res.organizator)
        );
      }

      navigate("/organizator/dashboard");
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <Layout title="Organizator">
      <div className="page-center">
        <div className="hero">
          <h1 className="section-title">Login organizator</h1>
          <p className="section-subtitle">
            Autentificare pentru a gestiona grupuri și evenimente.
          </p>

          <div
            className="card card-lg form-card vstack"
            style={{ marginTop: 16 }}
          >
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                placeholder="ex: admin@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Parolă</label>
              <input
                className="input"
                type="password"
                placeholder="ex: 1234"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <Link to="/" className="btn btn-muted">
                Home
              </Link>

              <Link to="/organizator/register" className="btn btn-muted">
                Register
              </Link>

              <button
                className="btn btn-primary btn-lg"
                disabled={!isValid}
                onClick={handleLogin}
              >
                Login
              </button>
            </div>

            {message && (
              <div className="alert alert-error">{message}</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
