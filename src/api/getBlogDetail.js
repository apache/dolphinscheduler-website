export async function getBlogDetail(locale, name) {
  try {
    const result = await fetch(`/pages/blog/${locale}/${name}.json`);
    const json = await result.json();
    return json;
  } catch (e) {}
  return {};
}
