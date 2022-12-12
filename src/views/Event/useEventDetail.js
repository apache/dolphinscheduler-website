import { useEffect, useState } from "react";
import { getEventDetail } from "../../api/getEventDetail";

export const useEventDetail = (locale, name) => {
  const [detail, setDetail] = useState({ __html: "", time: "" });
  const [loading, setLoading] = useState(false);

  const handleDetail = async () => {
    if (loading) return;
    setLoading(true);
    const result = await getEventDetail(locale, name);
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
