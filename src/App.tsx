import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider, useSelector } from 'react-redux';
import { store, persistor } from './store';
import { ConfigProvider, notification } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface';
import type { ThemeConfig } from 'antd';

import { Layout } from './components/layout/Layout';
import { ArticleDetail } from './pages/ArticleDetail';
import { Editor } from './pages/Editor';
import { Favorites } from './pages/Favorites';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Home } from './pages/Home';
import { RootState } from './store/type';


export interface IUser {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
}

const PrivateRoute = () => {
  const currentUser = useSelector((store: RootState) => store.user.currentUser);

  return currentUser ? <Outlet/> : <Navigate to="/"/>;
}

const PublicRoute = () => {
  const currentUser = useSelector((store: RootState) => store.user.currentUser);

  return !currentUser ? <Outlet/> : <Navigate to="/"/>;
}

const reloadPage = (event: any) => {
  console.log(event);
  // window.history.go();
}
  window.addEventListener('storage', reloadPage);
// window.removeEventListener('storage', reloadPage);


function App() {

  const [api, contextHolder] = notification.useNotification();
  const openSettingsNoti = (placement: NotificationPlacement) => {
    api.info({
      message: `Your profile settings have been updated`,
      placement,
    });
  };

  const openEditorNoti = (placement: NotificationPlacement) => {
    api.info({
      message: `Your article have been published successfully`,
      placement,
    });
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout/>,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: '',
          element: <PublicRoute/>,
          children: [
            {
              path: 'login',
              element: <Login asRegister={false} />,
            },
            {
              path: 'register',
              element: <Login asRegister={true} />,
            },
          ]
        },
        {
          path: '',
          element: <PrivateRoute />,
          children: [
            {
              path: 'settings',
              element: <Settings openNotification={openSettingsNoti}/>,
            },
            {
              path: 'editor',
              element: <Editor openNotification={openEditorNoti} />,
            },
            {
              path: 'editor/:slug',
              element: <Editor openNotification={openEditorNoti} />,
            },
          ]
        },
        {
          path: 'article/:slug',
          element: <ArticleDetail />,
        },
        {
          path: 'profile/:username',
          element: <Profile />,
          children: [
            {
              path: 'profile/:username/favorites',
              element: <Favorites />,
            },
          ]
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" />,
    }
  ]);

  const config: ThemeConfig = {
    token: {
      colorPrimary: '#198754',
    },
  };

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConfigProvider theme={config}>
          <div>
            {contextHolder}
            <RouterProvider router={router} />
          </div>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;

