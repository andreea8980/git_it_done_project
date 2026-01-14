import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

export default function Home() {
  return (
    <Layout title="Monitorizare prezență">
      <div className="page-center">
        <div className="hero">
          <h1 className="hero-title">Alege rolul</h1>
          <p className="hero-subtitle">
            Intră ca participant pentru scanare sau ca organizator pentru administrare.
          </p>

          <div className="card card-lg">
            <div className="role-grid">
              <Link to="/participant" className="btn btn-lg btn-ghost">
                Participant
              </Link>

              <Link to="/organizator/login" className="btn btn-primary btn-lg">
                Organizator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
