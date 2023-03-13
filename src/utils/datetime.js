export function getCurrentDateTimeString() {
  const today = new Date();
  const date = today.toLocaleDateString();
  const time = today.toLocaleTimeString();
  const formattedDate = `${date} - ${time}`;
  return formattedDate
}
