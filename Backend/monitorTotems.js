const Kiosk = require('./models/Kiosk');

const checkTotemStatus = async () => {
  try {
    // Retrieve all enabled kiosks
    const kiosks = await Kiosk.find({ enabled: true });
    const now = Date.now() / 1000; // current time in seconds

    for (const kiosk of kiosks) {
      // Use the 'last_heartbeat' field consistently
      const lastHeartbeat = kiosk.last_heartbeat;
      if (!lastHeartbeat) {
        // If there's no heartbeat timestamp, skip this kiosk.
        continue;
      }

      // If the kiosk is currently online and hasn't updated in the last 15 seconds, mark it offline.
      if (kiosk.status === 'online' && (now - lastHeartbeat > 15)) {
        kiosk.status = 'offline';
        kiosk.temperature = 0; // Optionally reset temperature
        await kiosk.save();
        console.log(`Kiosk ${kiosk.SN} marked as offline due to heartbeat timeout.`);
      }
      // If the kiosk is already offline, do nothing.
    }
  } catch (err) {
    console.error('Error checking totem status:', err);
  }
};

setInterval(checkTotemStatus, 10000);
