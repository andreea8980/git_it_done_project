import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { api } from "../api/client.js";

export default function OrganizatorRegister() {
  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const isValid = nume.trim() && email.trim() && parola.trim();

 async function handleRegister() {
  setMessage("");

  try {
    // 1) register
    await api.post("/organizatori/register", {
      nume: nume.trim(),
      email: email.trim(),
      parola: parola.trim(),
    });

    // 2) login imediat (ca să obții token)
    const loginRes = await api.post("/organizatori/login", {
      email: email.trim(),
      parola: parola.trim(),
    });

    localStorage.setItem("token", loginRes.token);
    localStorage.setItem("organizator", JSON.stringify(loginRes.organizator));

    navigate("/organizator/dashboard");
  } catch (e) {
    setMessage(e.message);
  }
}


  return (
    <Layout title="Organizator">
      <div className="page-center">
        <div className="hero">
          <h1 className="section-title">Register organizator</h1>
          <p className="section-subtitle">Creează un cont nou de organizator.</p>

          <div className="card card-lg form-card vstack" style={{ marginTop: 16 }}>
            <div className="field">
              <label>Nume</label>
              <input
                className="input"
                placeholder="ex: Andreea"
                value={nume}
                onChange={(e) => setNume(e.target.value)}
              />
            </div>

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
                placeholder="minim 4 caractere"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <Link to="/" className="btn btn-muted">Home</Link>
              <Link to="/organizator/login" className="btn btn-muted">Am deja cont</Link>

              <button
                className="btn btn-primary btn-lg"
                disabled={!isValid}
                onClick={handleRegister}
              >
                Register
              </button>
            </div>

            {message && <div className="alert alert-error">{message}</div>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
