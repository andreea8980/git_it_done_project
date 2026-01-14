import { Link } from "react-router-dom";

export default function Organizator() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Organizator</h1>

      <p>Aici va fi login / register.</p>

      <Link to="/">
        <button>Înapoi</button>
      </Link>
    </div>
  );
}
