import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVersions } from "../../hooks";
import { getDocsMenu } from "../../api/getDocs";
import { getChildrenByKey } from "./helpers";
import DocEvent from "./event";

export const useDocumentation = (params) => {
  const [menu, setMenu] = useState([]);
  const [child, setChild] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const { versions } = useVersions();
  const [structures, setStructures] = useState([]);
  const [currentAnchor, setCurrentAnchor] = useState("");
  const navigate = useNavigate();
  const handleMenu = async () => {
    if (menuLoading) return;
    setMenuLoading(true);
    const result = await getDocsMenu(params.locale, params.version);

    if (result.length && !params["*"]) {
      setChild({
        title: "",
        children: result,
      });
    }

    const childrenByKeys = getChildrenByKey(result, "/" + params["*"]);
    if (childrenByKeys && childrenByKeys.children?.length)
      setChild(childrenByKeys);
    setMenu(result);
    setMenuLoading(false);
  };

  const handleAnchor = (anchor) => {
    document.getElementById(anchor).scrollIntoView();
    setCurrentAnchor(anchor);
  };

  useEffect(() => {
    if (!params.version || !versions.includes(params.version)) return;
    handleMenu();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.some((item) => {
          if (item.isIntersecting) {
            setCurrentAnchor(item.target.id);
            return true;
          }
          return false;
        });
      },
      {
        threshold: 0.2,
      }
    );
    DocEvent.on("structure", ({ detail }) => {
      if (detail?.length) {
        detail.forEach((element, i) => {
          setTimeout(() => {
            const ele = document.getElementById(element.anchor);
            if (ele) {
              observer.observe(ele);
            }
          }, 100);
        });
        setCurrentAnchor(detail[0].anchor);
      }
      setStructures(detail);
    });
    // return () => {
    //   observer.disconnect();
    // };
    // eslint-disable-next-line
  }, [params.version]);

  useEffect(() => {
    if (params["*"]) {
      const childrenByKeys = getChildrenByKey(menu, "/" + params["*"]);
      if (childrenByKeys && childrenByKeys.children?.length)
        setChild(childrenByKeys);
    } else {
      setChild({
        title: "",
        children: menu,
      });
    }
    // eslint-disable-next-line
  }, [params["*"], menu]);

  return {
    menu,
    menuLoading,
    versions,
    structures,
    currentAnchor,
    child,
    setChild,
    navigate,
    handleAnchor,
  };
};
