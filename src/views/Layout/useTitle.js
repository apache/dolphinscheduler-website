import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "../../hooks";

export function useTitle() {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (location.pathname.includes("docs")) {
      document.title = t("documentation_title");
      return;
    }
    if (location.pathname.includes("community")) {
      document.title = t("community_title");
      return;
    }
    if (location.pathname.includes("events")) {
      document.title = t("event_title");
      return;
    }
    if (location.pathname.includes("blog")) {
      document.title = t("blog_title");
      return;
    }
    if (location.pathname.includes("use_case")) {
      document.title = t("cases_title");
      return;
    }
    if (location.pathname.includes("support")) {
      document.title = t("support_title");
      return;
    }
    if (location.pathname.includes("download")) {
      document.title = t("download_title");
      return;
    }
  }, [location, t]);
}
