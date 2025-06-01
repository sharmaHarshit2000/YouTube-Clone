export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const paddedSecs = secs < 10 ? `0${secs}` : secs;
  const paddedMins = hrs > 0 && mins < 10 ? `0${mins}` : mins;

  return hrs > 0
    ? `${hrs}:${paddedMins}:${paddedSecs}`
    : `${mins}:${paddedSecs}`;
};