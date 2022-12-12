export default async function getLocales(locale) {
  try {
    // const storedLocales = sessionStorage.getItem("locales");
    // const storedLocale = sessionStorage.getItem("locale");
    // if (storedLocale === locale && storedLocales)
    //   return JSON.parse(storedLocales);
    const result = await fetch(`/locales/${locale}.json`);
    const languageMap = await result.json();
    sessionStorage.setItem("locales", JSON.stringify(languageMap));
    sessionStorage.setItem("locale", locale);
    return languageMap;
  } catch (e) {}
  return {};
}
