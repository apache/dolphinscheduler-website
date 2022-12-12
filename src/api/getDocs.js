export async function getDocsMenu(locale, version) {
  try {
    const result = await fetch(`/fetch/doc/${locale}/${version}.json`);
    const json = await result.json();
    return json;
  } catch (e) {}
  return {};
}

export async function getDocDetail(locale, version, name) {
  try {
    const result = await fetch(`/pages/doc/${locale}/${version}/${name}.json`);
    const json = await result.json();
    return json;
  } catch (e) {}
  return {};
}
