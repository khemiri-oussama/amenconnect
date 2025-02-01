import type React from "react"
import { isPlatform } from "@ionic/react"
import AccueilMobile from "./AccueilMobile"
import AccueilDesktop from "./AccueilDesktop"

const Accueil: React.FC = () => {
  const isMobile = isPlatform("mobile")

  return <>{isMobile ? <AccueilMobile /> : <AccueilDesktop />}</>
}

export default Accueil

