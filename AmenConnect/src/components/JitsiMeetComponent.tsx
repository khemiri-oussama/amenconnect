import React from "react";
import { useParams } from "react-router-dom";

const JitsiMeetComponent: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  // Use a provided roomId or fallback to a default room
  const secureRoomName = roomId || "default-room";

  // Replce these with your actual API key (tenant) and a freshly generated JWT token
  const tenant = "vpaas-magic-cookie-3aaa5c6dc3d342e0b40703fe93348e6a"; // e.g., vpaas-magic-cookie-xxxxxxxxxxxxxxxx
  const token = "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtM2FhYTVjNmRjM2QzNDJlMGI0MDcwM2ZlOTMzNDhlNmEvZjk1MTY3LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDI3ODA4MjksImV4cCI6MTc0Mjc4ODAyOSwibmJmIjoxNzQyNzgwODI0LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtM2FhYTVjNmRjM2QzNDJlMGI0MDcwM2ZlOTMzNDhlNmEiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImtoZW1pcmlvdXNzYW1hMDAiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTE2NDU1MjU3ODM1MTU1ODAzNTAzIiwiYXZhdGFyIjoiIiwiZW1haWwiOiJraGVtaXJpb3Vzc2FtYTAwQGdtYWlsLmNvbSJ9fSwicm9vbSI6IioifQ.UcNjPGPSkeZ4FvsjA8LrnLmzg6c3Iex2enk00tzZjrcbQZQR5xOnEm8xeoq6Ncj281ZSAMi2NAC7VbM_DCGGsvckwfdiasabeF-C7QBKVJDur7JsfjDh1SLIf2EVHLRIKhsMU-BI4mvLDa1uUAGpSVk8vmXdA6TIw1lVPl-Fsmll2FNU06pDjcIz6705b61Ng-aKBWyzkfbDWro-T8NxuTAHNtc_SwdSuIY2TQH8NJUTo8-MsjC6bDMIFI858NZyGu1GiaqaMoBhb0PAIfAVXs3M21fcTgpLRPHvbglE6Bj7ddedLvSEvMeuZOv16hFLjhtt5LgMzh_-nCGRsl9xOg";

  // Construct the base URL for your JaaS deployment
  const baseUrl = `https://8x8.vc/${tenant}/${secureRoomName}`;

  // Configure meeting options via hash parameters as needed
  const hashParams = 
    `#config.prejoinPageEnabled=false` +
    `&config.startWithAudioMuted=false` +
    `&config.startWithVideoMuted=false` +
    `&config.subject=${encodeURIComponent("Video Conference")}` +
    `&userInfo.displayName=${encodeURIComponent("Moderator")}` +
    `&userInfo.email=${encodeURIComponent("moderator@example.com")}` +
    // Toolbar buttons configuration remains as needed
    `&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","chat","recording"]`;

  // Append the JWT token as a query parameter to the URL
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
