// LoginKiosk.tsx
"use client"

import React, { useState, useEffect, useRef, useCallback } from "react";
import { IonContent, IonPage, IonImg, useIonRouter, IonIcon } from "@ionic/react";
import { arrowBack, eyeOutline, eyeOffOutline, phonePortrait } from "ionicons/icons";
import { QRCodeSVG } from "qrcode.react";
import { useLogin } from "../../hooks/useLogin"; // Import the useLogin hook
import "./LoginKiosk.css";

const LoginKiosk: React.FC = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const ionRouter = useIonRouter();

  // Ref for managing inactivity timer
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  // Ref to focus on the username input when the form is shown
  const usernameInputRef = useRef<HTMLInputElement | null>(null);

  // Generate a unique session ID for the QR code when the component loads
  const sessionId = useRef(Math.random().toString(36).substring(2, 15));

  // Create a QR session in the database
  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await fetch("/api/qr-login/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ sessionId: sessionId.current }),
        });
        if (!response.ok) {
          console.error("Failed to create QR session");
        }
      } catch (err) {
        console.error("Error creating QR session:", err);
      }
    };
    createSession();
  }, []);

  // Reset inactivity timer (session timeout)
  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      ionRouter.push("/home");
    }, 60000);
  }, [ionRouter]);

  const handleUserInteraction = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  // Use the useLogin hook for email/password login
  const { isLoading, errorMessage, login } = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
    resetTimer();
  };

  const handleBack = () => {
    if (showLoginForm) {
      setShowLoginForm(false);
    } else {
      ionRouter.push("/");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const showIdentifierLogin = () => {
    setShowLoginForm(true);
    resetTimer();
  };

  // Embed the session ID in the QR code URL for the mobile app to scan
  const qrCodeData = `http://localhost:8200/auth?session=${sessionId.current}`;

  // Polling: periodically check if the mobile app has authenticated the session.
  // When authenticated, redirect the kiosk to /accueil.
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`/api/qr-login/${sessionId.current}`, {
          credentials: "include",
        });
        console.log("Polling response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Polling response data:", data);
          if (data.status === "authenticated") {
            ionRouter.push("/accueil");
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000);
    return () => clearInterval(intervalId);
  }, [ionRouter]);

  useEffect(() => {
    document.addEventListener("touchstart", handleUserInteraction);
    document.addEventListener("click", handleUserInteraction);

    if (showLoginForm && usernameInputRef.current) {
      usernameInputRef.current.focus();
    }

    return () => {
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("click", handleUserInteraction);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [handleUserInteraction, showLoginForm]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="loginkiosk-container">
          <div className="background-white"></div>
          <svg className="background-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 983 1920" fill="none">
            <path
              d="M0 0H645.236C723.098 0 770.28 85.9638 728.469 151.647C697.151 200.847 715.114 266.33 767.152 292.664L793.096 305.793C854.316 336.773 866.865 418.795 817.709 466.662L691.328 589.731C677.652 603.048 659.319 610.5 640.231 610.5C577.253 610.5 543.641 684.721 585.184 732.054L641.155 795.826C676.082 835.621 671.964 896.237 631.974 930.943L582.069 974.254C522.93 1025.58 568.96 1122.18 646.076 1108.59C700.297 1099.03 746.811 1147.67 734.833 1201.41L727.617 1233.79C715.109 1289.9 752.705 1344.88 809.534 1353.59L836.788 1357.76C862.867 1361.76 886.31 1375.9 902.011 1397.1L964.656 1481.7C1003.87 1534.65 970.947 1610.18 905.469 1617.5C862.212 1622.34 829.5 1658.92 829.5 1702.44V1717.72C829.5 1756.01 800.102 1787.88 761.94 1790.96L696.194 1796.27C667.843 1798.56 652.928 1831 669.644 1854.01C685.614 1876 672.771 1907.1 645.942 1911.41L597.738 1919.16C594.251 1919.72 590.726 1920 587.195 1920H462.5H200.5H0V0Z"
              fill="#47CE65"
              stroke="#47CE65"
            />
          </svg>
          <div className="loginkiosk-content">
            <div className="loginkiosk-back-button" onClick={handleBack}>
              <IonIcon icon={arrowBack} />
              <span>Retour</span>
            </div>
            <div className="loginkiosk-logo">
              <IonImg src="favicon.png" alt="Amen Bank Logo" className="loginkiosk-img" />
            </div>
            <h1 className="loginkiosk-title">Connexion</h1>
            {!showLoginForm ? (
              <div className="loginkiosk-qr-section animate-fade-in">
                <div className="loginkiosk-qr-container">
                  <div className="loginkiosk-qr-instructions">
                    <IonIcon icon={phonePortrait} className="loginkiosk-qr-icon" />
                    <p>Scannez ce code QR avec votre application mobile</p>
                  </div>
                  <div className="loginkiosk-qr-code">
                    <QRCodeSVG
                      value={qrCodeData}
                      size={280}
                      level="H"
                      includeMargin={true}
                      bgColor="#ffffff"
                      fgColor="#121660"
                    />
                  </div>
                  <button onClick={showIdentifierLogin} className="loginkiosk-alt-login">
                    Continuez avec identifiant
                  </button>
                </div>
              </div>
            ) : (
              <form className="loginkiosk-form animate-fade-in" onSubmit={handleLogin}>
                <div className="loginkiosk-form-group">
                  <label htmlFor="username" className="loginkiosk-label">
                    Identifiant
                  </label>
                  <input
                    ref={usernameInputRef}
                    type="text"
                    id="username"
                    className="loginkiosk-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Entrez votre identifiant"
                    required
                  />
                </div>
                <div className="loginkiosk-form-group">
                  <label htmlFor="password" className="loginkiosk-label">
                    Mot de passe
                  </label>
                  <div className="loginkiosk-password-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="loginkiosk-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe"
                      required
                    />
                    <div className="loginkiosk-password-toggle" onClick={togglePasswordVisibility}>
                      <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                    </div>
                  </div>
                </div>
                {errorMessage && (
                  <p className="error-message" style={{ color: "red" }}>
                    {errorMessage}
                  </p>
                )}
                <button type="submit" className="loginkiosk-btn" disabled={isLoading}>
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </button>
                <div className="loginkiosk-forgot-password">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("Forgot password");
                    }}
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
              </form>
            )}
            <p className="loginkiosk-message">
              La réussite est à
              <br />
              portée de clic.
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginKiosk;
