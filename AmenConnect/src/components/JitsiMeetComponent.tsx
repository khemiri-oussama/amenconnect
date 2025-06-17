import React from "react";
import { useParams } from "react-router-dom";

const JitsiMeetComponent: React.FC = () => {
  // Retrieve the roomId from the URL parameters (fallback to "default-room")
  const { roomId } = useParams<{ roomId: string }>();
  const secureRoomName = roomId || "default-room";

  // Tenant (API key) must match the "sub" claim in your JWT token.
  // Here it is: "vpas-magic-cookie-3aaa5c6dc3d342e0b40703fe93348e6a"
  const tenant = "vpaas-magic-cookie-3aaa5c6dc3d342e0b40703fe93348e6a"; // Your JaaS tenant name (API key)
const token ="eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtM2FhYTVjNmRjM2QzNDJlMGI0MDcwM2ZlOTMzNDhlNmEvZjk1MTY3LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NTAxNjY5MzMsImV4cCI6MTc1MDE3NDEzMywibmJmIjoxNzUwMTY2OTI4LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtM2FhYTVjNmRjM2QzNDJlMGI0MDcwM2ZlOTMzNDhlNmEiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlLCJmbGlwIjpmYWxzZX0sInVzZXIiOnsiaGlkZGVuLWZyb20tcmVjb3JkZXIiOmZhbHNlLCJtb2RlcmF0b3IiOnRydWUsIm5hbWUiOiJraGVtaXJpb3Vzc2FtYTAwIiwiaWQiOiJnb29nbGUtb2F1dGgyfDExNjQ1NTI1NzgzNTE1NTgwMzUwMyIsImF2YXRhciI6IiIsImVtYWlsIjoia2hlbWlyaW91c3NhbWEwMEBnbWFpbC5jb20ifX0sInJvb20iOiIqIn0.Bkve-6pnUVBkWtp_htCX31wyZ_tHfJD7f8iz6GHKW-pV4KEb2zAInHuL_adKIVnT_HBlZw5PjcEIfou5iZiA1P6iotyswLr4FL9HD-9YDL-4parJdp34g6au578znFAB8TH-nXD69s5RDwSQ15WSxUnioenVIYal4MFfu84UqdkBmAhnGHio0FvhER9x4gJU6avHJVfRL6wMHrGHLh77qFQMwUONnTV5Y1UtkmDHogzsK6gQJkNKnqsabGX4bcd5zIwCC61ocvhw5joyXFyfb5CGOqZSUWMPEB3f3aOTg5Gdq7k_CA900SsO8OEuotX0a080vsZbVgIBmyUAldYIlw"  // Construct the base URL for your 8×8 JaaS meeting deployment
  const baseUrl = `https://8x8.vc/${tenant}/${secureRoomName}`;

  // Append configuration parameters to the URL via hash parameters.
  const hashParams = 
    `#config.prejoinPageEnabled=false` +
    `&config.startWithAudioMuted=false` +
    `&config.startWithVideoMuted=false` +
    `&config.subject=${encodeURIComponent("Video Conference")}` +
    `&userInfo.displayName=${encodeURIComponent("Moderator")}` +
    `&userInfo.email=${encodeURIComponent("moderator@example.com")}` +
    `&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","chat","recording"]`;

  // The full URL includes the JWT token appended as a query parameter.
  const jitsiUrl = `${baseUrl}?jwt=${token}${hashParams}`;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <iframe
        src={jitsiUrl}
        style={{ width: "100%", height: "100%", border: "0" }}
        allow="camera; microphone; fullscreen; display-capture"
        title="Video Conference"
      />
    </div>
  );
};

export default JitsiMeetComponent;
