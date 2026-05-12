/** Format UTC unix seconds as city wall clock using OpenWeather `timezone` offset (seconds from UTC). */
export function formatCityWallTime(unixUtcSec, timezoneOffsetSec) {
  const d = new Date(unixUtcSec * 1000);
  const utcM = d.getUTCHours() * 60 + d.getUTCMinutes();
  const offM = Math.round(timezoneOffsetSec / 60);
  let local = (utcM + offM) % (24 * 60);
  if (local < 0) local += 24 * 60;
  const hh = Math.floor(local / 60) % 24;
  const mm = local % 60;
  const h12 = hh % 12 || 12;
  const ampm = hh >= 12 ? 'PM' : 'AM';
  return `${h12}:${String(mm).padStart(2, '0')} ${ampm}`;
}

/** Short label like "3 PM" for hourly strips (uses same offset rules as `formatCityWallTime`). */
export function formatCityHourShort(unixUtcSec, timezoneOffsetSec) {
  const d = new Date(unixUtcSec * 1000);
  const utcM = d.getUTCHours() * 60 + d.getUTCMinutes();
  const offM = Math.round(timezoneOffsetSec / 60);
  let local = (utcM + offM) % (24 * 60);
  if (local < 0) local += 24 * 60;
  const hh = Math.floor(local / 60) % 24;
  const h12 = hh % 12 || 12;
  const ampm = hh >= 12 ? 'PM' : 'AM';
  return `${h12} ${ampm}`;
}
