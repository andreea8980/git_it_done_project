import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import Layout from "../components/Layout.jsx";

export default function ParticipantScan() {
  const navigate = useNavigate();
  const qrRef = useRef(null);
  const startedRef = useRef(false);

  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function start() {
      // Fix pentru React StrictMode (rulează useEffect de 2 ori în dev)
      if (startedRef.current) return;
      startedRef.current = true;

      setErr("");

      try {
        qrRef.current = new Html5Qrcode("qr-reader");

        await qrRef.current.start(
          { facingMode: "environment" }, // pe laptop va folosi camera disponibilă
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            if (cancelled) return;
            try {
              await qrRef.current?.stop();
              await qrRef.current?.clear();
            } catch {}
            navigate(`/participant?code=${encodeURIComponent(decodedText)}`);
          }
        );
      } catch (e) {
        console.error("Nu pot porni camera:", e);
        if (!cancelled) {
          setErr(
            "Nu am putut porni camera. Verifică permisiunile sau încearcă alt browser (Chrome)."
          );
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      (async () => {
        try {
          await qrRef.current?.stop();
          await qrRef.current?.clear();
        } catch {}
      })();
    };
  }, [navigate]);

  return (
    <Layout title="Scanează QR">
      <div className="page-center">
        <div className="hero" style={{ width: "min(720px, 100%)" }}>
          <h1 className="section-title">Scanează QR</h1>
          <p className="section-subtitle">
            Pe laptop folosești webcam-ul. Arată un cod QR pe telefon în fața camerei.
          </p>

          <div className="card card-lg qr-card" style={{ marginTop: 16 }}>
            {err && <div className="alert alert-error">{err}</div>}

            <div className="qr-frame" style={{ marginTop: err ? 12 : 0 }}>
              <div id="qr-reader" />
            </div>

            <div className="qr-actions">
              <Link to="/participant" className="btn btn-muted">
                Înapoi la formular
              </Link>
              <Link to="/" className="btn">
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
