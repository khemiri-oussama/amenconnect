import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Otp from './pages/otp/otp';
import Accueil from './pages/accueil/accueil';
import Compte from './pages/Compte/Compte';
import Carte from './pages/Carte/Carte';
import ChatBot from './pages/chatBot/chatBot';
import Login from './pages/Login/Login';
import virement from './pages/virement/virement'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';

/* Dark mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
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

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/Home" component={Home} />
          <Route exact path="/otp" component={Otp} />
          <Route exact path="/accueil" component={Accueil} />
          <Route exact path="/compte" component={Compte} />
          <Route exact path="/carte" component={Carte} />
          <Route exact path="/chatBot" component={ChatBot} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/virement" component={virement} />
          <Route exact path="/" render={() => <Redirect to="/Home" />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;