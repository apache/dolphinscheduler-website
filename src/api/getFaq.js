export async function getVersions() {
  try {
    const result = await fetch("/fetch/faq/version.json");
    const versionJson = await result.json();
    return versionJson.reverse();
  } catch (e) {}
  return [];
}

export async function getFaqData(locale, version) {
  try {
    const result = await fetch(`/fetch/faq/${locale}/${version}.json`);
    const faq = await result.json();
    return faq;
  } catch (e) {}
  return [];
}
