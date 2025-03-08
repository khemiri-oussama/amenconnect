import React from 'react';

const JitsiMeetComponent: React.FC = () => {
  // Use a static or dynamic room name
  const roomName = 'DemoRoom123';
  const jitsiUrl = `https://meet.jit.si/${roomName}`;

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <iframe
        src={jitsiUrl}
        style={{ width: '100%', height: '100%', border: '0' }}
        allow="camera; microphone; fullscreen; display-capture"
        title="Video Conference"
      />
    </div>
  );
};

export default JitsiMeetComponent;
