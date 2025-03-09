import React from "react";
import { useParams } from "react-router-dom";

const JitsiMeetComponent: React.FC = () => {

  const { roomId } = useParams<{ roomId: string }>();
  const secureRoomName = roomId || "default-room";

  const tenant = "vpaas-magic-cookie-3aaa5c6dc3d342e0b40703fe93348e6a";
  const token = "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtM2FhYTVjNmRjM2QzNDJlMGI0MDcwM2ZlOTMzNDhlNmEvZjk1MTY3LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDE0NDc1MDAsImV4cCI6MTc0MTQ1NDcwMCwibmJmIjoxNzQxNDQ3NDk1LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtM2FhYTVjNmRjM2QzNDJlMGI0MDcwM2ZlOTMzNDhlNmEiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImtoZW1pcmlvdXNzYW1hMDAiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTE2NDU1MjU3ODM1MTU1ODAzNTAzIiwiYXZhdGFyIjoiIiwiZW1haWwiOiJraGVtaXJpb3Vzc2FtYTAwQGdtYWlsLmNvbSJ9fSwicm9vbSI6IioifQ.TWnqSFB6kiWXMk2k5xiIBabRaAL6LY9nvDKCu--qvwwsGxIpB9_-yLThedSS86W9fQHwj7z15s9juRE_i3Wet7et7jQMp8bQNVcS3APKcyZF0_caVqi6xMOuixjzOYxSJNs1rKlyIggd4koestAQEd7E3se8pkJPoxeuVSHLa4tf4hIaUg64Uwyi8_I0K83JlmvjE3eQEtBBdbjyYEXT7TF_V-1-2PEpig5gecOPLFJgER-EDlh6YTZyWLUGZQ5qta_hCtnjyTAnf1cKykIkVHlRKc9kb7Cio8fArArTNrenZEXtCk-0d4NMUBF0gcE0-EItCyfaTS35FFFVzU5ufg";


  const baseUrl = `https://8x8.vc/${tenant}/${secureRoomName}`;

  // Configure meeting options using hash parameters (you can adjust these as needed)
  const hashParams = `#config.prejoinPageEnabled=false` +
    `&config.startWithAudioMuted=false` +
    `&config.startWithVideoMuted=false` +
    `&config.subject=${encodeURIComponent("Video Conference")}` +
    `&userInfo.displayName=${encodeURIComponent("Moderator")}` +
    `&userInfo.email=${encodeURIComponent("moderator@example.com")}` +
    `&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","chat","recording"]`;

  // Append the encoded JWT as a query parameter
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
