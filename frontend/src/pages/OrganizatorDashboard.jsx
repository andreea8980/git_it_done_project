import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { api } from "../api/client.js";

export default function OrganizatorDashboard() {
  const [grupuri, setGrupuri] = useState([]);
  const [loading, setLoading] = useState(true);

  // creare grup
  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");

  const [dataStart, setDataStart] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [recurenta, setRecurenta] = useState("");
  const [durataOre, setDurataOre] = useState(2);

  // edit grup
  const [editingId, setEditingId] = useState(null);
  const [editTitlu, setEditTitlu] = useState("");
  const [editDescriere, setEditDescriere] = useState("");

  const [status, setStatus] = useState(""); // "" | "success" | "error"
  const [message, setMessage] = useState("");

  function showError(text) {
    setStatus("error");
    setMessage(text);
  }
  function showSuccess(text) {
    setStatus("success");
    setMessage(text);
  }

  async function loadGrupuri() {
    setMessage("");
    setStatus("");
    try {
      setLoading(true);

      // GET /api/grupuri
      const res = await api.get("/grupuri", { auth: true });

      // suportă ambele stiluri: array direct sau {data: array}
      const list = Array.isArray(res) ? res : (res?.data || []);
      setGrupuri(list);
    } catch (e) {
      showError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGrupuri();
  }, []);

  async function handleAddGrup() {
    setMessage("");
    setStatus("");

    if (!titlu.trim()) {
      showError("Titlul este obligatoriu.");
      return;
    }

    if (recurenta && (!dataStart || !dataFinal)) {
      showError("Pentru recurență trebuie să setezi data start și data final.");
      return;
    }

    if (dataStart && dataFinal) {
      const start = new Date(dataStart);
      const end = new Date(dataFinal);
      if (end <= start) {
        showError("Data final trebuie să fie după data start.");
        return;
      }
    }

    try {
      const payload = { 
        titlu: titlu.trim(), 
        descriere: descriere.trim(),
        data_start: dataStart ? new Date(dataStart).toISOString() : null,
        data_final: dataFinal ? new Date(dataFinal).toISOString() : null,
        recurenta: recurenta || null,
        durata_ore: durataOre
      };
      const res = await api.post("/grupuri", payload, { auth: true });

      const created = res?.data ?? res;
      setGrupuri((prev) => [created, ...prev]);

      setTitlu("");
      setDescriere("");
      setDataStart("");
      setDataFinal("");
      setRecurenta("");
      setDurataOre(2);

      showSuccess("Grup creat.");
    } catch (e) {
      showError(e.message);
    }
  }

  function startEdit(g) {
    setEditingId(g.id);
    setEditTitlu(g.titlu || "");
    setEditDescriere(g.descriere || "");
    setMessage("");
    setStatus("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitlu("");
    setEditDescriere("");
  }

  async function saveEdit(grupId) {
    setMessage("");
    setStatus("");

    if (!editTitlu.trim()) {
      showError("Titlul este obligatoriu.");
      return;
    }

    try {
      const payload = {
        titlu: editTitlu.trim(),
        descriere: editDescriere.trim(),
      };

      const res = await api.put(`/grupuri/${grupId}`, payload, { auth: true });
      const updated = res?.data ?? res;

      setGrupuri((prev) => prev.map((g) => (g.id === grupId ? updated : g)));
      setEditingId(null);
      showSuccess("Grup actualizat.");
    } catch (e) {
      showError(e.message);
    }
  }


  async function handleDeleteGrup(grupId) {
    const ok = window.confirm("Sigur vrei să ștergi grupul?");
    if (!ok) return;

    setMessage("");
    setStatus("");

    try {
      await api.del(`/grupuri/${grupId}`, { auth: true });
      setGrupuri((prev) => prev.filter((g) => g.id !== grupId));
      showSuccess("Grup șters.");
    } catch (e) {
      showError(e.message);
    }
  }

  async function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("organizator");
    showSuccess("Logout ok.");
  }

  return (
    <Layout title="Organizator">
      <div className="container">
        <div className="vstack" style={{ gap: 6 }}>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">Creează / editează grupuri și gestionează evenimente.</p>
        </div>

        <div className="toolbar" style={{ marginTop: 16 }}>
          <div />
          <div className="hstack">
            <Link to="/" className="btn btn-muted">Home</Link>
            <button className="btn btn-muted" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {message && (
          <div className={`alert ${status === "success" ? "alert-success" : "alert-error"}`}>
            {message}
          </div>
        )}

        {}
        <div className="card col-12 vstack" style={{ marginTop: 16 }}>
          <div className="toolbar">
            <div>
              <div className="item-title">Adaugă grup</div>
              <div className="muted" style={{ fontSize: 13 }}>Titlul e obligatoriu.</div>
            </div>
            <button className="btn btn-muted" onClick={loadGrupuri}>Refresh</button>
          </div>

          <div className="grid" style={{ marginTop: 10 }}>
            <div className="col-6">
              <div className="field">
                <label>Titlu *</label>
                <input
                  className="input"
                  placeholder="ex: Curs TW - Seria C"
                  value={titlu}
                  onChange={(e) => setTitlu(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6">
              <div className="field">
                <label>Descriere</label>
                <input
                  className="input"
                  placeholder="opțional"
                  value={descriere}
                  onChange={(e) => setDescriere(e.target.value)}
                />
              </div>
            </div>
            <div className="col-6">
    <div className="field">
      <label>Data start (primul eveniment)</label>
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
      <label>Data final (limită generare)</label>
      <input
        className="input"
        type="datetime-local"
        value={dataFinal}
        onChange={(e) => setDataFinal(e.target.value)}
      />
    </div>
  </div>

  <div className="col-6">
    <div className="field">
      <label>Recurență (opțional)</label>
      <select
        className="input"
        value={recurenta}
        onChange={(e) => setRecurenta(e.target.value)}
      >
        <option value="">-- Fără recurență --</option>
        <option value="saptamanal">Săptămânal</option>
        <option value="bisaptamanal">La 2 săptămâni</option>
        <option value="lunar">Lunar</option>
      </select>
    </div>
  </div>

  <div className="col-6">
    <div className="field">
      <label>Durata eveniment (ore)</label>
      <input
        className="input"
        type="number"
        min="1"
        max="12"
        value={durataOre}
        onChange={(e) => setDurataOre(Number(e.target.value))}
      />
    </div>
  </div>
</div>

          <div className="hstack" style={{ justifyContent: "flex-end", marginTop: 10 }}>
            <button className="btn btn-primary" onClick={handleAddGrup} disabled={!titlu.trim()}>
              Adaugă grup
            </button>
          </div>
        </div>

        {}
        <div className="card col-12 vstack" style={{ marginTop: 16 }}>
          <div className="toolbar">
            <div>
              <div className="item-title">Grupuri</div>
              <div className="muted" style={{ fontSize: 13 }}>
                {loading ? "Se încarcă..." : `${grupuri.length} total`}
              </div>
            </div>
          </div>

          <div className="list" style={{ marginTop: 10 }}>
            {!loading && grupuri.length === 0 && (
              <div className="muted">Nu există grupuri încă.</div>
            )}

            {grupuri.map((g) => {
              const isEditing = editingId === g.id;

              return (
                <div key={g.id} className="card" style={{ boxShadow: "none" }}>
                  <div className="toolbar" style={{ alignItems: "flex-start" }}>
                    <div className="vstack" style={{ gap: 6, flex: 1 }}>
                      {!isEditing ? (
                        <>
                          <div className="item-title">{g.titlu}</div>
                          <div className="muted">{g.descriere || "-"}</div>

                          {g.recurenta && (
                            <div className="badge">
                              Recurență: {g.recurenta}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="field">
                            <label>Titlu *</label>
                            <input
                              className="input"
                              value={editTitlu}
                              onChange={(e) => setEditTitlu(e.target.value)}
                            />
                          </div>
                          <div className="field">
                            <label>Descriere</label>
                            <input
                              className="input"
                              value={editDescriere}
                              onChange={(e) => setEditDescriere(e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="hstack">
                      <Link className="btn btn-primary" to={`/organizator/grup/${g.id}`}>
                        Vezi evenimente
                      </Link>

                      {!isEditing ? (
                        <>
                          <button className="btn btn-muted" onClick={() => startEdit(g)}>
                            Edit
                          </button>

                          {}
                          <button
                            className="btn btn-muted"
                            onClick={() => handleDeleteGrup(g.id)}
                            style={{ borderColor: "#ffb4b4" }}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-primary" onClick={() => saveEdit(g.id)}>
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
