import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getDeployment, getDownloadVersions } from "../../api/getDownload";
import { getDocDetail } from "../../api/getDocs";
import { formatName } from "../../utils/formatName";

export const useDeployment = (locale) => {
  const [deployments, setDeployments] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const cachedIndex = useRef({});
  const cachedChangelogs = useRef({});

  const handleData = async () => {
    const [versionsResult, deploymentResult] = await Promise.all([
      getDownloadVersions(),
      getDeployment(),
    ]);

    const data = [];

    const type = searchParams.get("t");
    let isMatched = false;
    let currentVersion;
    Object.entries(deploymentResult).forEach(([k, v], i) => {
      const temp = {
        type: k,
        icon: formatName(k),
        versions: [],
      };
      cachedIndex.current[k] = i;
      if (type === temp.icon && !isMatched) {
        isMatched = true;
        setCurrent(i);
      }
      if (Array.isArray(v)) {
        v.reverse().forEach((item, j) => {
          if (j === 0) {
            currentVersion = item;
          }
          temp.versions.push({
            version: item,
            ...versionsResult[item],
          });
        });
      }
      data.push(temp);
    });
    if (!isMatched) {
      setSearchParams(`t=${formatName(data[0].type)}`);
    }
    await handleChangelog(currentVersion);
    setDeployments(data);
    setLoading(false);
  };

  const handleChangelog = async (version) => {
    if (cachedChangelogs.current[version]) return;
    const changelogResult = await getDocDetail(locale, version, "changelog");
    cachedChangelogs.current[version] = changelogResult.__html;
    setCount(Math.random());
  };

  const changeType = (name) => {
    setSearchParams(`t=${formatName(name)}`);
    setCurrent(cachedIndex.current[name]);
  };

  useEffect(() => {
    if (locale) handleData();
    // eslint-disable-next-line
  }, [locale]);

  return {
    deployments,
    current,
    loading,
    changelogs: cachedChangelogs.current,
    changeType,
    handleChangelog,
  };
};
