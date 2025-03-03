import type React from "react"
import { IonIcon } from "@ionic/react"
import { checkmarkOutline } from "ionicons/icons"

interface ToastProps {
  message: string
  isOpen: boolean
}

const Toast: React.FC<ToastProps> = ({ message, isOpen }) => {
  if (!isOpen) return null

  return (
    <div className="toast-container">
      <div className="toast-message">
        <IonIcon icon={checkmarkOutline} />
        <span>{message}</span>
      </div>
    </div>
  )
}

export default Toast

