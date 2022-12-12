import { useContext } from "react";
import { LocaleContext } from "../LocaleContext";

export const useTranslation = () => {
  const { locales, locale } = useContext(LocaleContext);
  const t = (key) => locales[key] || key;
  return { t, locale };
};
