import { useState, useEffect } from "react";
import { getDownloadVersions } from "../../api/getDownload";
import { getDocDetail } from "../../api/getDocs";
import { useVersions } from "../../hooks";

export const useDownloadVersion = (params, navigate) => {
  const [detail, setDetail] = useState({});
  const [changelog, setChangelog] = useState("");
  const [loading, setLoading] = useState(true);

  const { versions } = useVersions();

  const handleData = async () => {
    const [versionsResult, changelogReslut] = await Promise.all([
      getDownloadVersions(),
      getDocDetail(params.locale, params.version, "changelog"),
    ]);
    setLoading(false);
    setChangelog(changelogReslut.__html);
    setDetail(versionsResult[params.version]);
  };

  useEffect(() => {
    if (!versions.includes(params.version)) {
      navigate(`/${params.locale}/download/${versions[0]}`, { replace: true });
    } else {
      handleData();
    }

    // eslint-disable-next-line
  }, [params.version]);

  return { detail, versions, loading, changelog };
};
