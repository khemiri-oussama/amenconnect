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

  // ==============================
  // JWT Token & Tenant Configuration
  // ==============================
  // IMPORTANT:
  // - Replace these values with the credentials you obtain from your JaaS provider.
  // - Ensure the tenant (API key) matches the "sub" field of your JWT token.
  const tenant = "vpaas-magic-cookie-3aaa5c6dc3d342e0b40703fe93348e6a" // Your JaaS tenant name (API key)
  const token = "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtM2FhYTVjNmRjM2QzNDJlMGI0MDcwM2ZlOTMzNDhlNmEvZjk1MTY3LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDE0NDc1MDAsImV4cCI6MTc0MTQ1NDcwMCwibmJmIjoxNzQxNDQ3NDk1LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtM2FhYTVjNmRjM2QzNDJlMGI0MDcwM2ZlOTMzNDhlNmEiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImtoZW1pcmlvdXNzYW1hMDAiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTE2NDU1MjU3ODM1MTU1ODAzNTAzIiwiYXZhdGFyIjoiIiwiZW1haWwiOiJraGVtaXJpb3Vzc2FtYTAwQGdtYWlsLmNvbSJ9fSwicm9vbSI6IioifQ.TWnqSFB6kiWXMk2k5xiIBabRaAL6LY9nvDKCu--qvwwsGxIpB9_-yLThedSS86W9fQHwj7z15s9juRE_i3Wet7et7jQMp8bQNVcS3APKcyZF0_caVqi6xMOuixjzOYxSJNs1rKlyIggd4koestAQEd7E3se8pkJPoxeuVSHLa4tf4hIaUg64Uwyi8_I0K83JlmvjE3eQEtBBdbjyYEXT7TF_V-1-2PEpig5gecOPLFJgER-EDlh6YTZyWLUGZQ5qta_hCtnjyTAnf1cKykIkVHlRKc9kb7Cio8fArArTNrenZEXtCk-0d4NMUBF0gcE0-EItCyfaTS35FFFVzU5ufg" // Your JWT token

  // ==============================
  // Construct the URL for your JaaS meeting
  // ==============================
  // Note: The base URL for JaaS is different from the default meet.jit.si.
  const baseUrl = `https://8x8.vc/${tenant}/${secureRoomName}`

  // Configure meeting options via hash parameters
  const hashParams = `#config.prejoinPageEnabled=false` +
    `&config.startWithAudioMuted=false` +
    `&config.startWithVideoMuted=false` +
    `&config.subject=${encodeURIComponent(subject)}` +
    `&userInfo.displayName=${encodeURIComponent(displayName)}` +
    `&userInfo.email=${encodeURIComponent(email)}` +
    `&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","profile","chat","recording","livestreaming","etherpad","sharedvideo","settings","raisehand","videoquality","filmstrip","feedback","stats","shortcuts","tileview","videobackgroundblur","download","help","mute-everyone","security"]` +
    `&interfaceConfig.SETTINGS_SECTIONS=["devices","language","moderator","profile","calendar"]` +
    `&interfaceConfig.SHOW_JITSI_WATERMARK=false` +
    `&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false` +
    `&interfaceConfig.SHOW_BRAND_WATERMARK=false` +
    `&interfaceConfig.GENERATE_ROOMNAMES_ON_WELCOME_PAGE=false` +
    `&interfaceConfig.DISPLAY_WELCOME_PAGE_CONTENT=false`

  // Append the JWT token as a query parameter
  const jitsiUrl = `${baseUrl}?jwt=${token}${hashParams}`

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

    // Set up a message listener for communication from the Jitsi iframe
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message comes from the expected JaaS domain
      if (!event.origin.includes("8x8.vc")) return

      try {
        const data = JSON.parse(event.data)
        // Handle specific events from Jitsi (e.g., conference end)
        if (data.event === "videoConferenceLeft" || data.event === "readyToClose") {
          if (onClose) onClose()
        }
        console.log("Jitsi event:", data)
      } catch (e) {
        // Not a JSON message or other error; ignore.
      }
    }

    window.addEventListener("message", handleMessage)

    // Clean up event listeners on component unmount
    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad)
        iframe.removeEventListener("error", handleIframeError)
      }
      window.removeEventListener("message", handleMessage)
    }
  }, [onClose])

  // Retry loading the iframe on error
  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
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
