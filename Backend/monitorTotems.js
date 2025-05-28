// monitorTotems.js
const Kiosk = require('./models/Kiosk');

async function checkTotemStatus() {
  try {
    const kiosks = await Kiosk.find({ enabled: true });
    const now = Math.floor(Date.now() / 1000); // seconds

    console.log(`Checking ${kiosks.length} kiosks at ${new Date().toISOString()}`);
    for (const kiosk of kiosks) {
      const lastHeartbeat = kiosk.last_heartbeat;
      if (!lastHeartbeat) {
        console.log(` • [${kiosk.SN}] no heartbeat recorded — skipping`);
        continue;
      }

      const age = now - lastHeartbeat;
      console.log(` • [${kiosk.SN}] status=${kiosk.status} last_heartbeat=${lastHeartbeat} age=${age}s`);

      if (kiosk.status !== 'offline' && age > 15) {
        kiosk.status = 'offline';
        kiosk.temperature = 0;
        await kiosk.save();
        console.log(`   → Marked OFFLINE (timeout >15s)`);
      }
    }
  } catch (err) {
    console.error('Error in checkTotemStatus:', err);
  }
}

module.exports = function startTotemMonitor() {
  // Run immediately, then every 10s
  checkTotemStatus();
  setInterval(checkTotemStatus, 10_000);
};
