const Kiosk = require('./models/Kiosk');

const checkTotemStatus = async () => {
  try {
    // Retrieve all enabled kiosks
    const kiosks = await Kiosk.find({ enabled: true });
    const now = Date.now() / 1000; // current time in seconds

    for (const kiosk of kiosks) {
      const lastHeartbeat = kiosk.last_heartbeat || kiosk.lastHeartbeat || 0;
      // Use a threshold of 15 seconds instead of 10 seconds.
      if (now - lastHeartbeat > 15 && kiosk.status !== 'offline') {
        kiosk.status = 'offline';
        kiosk.temperature = 0; // Optionally reset temperature
        await kiosk.save();
        console.log(`Kiosk ${kiosk.SN} marked as offline due to heartbeat timeout.`);
      }
    }
  } catch (err) {
    console.error('Error checking totem status:', err);
  }
};

setInterval(checkTotemStatus, 10000);

