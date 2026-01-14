
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { api } from "../api/client.js"; 

export default function Participant() {
  const [codAcces, setCodAcces] = useState("");
  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState(""); 
  const [message, setMessage] = useState("");

  const [searchParams] = useSearchParams();
  const codeFromUrl = searchParams.get("code");

  useEffect(() => {
    if (codeFromUrl && codAcces === "") setCodAcces(codeFromUrl);
  }, [codeFromUrl, codAcces]);

  const isValid =
    codAcces.trim() !== "" && nume.trim() !== "" && email.trim() !== "";

  function showError(text) {
    setStatus("error");
    setMessage(text);
  }

  function showSuccess(text) {
    setStatus("success");
    setMessage(text);
  }

  
async function handleConfirm() {
  setStatus("");
  setMessage("");

  const payload = {
    cod_acces: codAcces.trim().toUpperCase(),
    nume_participant: nume.trim(),
    email_participant: email.trim(),
  };

  if (payload.cod_acces.length < 4) {
    showError("Cod invalid (prea scurt).");
    return;
  }

  try {
    const res = await api.post("/prezenta", payload);

    showSuccess(res.message || "Prezența a fost înregistrată.");
  } catch (e) {
    showError(e.message);
  }
}

  return (
    <Layout title="Participant">
      <div className="page-center">
        <div className="hero">
          <div className="hstack" style={{ justifyContent: "space-between" }}>
      <div className="vstack" style={{ gap: 10, alignItems: "center" }}>
  <h1 className="section-title">Participant</h1>
  <p className="section-subtitle">
    Scanează QR sau introdu manual codul evenimentului.
  </p>

  <Link to="/participant/scan" className="btn">
    Scanează QR
  </Link>
</div>

          </div>

          <div className="card card-lg form-card vstack" style={{ marginTop: 16 }}>
            <div className="field">
              <label>Cod eveniment</label>
              <input
                className="input"
                placeholder="ex: XJ4D92"
                value={codAcces}
                onChange={(e) => setCodAcces(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Nume</label>
              <input
                className="input"
                placeholder="ex: Ion Pop"
                value={nume}
                onChange={(e) => setNume(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                className="input"
                placeholder="ex: ion@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <Link to="/" className="btn btn-muted">
                Înapoi
              </Link>

              <button
                className="btn btn-primary btn-lg"
                disabled={!isValid}
                onClick={handleConfirm}
              >
                Confirmă prezența
              </button>
            </div>

            {message && (
              <div className={`alert ${status === "success" ? "alert-success" : "alert-error"}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
