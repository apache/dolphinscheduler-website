import { useState, useEffect } from "react";

export const useSearch = (version) => {
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const handleSearch = (value) => {
    if (!value || loading) return;
    setLoading(true);
    window.WORKER.postMessage({
      type: "search-doc",
      value,
      version,
    });
    setSearchValue(value);
  };

  useEffect(() => {
    const handleMessage = ({ data }) => {
      if (data.loaded !== void 0) {
        setLoading(!data.loaded);
        return;
      }

      if (data.type === "search-doc") {
        setLoading(false);
        setList(data.result);
      }
    };
    window.WORKER.postMessage("check");
    window.WORKER.addEventListener("message", handleMessage);

    return () => {
      window.WORKER.removeEventListener("message", handleMessage);
    };
    // eslint-disable-next-line
  }, []);

  return {
    showModal,
    setShowModal,
    searchList: list,
    searchValue,
    handleSearch,
    loading,
  };
};
