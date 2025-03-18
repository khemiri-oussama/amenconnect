// monitorTotems.js
const axios = require('axios');
const Kiosk = require('./models/Kiosk');

const checkTotemStatus = async () => {
  try {
    // Retrieve all kiosks that are enabled (or whichever criteria applies)
    const kiosks = await Kiosk.find({ enabled: true });
    
    // Loop over each kiosk and check its API endpoint
    for (const kiosk of kiosks) {
      try {
        // Use the kiosk's stored API URL
        const response = await axios.get(`${kiosk.apiUrl}/serial`, { timeout: 3000 });
        if (response.status === 200 && response.data.serial_number) {
          if (kiosk.status !== 'online') {
            kiosk.status = 'online';
            await kiosk.save();
            console.log(`Kiosk ${kiosk.SN} is online.`);
          }
        }
      } catch (error) {
        // If request fails, mark the kiosk as offline
        if (kiosk.status !== 'offline') {
          kiosk.status = 'offline';
          await kiosk.save();
          console.log(`Kiosk ${kiosk.SN} is offline.`);
        }
      }
    }
  } catch (err) {
    console.error("Error checking kiosks:", err.message);
  }
};

// Check every 10 seconds (adjust as needed)
setInterval(checkTotemStatus, 10000);
