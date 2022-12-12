export async function getBlogs(locale) {
  try {
    const result = await fetch(`/fetch/blog/${locale}.json`);
    const json = await result.json();
    return json;
  } catch (e) {}
  return [];
}
