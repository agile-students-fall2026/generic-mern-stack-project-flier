// Convert the local date and time field values to the ISO timestamp expected by the API.
export function localDateTimeToIso(date, time) {
  if (!date || !time) {return "";}
  const start = new Date(`${date}T${time}`);
  return Number.isNaN(start.getTime()) ? "" : start.toISOString();
}
