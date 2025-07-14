export const formatDuration = (seconds) => {
  // Return "0:00" if input is missing or not a number
  if (!seconds || isNaN(seconds)) return "0:00";

  // Calculate hours, minutes, and seconds from total seconds
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  // Pad seconds with leading zero if less than 10
  const paddedSecs = secs < 10 ? `0${secs}` : secs;

  // Pad minutes with leading zero if there are hours and minutes < 10 
  const paddedMins = hrs > 0 && mins < 10 ? `0${mins}` : mins;

  // Format string differently if hours exist (H:MM:SS) or not (M:SS)
  return hrs > 0
    ? `${hrs}:${paddedMins}:${paddedSecs}`
    : `${mins}:${paddedSecs}`;
};
