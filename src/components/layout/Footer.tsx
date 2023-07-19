import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-light shadow-lg">
      <div className="container py-4 d-flex justify-content-center align-items-center gap-2 flex-column flex-md-row">
        <Link to="/" className="text-success text-decoration-none">
            <b className="page-link mb-0">conduit</b>
        </Link>
        <div className="attribution text-center">
          An interactive learning project from{" "}
          <Link to="https://thinkster.io" className="text-success text-decoration-none">
            <p className="page-link mb-0 d-inline-block">Thinkster</p>
          </Link>. 
          Code &amp; design licensed under MIT.
        </div>
      </div>
    </footer>
  );
};