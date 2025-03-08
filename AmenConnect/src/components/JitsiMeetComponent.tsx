import React from "react";
import { useParams } from "react-router-dom";

const JitsiMeetComponent: React.FC = () => {
  // Retrieve the roomId from the URL parameters
  const { roomId } = useParams<{ roomId: string }>();

  // Use the roomId or provide a fallback if necessary
  const jitsiUrl = `https://meet.jit.si/${roomId || "default-room"}`;

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
