import type React from "react"
import { isPlatform } from "@ionic/react"
import VirementMobile from "./virementMobile"
import VirementDesktop from "./VirementDesktop"
import VirementKiosk from "./VirementKiosk"

import { useEffect, useState } from "react"

const Virement: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches)
  const [isTouchable, setIsTouchable] = useState(false)
  const isMobile = isPlatform("android") || isPlatform("ios")

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches)
    }

    setIsTouchable("ontouchstart" in window || navigator.maxTouchPoints > 0)

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isBorneInteractive = !isMobile && isPortrait && isTouchable


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
