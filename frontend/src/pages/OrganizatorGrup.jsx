import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { api } from "../api/client.js";

export default function OrganizatorGrup() {
  const { grupId } = useParams();
  const navigate = useNavigate();

  const [evenimente, setEvenimente] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // creare
  const [dataStart, setDataStart] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  // edit
  const [editingId, setEditingId] = useState(null);
  const [editStart, setEditStart] = useState("");
  const [editFinal, setEditFinal] = useState("");

  function showError(text) {
    setStatus("error");
    setMessage(text);
  }
  function showSuccess(text) {
    setStatus("success");
    setMessage(text);
  }

  function toLocalInputValue(value) {
    if (!value) return "";
    const d = new Date(String(value).replace(" ", "T"));
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
    });
  }

  async function loadEvenimente() {
    setMessage("");
    setStatus("");
    try {
      setLoading(true);

      const res = await api.get("/evenimente", { auth: true });
      const list = Array.isArray(res) ? res : res?.data || [];

      const onlyThisGroup = list.filter((ev) => Number(ev.grup_id) === Number(grupId));
      setEvenimente(onlyThisGroup);
    } catch (e) {
      showError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvenimente();
  }, [grupId]);

  async function handleCreeazaEveniment() {
    setMessage("");
    setStatus("");

    if (!dataStart || !dataFinal) {
      showError("Completează data start și data final.");
      return;
    }

    try {
      const payload = {
        grup_id: Number(grupId),
        data_start: new Date(dataStart).toISOString(),
        data_final: new Date(dataFinal).toISOString(),
      };

      const res = await api.post("/evenimente", payload, { auth: true });
      const created = res?.data ?? res;

      setEvenimente((prev) => [created, ...prev]);
      showSuccess("Eveniment creat.");
      setDataStart("");
      setDataFinal("");
    } catch (e) {
      showError(e.message);
    }
  }

  async function handleDeleteGrup() {
    const ok = window.confirm("Sigur vrei să ștergi grupul?");
    if (!ok) return;

    setMessage("");
    setStatus("");

    try {
      await api.del(`/grupuri/${grupId}`, { auth: true });
      showSuccess("Grup șters.");
      navigate("/organizator/dashboard");
    } catch (e) {
      showError(e.message);
    }
  }

  function startEdit(ev) {
    setEditingId(ev.id);
    setEditStart(toLocalInputValue(ev.data_start));
    setEditFinal(toLocalInputValue(ev.data_final));
    setMessage("");
    setStatus("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditStart("");
    setEditFinal("");
  }

  async function saveEdit(evenimentId) {
    setMessage("");
    setStatus("");

    if (!editStart || !editFinal) {
      showError("Completează data start și data final.");
      return;
    }

    try {
      const payload = {
        data_start: new Date(editStart).toISOString(),
        data_final: new Date(editFinal).toISOString(),
      };

      const res = await api.put(`/evenimente/${evenimentId}`, payload, { auth: true });
      const updated = res?.data ?? res;

      setEvenimente((prev) => prev.map((ev) => (ev.id === evenimentId ? updated : ev)));
      setEditingId(null);
      showSuccess("Eveniment actualizat.");
    } catch (e) {
      showError(e.message);
    }
  }

  async function handleDeleteEveniment(evenimentId) {
    const ok = window.confirm("Sigur vrei să ștergi evenimentul?");
    if (!ok) return;

    setMessage("");
    setStatus("");

    try {
      await api.del(`/evenimente/${evenimentId}`, { auth: true });
      setEvenimente((prev) => prev.filter((ev) => ev.id !== evenimentId));
      showSuccess("Eveniment șters.");
    } catch (e) {
      showError(e.message);
    }
  }

  return (
    <Layout title="Organizator">
      <div className="container">
        <div className="toolbar">
          <div className="vstack" style={{ gap: 6 }}>
            <h1 className="section-title">Evenimente</h1>
            <p className="section-subtitle">Grup ID: {grupId}</p>
          </div>

          <div className="hstack">
            <Link to="/organizator/dashboard" className="btn btn-muted">
              Înapoi
            </Link>

            <button
              className="btn btn-muted"
              onClick={handleDeleteGrup}
              style={{ borderColor: "#ffb4b4" }}
            >
              Șterge grup
            </button>
          </div>
        </div>

        {message && (
          <div className={`alert ${status === "success" ? "alert-success" : "alert-error"}`}>
            {message}
          </div>
        )}

        {}
        <div className="card vstack" style={{ marginTop: 16 }}>
          <div className="item-title">Creează eveniment</div>

          <div className="grid" style={{ marginTop: 10 }}>
            <div className="col-6">
              <div className="field">
                <label>Data start</label>
                <input
                  className="input"
                  type="datetime-local"
                  value={dataStart}
                  onChange={(e) => setDataStart(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6">
              <div className="field">
                <label>Data final</label>
                <input
                  className="input"
                  type="datetime-local"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="hstack" style={{ justifyContent: "flex-end", marginTop: 10 }}>
            <button className="btn btn-primary" onClick={handleCreeazaEveniment}>
              Creează eveniment
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="card vstack" style={{ marginTop: 16 }}>
          <div className="toolbar">
            <div>
              <div className="item-title">Lista evenimente</div>
              <div className="muted" style={{ fontSize: 13 }}>
                {loading ? "Se încarcă..." : `${evenimente.length} total`}
              </div>
            </div>

            <button className="btn btn-muted" onClick={loadEvenimente}>
              Refresh
            </button>
          </div>

          <div className="list" style={{ marginTop: 10 }}>
            {!loading && evenimente.length === 0 && (
              <div className="muted">Nu există evenimente încă. Creează unul.</div>
            )}

            {evenimente.map((ev) => {
              const isEditing = editingId === ev.id;

              return (
                <div key={ev.id} className="card" style={{ boxShadow: "none" }}>
                  <div className="toolbar" style={{ alignItems: "flex-start" }}>
                    <div className="vstack" style={{ gap: 8, flex: 1 }}>
                      <div className="item-title">Eveniment #{ev.id}</div>

                      {!isEditing ? (
                        <div className="muted">
                          Start: <b>{formatDate(ev.data_start)}</b> • Final:{" "}
                          <b>{formatDate(ev.data_final)}</b>
                        </div>
                      ) : (
                        <div className="grid" style={{ marginTop: 6 }}>
                          <div className="col-6">
                            <div className="field">
                              <label>Data start</label>
                              <input
                                className="input"
                                type="datetime-local"
                                value={editStart}
                                onChange={(e) => setEditStart(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="col-6">
                            <div className="field">
                              <label>Data final</label>
                              <input
                                className="input"
                                type="datetime-local"
                                value={editFinal}
                                onChange={(e) => setEditFinal(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="muted">
                        Cod acces: <b>{ev.cod_acces}</b>
                      </div>

                      <div className="muted">
                        Link participant: <b>{`/participant?code=${ev.cod_acces}`}</b>
                      </div>
                    </div>

                    <div className="hstack">
                      <Link className="btn btn-primary" to={`/organizator/eveniment/${ev.id}`}>
                        Vezi prezențe
                      </Link>

                      {!isEditing ? (
                        <>
                          <button className="btn btn-muted" onClick={() => startEdit(ev)}>
                            Edit
                          </button>
                          <button
                            className="btn btn-muted"
                            onClick={() => handleDeleteEveniment(ev.id)}
                            style={{ borderColor: "#ffb4b4" }}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-primary" onClick={() => saveEdit(ev.id)}>
                            Save
                          </button>
                          <button className="btn btn-muted" onClick={cancelEdit}>
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
