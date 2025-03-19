// monitorTotems.js
const axios = require('axios');
const Kiosk = require('./models/Kiosk');

const checkTotemStatus = async () => {
  try {
    // Retrieve all enabled kiosks
    const kiosks = await Kiosk.find({ enabled: true });
    
    // Loop over each kiosk and check its API endpoints
    for (const kiosk of kiosks) {
      let statusChanged = false;
      let online = false;
      
      // Check if the kiosk is online using its serial endpoint
      try {
        const serialResponse = await axios.get(`${kiosk.apiUrl}/serial`, { timeout: 3000 });
        if (serialResponse.status === 200 && serialResponse.data.serial_number) {
          online = true;
          if (kiosk.status !== 'online') {
            kiosk.status = 'online';
            console.log(`Kiosk ${kiosk.SN} is online.`);
            statusChanged = true;
          }
        }
      } catch (error) {
        if (kiosk.status !== 'offline') {
          kiosk.status = 'offline';
          console.log(`Kiosk ${kiosk.SN} is offline.`);
          statusChanged = true;
        }
      }
      
      // If online, also fetch the temperature
      if (online) {
        try {
          const tempResponse = await axios.get(`${kiosk.apiUrl}/temperature`, { timeout: 3000 });
          if (tempResponse.status === 200 && typeof tempResponse.data.temperature !== 'undefined') {
            kiosk.temperature = tempResponse.data.temperature;
            console.log(`Updated temperature for kiosk ${kiosk.SN} to ${tempResponse.data.temperature}°C`);
            statusChanged = true;
          }
        } catch (error) {
          console.error(`Error fetching temperature for kiosk ${kiosk.SN}: ${error.message}`);
        }
      }
      
      // Save changes if any were made
      if (statusChanged) {
        await kiosk.save();
      }
    }
  } catch (err) {
    console.error("Error checking kiosks:", err.message);
  }
};

// Check every 10 seconds (adjust as needed)
setInterval(checkTotemStatus, 10000);
