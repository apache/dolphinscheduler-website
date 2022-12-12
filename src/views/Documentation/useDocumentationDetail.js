import { useEffect, useState } from "react";
import { getDocDetail } from "../../api/getDocs";
import DocEvent from "./event";

export const useDocumentationDetail = (params) => {
  const [detailLoading, setDetailLoading] = useState(true);
  const [detail, setDetail] = useState({ __html: "", time: "" });

  const handleDocDetail = async () => {
    const result = await getDocDetail(
      params.locale,
      params.version,
      params["*"]
    );
    setDetail(result);
    setDetailLoading(false);
    DocEvent.dispatch("structure", result.structure);
  };

  useEffect(() => {
    handleDocDetail();
    // eslint-disable-next-line
  }, [params]);

  return { detail, detailLoading };
};
