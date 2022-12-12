export default async function getVersions() {
  try {
    const stored = JSON.parse(sessionStorage.getItem("versions"));
    if (stored) return stored;
    const result = await fetch("/fetch/version.json");
    const versionJson = await result.json();
    sessionStorage.setItem("versions", JSON.stringify(versionJson));
    return versionJson;
  } catch (e) {}
  return [];
}
