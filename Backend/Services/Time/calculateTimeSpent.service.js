

const calculateTimeSpent = (checkInStr) => {
  if (!checkInStr) return "N/A";
  const checkIn = new Date(checkInStr);
  const now = new Date(); // Current time
  
  // If check-in time is in the future (due to dummy data timezone issues), fallback to 0
  const diffMs = Math.max(0, now - checkIn); 
  
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffHrs} Hours ${diffMins} Minutes`;
};

export default calculateTimeSpent
