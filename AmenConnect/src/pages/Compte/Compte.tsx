import type React from "react";
import { isPlatform } from "@ionic/react";
import CompteMobile from "./CompteMobile";

import { useEffect, useState, useMemo } from "react";

const Compte: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(orientation: portrait)").matches
  );
  const [isTouchable, setIsTouchable] = useState(false);
  const isMobile = isPlatform("mobile");

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };

    setIsTouchable(typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0));

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Detect if it's a borne interactive (not mobile, portrait, and touch screen)
  const isBorneInteractive = useMemo(() => !isMobile && isPortrait && isTouchable, [isMobile, isPortrait, isTouchable]);

  // Debugging: Log detection values
  console.log("isMobile:", isMobile);
  console.log("isPortrait:", isPortrait);
  console.log("isTouchable:", isTouchable);
  console.log("isBorneInteractive:", isBorneInteractive);

  return <>{isMobile ? <CompteMobile /> : <div>Interface non mobile</div>}</>;
};

export default Compte;
