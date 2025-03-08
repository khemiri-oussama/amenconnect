"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface JitsiMeetComponentProps {
  roomName: string
  displayName?: string
  email?: string
  subject?: string
  width?: string
  height?: string
  onApiReady?: (api: any) => void
  onClose?: () => void
}

const JitsiMeetComponent: React.FC<JitsiMeetComponentProps> = ({
  roomName,
  displayName = "Admin",
  email = "",
  subject = "Video Conference",
  width = "100%",
  height = "100%",
  onApiReady,
  onClose,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Generate a secure room name if not provided
  const secureRoomName = roomName || `secure-${Math.random().toString(36).substring(2, 15)}`

  // Build the Jitsi URL with configuration parameters
  const jitsiUrl = `https://meet.jit.si/${secureRoomName}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.subject=${encodeURIComponent(subject)}&userInfo.displayName=${encodeURIComponent(displayName)}&userInfo.email=${encodeURIComponent(email)}&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","profile","chat","recording","livestreaming","etherpad","sharedvideo","settings","raisehand","videoquality","filmstrip","feedback","stats","shortcuts","tileview","videobackgroundblur","download","help","mute-everyone","security"]&interfaceConfig.SETTINGS_SECTIONS=["devices","language","moderator","profile","calendar"]&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false&interfaceConfig.SHOW_BRAND_WATERMARK=false&interfaceConfig.GENERATE_ROOMNAMES_ON_WELCOME_PAGE=false&interfaceConfig.DISPLAY_WELCOME_PAGE_CONTENT=false`

  useEffect(() => {
    // Handle iframe load events
    const handleIframeLoad = () => {
      setIsLoading(false)
    }

    // Handle iframe error events
    const handleIframeError = () => {
      setError("Failed to load Jitsi Meet")
      setIsLoading(false)
    }

    // Add event listeners to the iframe
    const iframe = iframeRef.current
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad)
      iframe.addEventListener("error", handleIframeError)
    }

    // Set up message listener for communication with the Jitsi iframe
    const handleMessage = (event: MessageEvent) => {
      // Only handle messages from Jitsi
      if (event.origin !== "https://meet.jit.si") return

      try {
        const data = JSON.parse(event.data)

        // Handle specific events from Jitsi
        if (data.event === "videoConferenceLeft" || data.event === "readyToClose") {
          if (onClose) onClose()
        }

        // You can handle more events here as needed
        console.log("Jitsi event:", data)
      } catch (e) {
        // Not a JSON message or other error
      }
    }

    window.addEventListener("message", handleMessage)

    // Clean up event listeners
    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad)
        iframe.removeEventListener("error", handleIframeError)
      }
      window.removeEventListener("message", handleMessage)
    }
  }, [onClose])

  // Handle retry when loading fails
  const handleRetry = () => {
    setIsLoading(true)
    setError(null)

    // Force iframe reload
    if (iframeRef.current) {
      const src = iframeRef.current.src
      iframeRef.current.src = ""
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = src
      }, 100)
    }
  }

  return (
    <div style={{ position: "relative", height, width }}>
      {isLoading && (
        <div className="jitsi-loading">
          <div className="jitsi-loading-spinner"></div>
          <p>Chargement de la visioconférence...</p>
        </div>
      )}

      {error && (
        <div className="jitsi-error">
          <div className="jitsi-error-icon"></div>
          <p>{error}</p>
          <button className="jitsi-retry-button" onClick={handleRetry}>
            Réessayer
          </button>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={jitsiUrl}
        style={{
          width: "100%",
          height: "100%",
          border: "0",
          display: isLoading || error ? "none" : "block",
        }}
        allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
        allowFullScreen
        title="Video Conference"
      />
    </div>
  )
}

export default JitsiMeetComponent

