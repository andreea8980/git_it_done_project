import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { api } from "../api/client.js";
import { downloadCsv } from "../api/downloadCsv.js";

export default function OrganizatorEveniment() {
  const { evenimentId } = useParams();

  const [prezente, setPrezente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(""); 
  const [message, setMessage] = useState("");

  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState("");

  function showError(text) {
    setStatus("error");
    setMessage(text || "A apărut o eroare.");
  }
  function showSuccess(text) {
    setStatus("success");
    setMessage(text || "OK.");
  }

  function formatDate(value) {
    if (!value) return "-";
    const d = new Date(String(value).replace(" ", "T"));
    if (isNaN(d.getTime())) return String(value);

    return d.toLocaleString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  async function loadPrezente() {
    setStatus("");
    setMessage("");

    try {
      setLoading(true);

      const res = await api.get(`/prezenta/eveniment/${evenimentId}`, { auth: true });
      const list = Array.isArray(res) ? res : (res?.data || []);
      setPrezente(list);

      showSuccess("Prezențe încărcate.");
    } catch (e) {
      showError(e?.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleExportCsv() {
    try {
      setCsvError("");
      setCsvLoading(true);

      const filename = `prezenta_eveniment_${evenimentId}.csv`;
      await downloadCsv(`/prezenta/export/${evenimentId}`, filename);

      showSuccess("CSV exportat.");
    } catch (e) {
      setCsvError(e?.message || "Nu s-a putut exporta CSV.");
      showError(e?.message || "Nu s-a putut exporta CSV.");
    } finally {
      setCsvLoading(false);
    }
  }

  useEffect(() => {
    loadPrezente();
  }, [evenimentId]);

  return (
    <Layout title="Organizator">
      <div className="container">
        <div className="toolbar">
          <div className="vstack" style={{ gap: 6 }}>
            <h1 className="section-title">Prezențe</h1>
            <p className="section-subtitle">Eveniment ID: {evenimentId}</p>
          </div>

          <div className="hstack" style={{ gap: 8 }}>
            <button className="btn btn-muted" onClick={loadPrezente} disabled={loading}>
              {loading ? "Se încarcă..." : "Refresh"}
            </button>

            <button
              className="btn btn-primary"
              onClick={handleExportCsv}
              disabled={csvLoading || loading}
              title="Descarcă lista de prezențe în format CSV"
            >
              {csvLoading ? "Se exportă..." : "Export CSV"}
            </button>

            <Link to="/organizator/dashboard" className="btn btn-muted">
              Înapoi
            </Link>
          </div>
        </div>

        {message && (
          <div className={`alert ${status === "success" ? "alert-success" : "alert-error"}`}>
            {message}
          </div>
        )}

        {csvError && (
          <div className="alert alert-error" style={{ marginTop: 10 }}>
            {csvError}
          </div>
        )}

        <div className="card vstack" style={{ marginTop: 16 }}>
          <div className="item-title">Lista prezențe</div>
          <div className="muted" style={{ fontSize: 13 }}>
            {loading ? "Se încarcă..." : `${prezente.length} înregistrări`}
          </div>

          <div className="list" style={{ marginTop: 10 }}>
            {!loading && prezente.length === 0 && (
              <div className="muted">Nu există prezențe încă.</div>
            )}

            {prezente.map((p) => (
              <div key={p.id} className="card" style={{ boxShadow: "none" }}>
                <div className="toolbar" style={{ alignItems: "flex-start" }}>
                  <div className="vstack" style={{ gap: 4 }}>
                    <div className="item-title">{p.nume_participant}</div>
                    <div className="muted">{p.email_participant}</div>
                    <div className="muted">
                      Data prezenței:{" "}
                      <b>{formatDate(p.timestamp_confirmare || p.data_inregistrarii)}</b>
                    </div>
                  </div>

                  {}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
