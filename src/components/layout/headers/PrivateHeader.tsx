import { Container, Nav, Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { IUser } from '../../../App';
import { RootState } from '../../../store/type';
import { ToggleMenu } from './ToggleMenu';
import type { MenuProps } from 'antd';

export const PrivateHeader = () => {
  const currentUser: IUser | null = useSelector((store: RootState) => store.user.currentUser);
  const location = useLocation();
  const { username } = useParams();

  type MenuItem = Required<MenuProps>['items'][number];
  const menuItems: MenuItem[] = [
    {
      label: currentUser && (
        <Link 
          className={`nav-link d-flex align-items-center gap-1 ${username === `@${(currentUser as IUser).username}` && "fw-bolder text-black active-page"}`} 
          to={`/profile/@${(currentUser as IUser).username}`}
        > 
          <img className="rounded-circle" src={(currentUser as IUser).image} width="30px" height="30px" />{' '}
          <p className="d-inline-block mb-0">{(currentUser as IUser).username}</p>
        </Link>
      ),
      key: 'user',
    },
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
          className={`nav-link ${location.pathname.includes("/editor") && "fw-bolder text-black active-page"}`} 
          to="/editor"
        >
          New Article
        </Link>
      ),
      key: 'editor',
    },
    {
      label: (
        <Link 
          className={`nav-link ${location.pathname === "/settings" && "fw-bolder text-black active-page"}`} 
          to="/settings"
        >
          Settings
        </Link>
      ),
      key: 'settings',
    },
  ];

  return currentUser ? (
    <div className="position-relative">
      <Navbar className="shadow h-64" bg="white" variant="white">
        <Container className="row container mx-auto">
          <Nav className="col-4 col-md-2 justify-content-start pr-0">
            <Link to="/" className="nav-link text-decoration-none">
              <h3 className="text-success mb-0 fw-bolder">conduit</h3>
            </Link>
          </Nav>
          <Nav className="col justify-content-end align-items-center pr-0 d-none d-md-flex">
            <Link 
              className={`nav-link ${location.pathname === "/" && "fw-bolder text-black active-page"}`} 
              to="/"
            >
              Home
            </Link>
            <Link 
              className={`nav-link ${location.pathname.includes("/editor") && "fw-bolder text-black active-page"}`} 
              to="/editor"
            >
              <i className="fa-solid fa-pen-to-square"></i>{' '}
              New Article
            </Link>
            <Link 
              className={`nav-link ${location.pathname === "/settings" && "fw-bolder text-black active-page"}`} 
              to="/settings"
            >
              Settings
            </Link>
            <Link 
              className={`nav-link d-flex align-items-center gap-1 ${username === `@${(currentUser as IUser).username}` && "fw-bolder text-black active-page"}`} 
              to={`/profile/@${(currentUser as IUser).username}`}
            > 
              <img className="rounded-circle" src={(currentUser as IUser).image} width="30px" height="30px" />{' '}
              <p className="d-inline-block mb-0">{(currentUser as IUser).username}</p>
            </Link>
          </Nav>
          <div className="col d-flex d-md-none justify-content-end px-0">
            <ToggleMenu menuItems={menuItems} />
          </div>
        </Container>
      </Navbar>
    </div>
  ) : <></>
};
