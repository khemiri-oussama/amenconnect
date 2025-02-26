import React, { useState, useEffect, useRef, useCallback } from "react";
import { IonContent, IonPage, IonImg } from "@ionic/react";
import "./Homekiosk.css";

const HomeKiosk: React.FC = () => {
  const [active, setActive] = useState(false); // Mode interactif ou repos
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fonction pour relancer le mode repos après inactivité
  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

    inactivityTimer.current = setTimeout(() => {
      setActive(false);
      if (videoRef.current) {
        videoRef.current.play().catch((error) => console.error("Erreur lecture vidéo:", error));
      }
    }, 60000); // 1 minute d'inactivité
  }, []);

  // Gestion de l'interaction utilisateur
  const handleUserInteraction = useCallback(() => {
    if (!active) {
      setActive(true);
    }
    resetTimer();
  }, [active, resetTimer]);

  useEffect(() => {
    document.addEventListener("touchstart", handleUserInteraction);
    document.addEventListener("click", handleUserInteraction);

    return () => {
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("click", handleUserInteraction);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [handleUserInteraction]);

  return (
    <IonPage>
      <IonContent fullscreen>
        {active ? (
          // Mode interactif
          <div className="welcome-container" style={{ backgroundImage: `url('./background.png')` }}>
            <div className="content-wrapper">
              <div className="logo">
                <IonImg src="favicon.png" alt="Amen Bank Logo" className="img" />
              </div>
              <h1 className="welcome-kiosk">Bienvenue!</h1>
              <h2 className="banking-question">
                Quels sont vos besoins
                <br />
                bancaires aujourd'hui ?
              </h2>
              <button className="start-button">Commencez ici</button>
              <p className="success-message">
                La réussite est à<br />
                portée de clic.
              </p>
            </div>
          </div>
        ) : (
          // Mode repos : vidéo en boucle
          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              muted
              onError={(e) => console.error("Erreur chargement vidéo:", e)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src="pub.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomeKiosk;
