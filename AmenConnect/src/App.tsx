import React, { useState, useEffect } from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

// Importing pages
import Home from './pages/Home';
import Otp from './pages/otp/otp';
import Accueil from './pages/Client/accueil/accueil';
import Compte from './pages/Client/Compte/Compte';
import Carte from './pages/Client/Carte/Carte';
import ChatBot from './pages/Client/chatBot/chatBot';
import Login from './pages/Login/Login';
import Virement from './pages/Client/virement/virement';
import ProfileMobile from './pages/Client/accueil/MenuMobile/ProfileMobile';
import SecuritySettingsMobile from './pages/Client/accueil/MenuMobile/SecuritySettingsMobile';

// Admin routes
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import UserManagement from './pages/Admin/Gestion Utilisateur/UserManagement';
import SurveillanceMonitoring from './pages/Admin/SurveillanceMonitoring/SurveillanceMonitoring';
import PermissionsManagement from './pages/Admin/Permissions/permissionsManagement';
import AuthenticationSecurity from './pages/Admin/AuthenticationSecurity/AuthenticationSecurity';
import InteractiveTotemManagement from './pages/Admin/Gestion des Totem/InteractiveTotemManagement';

// Importing PrivateRoute component and AuthProvider
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';

// Core and CSS imports
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// Capacitor StatusBar imports
import { StatusBar, Style } from '@capacitor/status-bar';

import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  // Check for a token in localStorage for full authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuthentication();
  }, []);

  // Initialize transparent status bar on app load
  const setTransparentStatusBar = async () => {
    try {
      await StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: 'transparent' });
    } catch (error) {
      console.error('Error setting status bar:', error);
    }
  };

  setTransparentStatusBar();

  // Handle scroll to dynamically adjust status bar transparency
  const handleScroll = async () => {
    const scrollTop = window.scrollY;
    if (scrollTop > 50) {
      await StatusBar.setBackgroundColor({ color: 'rgba(0, 0, 0, 0.2)' });
    } else {
      await StatusBar.setBackgroundColor({ color: 'transparent' });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            {/* Public Route */}
            <Route exact path="/login" component={Login} />

            {/* OTP Page is now public.
                The OTP page itself checks if the user data exists (redirects to /login if not).
            */}
            <Route exact path="/otp" component={Otp} />

            {/* Protected Routes */}
            <PrivateRoute
              exact
              path="/home"
              component={Home}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              exact
              path="/accueil"
              component={Accueil}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              exact
              path="/compte"
              component={Compte}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              exact
              path="/carte"
              component={Carte}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              exact
              path="/chatBot"
              component={ChatBot}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              exact
              path="/virement"
              component={Virement}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              path="/profile"
              component={ProfileMobile}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              path="/SecuritySettingsMobile"
              component={SecuritySettingsMobile}
              isAuthenticated={isAuthenticated}
            />

            {/* Admin Routes */}
            <PrivateRoute
              path="/Dashboard"
              component={Dashboard}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              path="/UserManagement"
              component={UserManagement}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              path="/SurveillanceMonitoring"
              component={SurveillanceMonitoring}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              path="/PermissionsManagement"
              component={PermissionsManagement}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              path="/AuthenticationSecurity"
              component={AuthenticationSecurity}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              path="/InteractiveTotemManagement"
              component={InteractiveTotemManagement}
              isAuthenticated={isAuthenticated}
            />

            {/* Default route to Home */}
            <Route exact path="/" render={() => <Redirect to="/home" />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

export default App;
