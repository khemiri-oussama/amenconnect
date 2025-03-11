// Mock data service to simulate API calls

export const fetchSystemStats = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    time: new Date().toLocaleTimeString("en-US"),
    cpuUsage: Math.random() * 50 + 10, // Random value between 10 and 60
  }
}

export const fetchRoleDistribution = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    admins: Math.floor(Math.random() * 5) + 8, // 8-12
    moderators: Math.floor(Math.random() * 10) + 10, // 10-19
    users: Math.floor(Math.random() * 20) + 50, // 50-69
    guests: Math.floor(Math.random() * 10) + 10, // 10-19
  }
}

