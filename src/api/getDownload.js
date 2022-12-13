export async function getDeployment() {
  try {
    const result = await fetch("/fetch/deployment.json");
    const json = await result.json();
    return json;
  } catch (e) {}
  return [];
}

export async function getDownloadVersions() {
  try {
    const storedData = sessionStorage.getItem("download");
    if (storedData) return JSON.parse(storedData);
    const result = await fetch("/fetch/download.json");
    const json = await result.json();
    sessionStorage.setItem("download", JSON.stringify(json));
    return json;
  } catch (e) {}
  return [];
}
