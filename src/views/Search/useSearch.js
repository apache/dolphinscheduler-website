import { useState, useEffect } from "react";
const TABS = [
  {
    label: "Documentation",
    key: "doc",
    list: [],
    sort: "0",
  },
  {
    label: "Events",
    key: "event",
    list: [],
    sort: "0",
  },
  {
    label: "Blog",
    key: "blog",
    list: [],
    sort: "0",
  },
  {
    label: "FAQs",
    key: "faq",
    list: [],
    sort: "0",
  },
];

export const useSearch = () => {
  const [tabs, setTabs] = useState(TABS);
  const [loading, setLoading] = useState(false);

  const handleSearch = (value) => {
    if (loading) return;
    setLoading(true);
    window.WORKER.postMessage({
      type: "search",
      value,
    });
  };

  const handleSort = (value, index) => {
    let list = tabs[index].list;
    tabs[index].sort = value;
    if (value === "0") {
      list.sort((a, b) => a.i - b.i);
    } else if (value === "1") {
      list.sort((a, b) => b.time - a.time);
    }
    setTabs(JSON.parse(JSON.stringify(tabs)));
  };

  useEffect(() => {
    const handleMessage = ({ data }) => {
      if (data.loaded !== void 0) {
        setLoading(!data.loaded);
        return;
      }

      if (data.type === "search") {
        const tabs = [
          {
            label: `Documentation(${data.doc.length})`,
            key: "doc",
            list: data.doc.sort((a, b) => a.i - b.i),
            sort: "0",
          },
          {
            label: `Events(${data.event.length})`,
            key: "event",
            list: data.event.sort((a, b) => a.i - b.i),
            sort: "0",
          },
          {
            label: `Blog(${data.blog.length})`,
            key: "blog",
            list: data.blog.sort((a, b) => a.i - b.i),
            sort: "0",
          },
          {
            label: `FAQs(${data.faq.length})`,
            key: "faq",
            list: data.faq.sort((a, b) => a.i - b.i),
            sort: "0",
          },
        ];
        setTabs(tabs);
        setLoading(false);
      }
    };
    window.WORKER.postMessage("check");
    window.WORKER.addEventListener("message", handleMessage);

    return () => {
      window.WORKER.removeEventListener("message", handleMessage);
    };
    // eslint-disable-next-line
  }, []);

  return { tabs, loading, handleSearch, handleSort };
};
