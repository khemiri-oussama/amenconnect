const si = require("systeminformation");

exports.getSystemStats = async (req, res) => {
  try {
    // Get CPU load data
    const cpuData = await si.currentLoad();
    const cpuUsage = parseFloat(cpuData.currentLoad.toFixed(2));

    // Get memory data and calculate usage percentage
    const memData = await si.mem();
    const ramUsage = parseFloat(((memData.used / memData.total) * 100).toFixed(2));

    // Get disk usage data (using the first filesystem entry)
    const fsData = await si.fsSize();
    const diskUsage = fsData.length > 0 ? parseFloat(fsData[0].use.toFixed(2)) : 0;

    // Return CPU, RAM, and Disk usage with the current time
    res.json({ time: new Date().toLocaleTimeString(), cpuUsage, ramUsage, diskUsage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
