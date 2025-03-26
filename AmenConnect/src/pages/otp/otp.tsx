import type React from "react"
import { RouteComponentProps } from 'react-router-dom';
import { isPlatform } from "@ionic/react"
import OtpMobile from "./otpMobile"
import OtpDesktop from "./otpDesktop"
import OtpKiosk from "./otpKiosk"
import { useEffect, useState } from "react"

interface Otp extends RouteComponentProps {}

const Otp: React.FC<Otp> = (props) => {
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
      {isMobile ? (
        <OtpMobile />
      ) : isBorneInteractive ? (
        <OtpKiosk />
      ) : (
        <OtpDesktop />
      )}
    </>
  )
}

export default Otp
