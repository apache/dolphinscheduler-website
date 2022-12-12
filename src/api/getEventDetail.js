export async function getEventDetail(locale, name) {
  try {
    const result = await fetch(`/pages/events/${locale}/${name}.json`);
    const json = await result.json();
    return json;
  } catch (e) {}
  return {};
}
