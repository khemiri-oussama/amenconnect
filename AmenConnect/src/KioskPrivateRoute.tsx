// src/KioskPrivateRoute.tsx
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from './AuthContext';
import React, { lazy} from 'react';


const KioskHome = lazy(() => import('./pages/HomeKiosk')); 

interface KioskPrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const KioskPrivateRoute: React.FC<KioskPrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isAuthenticated, authLoading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (authLoading) {
          return <div>Loading...</div>;
        }
        return isAuthenticated ? (
          <Component {...props} />
        ) : (
          // Redirect to a login page; you can customize this route as needed.
          <Redirect to={"/Home/HomeKiosk"} />
        );
      }}
    />
  );
};

export default KioskPrivateRoute;
