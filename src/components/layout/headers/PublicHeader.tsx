import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ToggleMenu } from './ToggleMenu';
import type { MenuProps } from 'antd';

export const PublicHeader = () => {
  const location = useLocation();
  type MenuItem = Required<MenuProps>['items'][number];
  const menuItems: MenuItem[] = [
    {
      label: (
        <Link 
          className={`nav-link ${location.pathname === "/" && "fw-bolder text-black active-page"}`} 
          to="/"
        >
          Home
        </Link>
      ),
      key: 'home',
    },
    {
      label: (
        <Link 
          className={`nav-link ${location.pathname === "/login" && "fw-bolder text-black active-page"}`} 
          to="/login"
        >
          Sign in
        </Link>
      ),
      key: 'login',
    },
    {
      label: (
        <Link 
          className={`nav-link ${location.pathname === "/register" && "fw-bolder text-black active-page"}`} 
          to="/register"
        >
          Sign up
        </Link>
      ),
      key: 'register',
    },
  ]

  return (
    <div>
      <Navbar className="shadow h-64" bg="white" variant="white">
        <Container className="row container mx-auto">
          <Nav className="col-4 col-md-2 justify-content-start pr-0">
            <Link to="/" className="nav-link text-decoration-none">
              <h3 className="text-success mb-0 fw-bolder">conduit</h3>
            </Link>
          </Nav>
          <Nav className="col justify-content-end pr-0 d-none d-md-flex">
            <Link 
              className={`nav-link ${location.pathname === "/" && "fw-bolder text-black active-page"}`} 
              to="/"
            >
              Home
            </Link>
            <Link 
              className={`nav-link ${location.pathname === "/login" && "fw-bolder text-black active-page"}`} 
              to="/login"
            >
              Sign in
            </Link>
            <Link 
              className={`nav-link ${location.pathname === "/register" && "fw-bolder text-black active-page"}`} 
              to="/register"
            >
              Sign up
            </Link>
          </Nav>
          <div className="col d-flex d-md-none justify-content-end px-0">
            <ToggleMenu menuItems={menuItems} />
          </div>
        </Container>
      </Navbar>
    </div>
  );
};
