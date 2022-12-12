export const getLanguageCodeFromLS = () => {
  try {
    const codeFromStorage = localStorage.getItem("ds_language");
    if (codeFromStorage) return codeFromStorage;
    const codeFromNavigator = navigator.language;
    if (codeFromNavigator.includes("en")) return "en-us";
    if (codeFromNavigator.includes("zh")) return "zh-cn";
    return "en-us";
  } catch {
    return "en-us";
  }
};
