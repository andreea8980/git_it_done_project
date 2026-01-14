import { Link } from "react-router-dom";

export default function Layout({ title, children }) {
  return (
    <>
      <div className="nav">
        <div className="nav-inner">
          <div className="brand">
            <span className="brand-dot" />
            <span>{title}</span>
          </div>

          <Link to="/" className="btn">
            Home
          </Link>
        </div>
      </div>

      <div className="container">{children}</div>
    </>
  );
}
