import type React from "react"
import { isPlatform } from "@ionic/react"
import VirementMobile from "./virementMobile"
import VirementDesktop from "./VirementDesktop"
import VirementKiosk from "./VirementKiosk"

import { useEffect, useState } from "react"

const Virement: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches)
  const [isTouchable, setIsTouchable] = useState(false)
  const isMobile = isPlatform("mobile")

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
  const isBorneInteractive = !isMobile && isPortrait && isTouchable

  // Debugging: Log detection values
  console.log("isMobile:", isMobile)
  console.log("isPortrait:", isPortrait)
  console.log("isTouchable:", isTouchable)
  console.log("isBorneInteractive:", isBorneInteractive)

  return (
    <>
      {isMobile ? (
        <VirementMobile />
      ) : isBorneInteractive ? (
        <VirementKiosk />
      ) : (
        <VirementDesktop />
      )}
    </>
  )
}

export default Virement
