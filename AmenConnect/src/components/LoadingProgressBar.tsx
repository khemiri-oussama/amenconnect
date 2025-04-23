import type React from "react"
import { IonProgressBar } from "@ionic/react"
import "./LoadingProgressBar.css"

interface LoadingProgressBarProps {
  color?: string // Optional color prop with default in CSS
  height?: number // Optional height in pixels
  position?: "top" | "bottom" // Optional position
  type?: "determinate" | "indeterminate" // Progress bar type
  value?: number // For determinate progress
}

const LoadingProgressBar: React.FC<LoadingProgressBarProps> = ({
  color,
  height,
  position = "top",
  type = "indeterminate",
  value = 0,
}) => {
  return (
    <div className={`loading-progress-bar ${position}`} style={{ height: height ? `${height}px` : undefined }}>
      <IonProgressBar type={type} value={value} color={color || "success"} />
    </div>
  )
}

export default LoadingProgressBar
