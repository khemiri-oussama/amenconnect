import React from "react";
import { useParams } from "react-router-dom";

const JitsiMeetComponent: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const secureRoomName = roomId || "default-room";

  // The tenant value (API key) must match the "sub" field in your JWT token.
  // In your token payload, you have: "sub": "vpaas-magic-cookie-3aaa5c6dc3d342e0b40703fe93348e6a"
  const tenant = "vpaas-magic-cookie-3aaa5c6dc3d342e0b40703fe93348e6a";
  
  // Use the new JWT token provided (ensure it is up-to-date and not expired)
  const token = "dBvWnZx1JtNOOx59pnzjQ6XI6wAOReBR296ZnJ3Z8eSg_OsYSqt4qcNkZqkdzhVOHPl581x7L9C9OawJyUhCcq3-wzTm8Grd0MC3Aq724LXPpXWNalCzOMemsXnM8zPV0QW3zsHbvxY8IptQe80n0a2OV_mptkG82lIAP-Sm9Z4plm8ZVZ5V3E4kEoXXT4KgkaPwT3vIBY8_0HE-5s900OOOcOLLcoM2mtpSZ7GxPwp5VkJLFx0PWsXcYSEA4oKQ3P-uLFaCrRU7EapM4Aj72s8kNWfq6daaIWwB_B4HlT3agrjXRhh4PdZqjXr3jLeTHjzLxy3e069UoF2eV6hXnQ";

  // Construct the base URL for your JaaS deployment
  const baseUrl = `https://8x8.vc/${tenant}/${secureRoomName}`;

  // Configure meeting options via hash parameters (adjust as needed)
  const hashParams = 
    `#config.prejoinPageEnabled=false` +
    `&config.startWithAudioMuted=false` +
    `&config.startWithVideoMuted=false` +
    `&config.subject=${encodeURIComponent("Video Conference")}` +
    `&userInfo.displayName=${encodeURIComponent("Moderator")}` +
    `&userInfo.email=${encodeURIComponent("moderator@example.com")}` +
    // Customize the toolbar buttons as necessary
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
