export default async function getEvents(locale) {
  try {
    const result = await fetch(`/fetch/event/${locale}.json`);
    const events = await result.json();
    return events;
  } catch (e) {}
  return [];
}
