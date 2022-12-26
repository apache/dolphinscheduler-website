export async function getUser(lang) {
  try {
    const result = await fetch(`/user/${lang}/index.json`);
    const versionJson = await result.json();
    return versionJson;
  } catch (e) {}
  return [];
}
