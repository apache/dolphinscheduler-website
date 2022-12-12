import { useEffect, useState } from "react";
import { getVersions, getFaqData } from "../../api/getFaq";

export const useSupport = (locale) => {
  const [versions, setVersions] = useState([]);
  const [version, setVersion] = useState();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFaqData = async (version) => {
    if (loading) return;
    setLoading(true);
    const result = await getFaqData(locale, version);
    setFaqs(result);
    setLoading(false);
  };

  const init = async () => {
    if (loading) return;
    setLoading(true);
    const result = await getVersions();
    setVersions(result);
    setVersion(result[0]);
    await handleFaqData(result[0]);
    setLoading(false);
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, []);

  const handleVersion = (version) => {
    setVersion(version);
    handleFaqData(version);
  };

  return {
    versions,
    version,
    faqs,
    loading,
    handleVersion,
  };
};
