import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "../../hooks";

export function useTitle() {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const pages = [
      "docs",
      "community",
      "events",
      "blog",
      "use_case",
      "support",
      "download",
    ];

    let title = "Apache DolphinScheduler";
    let keywords = "";

    pages.some((item) => {
      if (location.pathname.includes(item)) {
        title = t(`${item}_title`);
        keywords = t(`keywords_${item}`);
        return true;
      }
      return false;
    });

    document.title = title;
    const descriptionElement = document.querySelector(`meta[name=description]`);
    const keywordsElement = document.querySelector(`meta[name=keywords]`);
    if (keywordsElement) {
      keywordsElement.setAttribute("content", t(keywords));
    }
    if (descriptionElement) {
      descriptionElement.setAttribute("content", t("description"));
    }
  }, [location, t]);
}
