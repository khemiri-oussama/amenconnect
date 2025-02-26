import React, { useState, useEffect, useRef, useCallback } from "react";
import { IonContent, IonPage, IonImg } from "@ionic/react";
import "./Homekiosk.css";

const HomeKiosk: React.FC = () => {
  // false : mode repos (vidéo affichée), true : mode interactif
  const [active, setActive] = useState(false);
  // Référence pour le timer d'inactivité
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  // Référence pour la vidéo
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fonction pour réinitialiser le timer d'inactivité
  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    // Passage au mode repos après 1 minute (60000 ms) d'inactivité
    inactivityTimer.current = setTimeout(() => {
      setActive(false);
      // Relance la vidéo en mode repos avec son
      if (videoRef.current) {
        videoRef.current.play().catch((error) =>
          console.error("Erreur lors de la lecture de la vidéo :", error)
        );
      }
    }, 60000);
  }, []);

  // Gestion de l'interaction utilisateur
  const handleUserInteraction = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = false; // Active le son après interaction
    }
    if (!active) {
      setActive(true);
    }
    resetTimer();
  }, [active, resetTimer]);

  useEffect(() => {
    // Ajoute des écouteurs pour détecter toute interaction (tactile ou clic)
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
          // Mode interactif : interface de la totem
          <div
            className="homekiosk-container"
            style={{ backgroundImage: `url('./background.png')` }}
          >
            <div className="homekiosk-content">
              <div className="homekiosk-logo">
                <IonImg
                  src="favicon.png"
                  alt="Amen Bank Logo"
                  className="homekiosk-img"
                />
              </div>
              <h1 className="homekiosk-title">Bienvenue!</h1>
              <h2 className="homekiosk-question">
                Quels sont vos besoins
                <br />
                bancaires aujourd'hui ?
              </h2>
              <button className="homekiosk-btn">Commencez ici</button>
              <p className="homekiosk-message">
                La réussite est à
                <br />
                portée de clic.
              </p>
            </div>
          </div>
        ) : (
          // Mode repos : lecture automatique de la vidéo en boucle avec son
          <div
            className="homekiosk-video-container"
            style={{ width: "100vw", height: "100vh" }}
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              controls={false}
              onError={(e) =>
                console.error("Erreur lors du chargement de la vidéo :", e)
              }
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
