import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { RootState } from '../../store/type';
import { Footer } from './Footer';
import { PrivateHeader } from './headers/PrivateHeader';
import { PublicHeader } from './headers/PublicHeader';

export const Layout = () => {
  const currentUser = useSelector((store: RootState) => store.user.currentUser);

  return (
    <div>
      <div className="position-fixed fixed-top z-index-99">
        {currentUser ? <PrivateHeader /> : <PublicHeader />}
      </div>
      <div className="min-vh-100 mt-64">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
