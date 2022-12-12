import { useEffect, useState } from "react";
import { getBlogDetail } from "../../api/getBlogDetail";
import { formatDate } from "../../utils/formatDate";

export const useBlogDetail = (locale, name) => {
  const [detail, setDetail] = useState({ __html: "", time: "" });
  const [loading, setLoading] = useState(true);

  const handleDetail = async () => {
    const result = await getBlogDetail(locale, name);
    if (result.time) {
      result.time = formatDate(result.time, locale);
    }
    setDetail(result);
    setLoading(false);
  };

  useEffect(() => {
    if (locale && name) {
      handleDetail();
    }
    // eslint-disable-next-line
  }, []);

  return { detail, loading };
};
