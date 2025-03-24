import React from "react";
import { useParams } from "react-router-dom";

const JitsiMeetComponent: React.FC = () => {
  // Retrieve the roomId from the URL parameters (fallback to "default-room")
  const { roomId } = useParams<{ roomId: string }>();
  const secureRoomName = roomId || "default-room";

  // Tenant (API key) must match the "sub" claim in your JWT token.
  // Here it is: "vpas-magic-cookie-3aaa5c6dc3d342e0b40703fe93348e6a"
  const tenant = "vpaas-magic-cookie-3aaa5c6dc3d342e0b40703fe93348e6a" // Your JaaS tenant name (API key)
  const token = "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtM2FhYTVjNmRjM2QzNDJlMGI0MDcwM2ZlOTMzNDhlNmEvZjk1MTY3LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDI4MDQ3NjQsImV4cCI6MTc0MjgxMTk2NCwibmJmIjoxNzQyODA0NzU5LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtM2FhYTVjNmRjM2QzNDJlMGI0MDcwM2ZlOTMzNDhlNmEiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImtoZW1pcmlvdXNzYW1hMDAiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTE2NDU1MjU3ODM1MTU1ODAzNTAzIiwiYXZhdGFyIjoiIiwiZW1haWwiOiJraGVtaXJpb3Vzc2FtYTAwQGdtYWlsLmNvbSJ9fSwicm9vbSI6IioifQ.EniefGmYpbGTrf6m1DgBE1bxRDCIZqzsRpv5GOiK4mlJydAU8m2rUawgSyYmFNOF0pyo_WEaTG2NuhThJ5Cadf2waaRxto4IcwRALYbY4-FcBT00R80lKM7SngKxHJntUtMOO7sTOdK-tsX22qelUbMjwFt2ZEPPZJYwvHfB5rmbrcrgqxO_Rp8DmWa1X0lx-KVUgYnGBRcbH9oD_q4ibpokxc9MIqwxmpDM_9Fr0dFonF6tEoq65zV8njz4gqWp-jg3PF_SUyygRq4F1KsOLaY9JXi2ixrFp0gYQlq8eeo_pCqK6pUJKm_ks7Ni-cZ4FT7ad4s76b6wQrxwF8HDbQ"

  // Construct the base URL for your 8×8 JaaS meeting deployment
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
