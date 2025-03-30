import type React from "react"
import { isPlatform } from "@ionic/react"
import HomeMobile from "./HomeMobile"
import HomeDesktop from "./HomeDesktop"
import HomeKiosk from "./HomeKiosk"
import { useEffect, useState } from "react"

const Home: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches)
  const [isTouchable, setIsTouchable] = useState(false)
  const isMobile = isPlatform("android") || isPlatform("ios")
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches)
    }

    // Check touch support
    setIsTouchable("ontouchstart" in window || navigator.maxTouchPoints > 0)

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Detect if it's a borne interactive (not mobile, portrait, and touch screen)
  const isBorneInteractive = !isMobile && isPortrait

  return (
    <>
      {isBorneInteractive ? (
        <HomeKiosk />
      ) : isMobile ? (
        <HomeMobile />
      ) : (
        <HomeDesktop />
      )}
    </>
  );
};

export default Home